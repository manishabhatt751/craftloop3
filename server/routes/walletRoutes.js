const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { protect } = require("../middleware/authMiddleware");

// All wallet routes require authentication
router.use(protect);

router.get("/", walletController.getWallet);
router.post("/withdraw", walletController.withdraw);

module.exports = router;
