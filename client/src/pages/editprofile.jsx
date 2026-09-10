import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function EditProfile() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: 'Alex Morgan',
    username: 'alexmorgan',
    bio: 'Creative designer passionate about branding, visual storytelling and creating meaningful experiences.',
    location: 'India',
    profession: 'Designer',
    skills: 'UI/UX Design, Graphic Design, Branding, Figma',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    alert('Profile updated successfully!')

    navigate('/profile')
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-main">

        {/* Header */}
        <div className="edit-profile-header">

          <div>
            <p className="edit-profile-label">PROFILE SETTINGS</p>

            <h1>Edit Profile</h1>

            <p>
              Update your profile information and let people know more about you.
            </p>
          </div>

          <button
            className="back-profile-btn"
            onClick={() => navigate('/profile')}
          >
            ← Back to Profile
          </button>

        </div>

        {/* Form */}
        <div className="edit-profile-layout">

          <div className="edit-profile-card">

            <form onSubmit={handleSubmit}>

              {/* Profile Photo */}
              <div className="edit-photo-section">

                <div className="edit-avatar">
                  AM
                </div>

                <div>
                  <h3>Profile Photo</h3>

                  <p>
                    Add a professional photo to your profile.
                  </p>

                  <button
                    type="button"
                    className="change-photo-btn"
                  >
                    Change Photo
                  </button>
                </div>

              </div>

              {/* Basic Information */}
              <div className="form-section">

                <div className="form-section-title">
                  <h2>Basic Information</h2>

                  <p>
                    Keep your profile information up to date.
                  </p>
                </div>

                <div className="edit-form-row">

                  <div className="edit-form-group">
                    <label>Full Name</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="edit-form-group">
                    <label>Username</label>

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                    />
                  </div>

                </div>

                <div className="edit-form-group">

                  <label>Bio</label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell people about yourself..."
                    rows="5"
                  />

                  <span className="character-count">
                    {formData.bio.length}/250
                  </span>

                </div>

              </div>

              {/* Professional Information */}
              <div className="form-section">

                <div className="form-section-title">
                  <h2>Professional Information</h2>

                  <p>
                    Tell the community what you do.
                  </p>
                </div>

                <div className="edit-form-row">

                  <div className="edit-form-group">
                    <label>Location</label>

                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Your location"
                    />
                  </div>

                  <div className="edit-form-group">
                    <label>Profession</label>

                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      placeholder="Your profession"
                    />
                  </div>

                </div>

                <div className="edit-form-group">

                  <label>Skills</label>

                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="UI/UX Design, Figma..."
                  />

                  <span className="input-hint">
                    Separate multiple skills with commas.
                  </span>

                </div>

              </div>

              {/* Actions */}
              <div className="edit-form-actions">

                <button
                  type="button"
                  className="discard-profile-btn"
                  onClick={() => navigate('/profile')}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-profile-btn"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

          {/* Preview */}
          <aside className="profile-preview-card">

            <div className="preview-heading">
              <h3>Profile Preview</h3>
              <span>Live Preview</span>
            </div>

            <div className="preview-cover"></div>

            <div className="preview-content">

              <div className="preview-avatar">
                AM
              </div>

              <h2>{formData.name}</h2>

              <p className="preview-username">
                @{formData.username}
              </p>

              <p className="preview-bio">
                {formData.bio}
              </p>

              <div className="preview-meta">
                <span>📍 {formData.location}</span>
                <span>🎨 {formData.profession}</span>
              </div>

              <div className="preview-skills">

                {formData.skills
                  .split(',')
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}

              </div>

            </div>

          </aside>

        </div>

      </div>
    </div>
  )
}

export default EditProfile