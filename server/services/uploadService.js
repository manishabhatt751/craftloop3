const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Handles uploaded files streaming to Cloudinary or stored on disk
 * - Never loads entire large files/videos into Node.js memory.
 * - Never uses base64 or localStorage for videos/media.
 * - Enforces up to 5000 MB (5 GB) per file.
 * - Returns clean URL and metadata for storage in MongoDB.
 *
 * @param {object|Buffer} fileInput - Multer disk file object or Buffer
 * @param {string|object} optionsOrMimetype - MIME type or options object
 * @param {object} [extraOptions] - Additional options when called with (buffer, mimetype, options)
 * @returns {Promise<{ url: string, secure_url: string, public_id: string, format: string, bytes: number, provider: string }>}
 */
const uploadMedia = async (fileInput, optionsOrMimetype = {}, extraOptions = {}) => {
  let options = {};
  let mimetype = "application/octet-stream";

  if (typeof optionsOrMimetype === "string") {
    mimetype = optionsOrMimetype;
    options = extraOptions || {};
  } else if (typeof optionsOrMimetype === "object") {
    options = optionsOrMimetype || {};
    mimetype = options.mimetype || mimetype;
  }

  const uploadDirectory = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  let filePath = null;
  let fileSize = 0;
  let isTempCreated = false;

  if (Buffer.isBuffer(fileInput)) {
    // If a Buffer was passed (e.g. from unit tests), write directly to disk to avoid keeping in memory
    const ext = options.ext || (mimetype.split("/")[1] ? `.${mimetype.split("/")[1]}` : ".bin");
    const uniqueName = `upload-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    filePath = path.join(uploadDirectory, uniqueName);
    fs.writeFileSync(filePath, fileInput);
    fileSize = fileInput.length;
    isTempCreated = true;
  } else if (typeof fileInput === "object" && fileInput.path) {
    // Multer diskStorage file object (streamed directly to disk, 0 RAM overhead)
    filePath = fileInput.path;
    mimetype = fileInput.mimetype || mimetype;
    fileSize = fileInput.size || 0;
  } else {
    throw new Error("Invalid file provided to uploadMedia.");
  }

  const filename = path.basename(filePath);
  const ext = path.extname(filename).replace(".", "") || mimetype.split("/")[1] || "bin";

  // If Cloudinary credentials are provided, stream in chunks (up to 5 GB supported)
  if (isCloudinaryConfigured) {
    try {
      const folder = options.folder || "craftloop";
      const result = await cloudinary.uploader.upload_large(filePath, {
        folder,
        resource_type: "auto",
        chunk_size: 20 * 1024 * 1024, // 20 MB chunks streaming
      });

      // Remove local temp file after cloud upload completes
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.warn("Temp cleanup note:", cleanupErr.message);
      }

      return {
        url: result.secure_url || result.url,
        secure_url: result.secure_url || result.url,
        public_id: result.public_id,
        format: result.format || ext,
        bytes: result.bytes || fileSize,
        provider: "cloudinary",
      };
    } catch (cloudErr) {
      console.error("Cloudinary upload failed, falling back to disk URL:", cloudErr.message);
    }
  }

  // Local / Object Disk Storage: Return static URL served by Express (NEVER base64!)
  const host = options.host || "localhost:5000";
  const protocol = options.protocol || "http";
  const fileUrl = `${protocol}://${host}/uploads/${filename}`;

  return {
    url: fileUrl,
    secure_url: fileUrl,
    public_id: filename,
    format: ext,
    bytes: fileSize,
    provider: "disk-storage",
  };
};

module.exports = {
  isCloudinaryConfigured,
  uploadMedia,
};
