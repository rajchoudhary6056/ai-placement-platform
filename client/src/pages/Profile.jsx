import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();

  const { updateUser } = useAuth();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [skillInput, setSkillInput] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",

    college: "",
    degree: "B.Tech",
    branch: "Computer Science",
    graduationYear: "2027",
    cgpa: "",

    targetRole: "",

    skills: [],

    experience: "",

    bio: "",
  });


  // ===============================
  // GET PROFILE
  // ===============================

  useEffect(() => {
    loadProfile();
  }, []);


  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/profile");

      const user = response.data.user;

      setFormData({
        name: user.name || "",

        phone: user.phone || "",

        location: user.location || "",

        college: user.education?.college || "",

        degree: user.education?.degree || "B.Tech",

        branch:
          user.education?.branch ||
          "Computer Science",

        graduationYear:
          user.education?.graduationYear ||
          "2027",

        cgpa:
          user.education?.cgpa !== null &&
          user.education?.cgpa !== undefined
            ? user.education.cgpa
            : "",

        targetRole: user.targetRole || "",

        skills: user.skills || [],

        experience: user.experience || "",

        bio: user.bio || "",
      });

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };


  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // ===============================
  // ADD SKILL
  // ===============================

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const exists = formData.skills.some(
      (item) =>
        item.toLowerCase() === skill.toLowerCase()
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setFormData((prev) => ({
      ...prev,

      skills: [
        ...prev.skills,
        skill,
      ],
    }));

    setSkillInput("");
  };


  // ===============================
  // REMOVE SKILL
  // ===============================

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,

      skills: prev.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };


  // ===============================
  // ENTER KEY FOR SKILL
  // ===============================

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      addSkill();
    }
  };


  // ===============================
  // SAVE PROFILE
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);

    setMessage("");

    setError("");

    try {
      const profileData = {
        name: formData.name,

        phone: formData.phone,

        location: formData.location,

        education: {
          college: formData.college,

          degree: formData.degree,

          branch: formData.branch,

          graduationYear:
            formData.graduationYear,

          cgpa: formData.cgpa,
        },

        skills: formData.skills,

        targetRole: formData.targetRole,

        projects: [],

        experience: formData.experience,

        bio: formData.bio,
      };


      const response = await api.put(
        "/profile",
        profileData
      );


      updateUser(response.data.user);


      setMessage(
        "Profile updated successfully!"
      );


      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>

        <p>Loading profile...</p>
      </div>
    );
  }


  return (
    <div className="profile-page">

      <div className="profile-container">

        {/* HEADER */}

        <div className="profile-header">

          <div>
            <button
              className="back-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Dashboard
            </button>

            <h1>
              Complete Your Profile
            </h1>

            <p>
              Add your details to get
              personalized placement
              recommendations.
            </p>
          </div>

        </div>


        {/* SUCCESS */}

        {message && (
          <div className="success-message">
            ✓ {message}
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >

          {/* PERSONAL INFORMATION */}

          <section className="profile-card">

            <h2>
              Personal Information
            </h2>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />

              </div>


              <div className="form-group">

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                />

              </div>


            </div>

          </section>


          {/* EDUCATION */}

          <section className="profile-card">

            <h2>
              Education
            </h2>

            <div className="form-grid">

              <div className="form-group full-width">

                <label>
                  College / University
                </label>

                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="Enter college name"
                />

              </div>


              <div className="form-group">

                <label>
                  Degree
                </label>

                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                >

                  <option value="B.Tech">
                    B.Tech
                  </option>

                  <option value="B.E">
                    B.E
                  </option>

                  <option value="BCA">
                    BCA
                  </option>

                  <option value="MCA">
                    MCA
                  </option>

                  <option value="M.Tech">
                    M.Tech
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Branch
                </label>

                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="Computer Science"
                />

              </div>


              <div className="form-group">

                <label>
                  Graduation Year
                </label>

                <select
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleChange}
                >

                  <option value="">
                    Select year
                  </option>

                  <option value="2026">
                    2026
                  </option>

                  <option value="2027">
                    2027
                  </option>

                  <option value="2028">
                    2028
                  </option>

                  <option value="2029">
                    2029
                  </option>

                  <option value="2030">
                    2030
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  CGPA
                </label>

                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="7.59"
                  min="0"
                  max="10"
                  step="0.01"
                />

              </div>

            </div>

          </section>


          {/* CAREER */}

          <section className="profile-card">

            <h2>
              Career Preferences
            </h2>

            <div className="form-group">

              <label>
                Target Job Role
              </label>

              <select
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
              >

                <option value="">
                  Select target role
                </option>

                <option value="MERN Developer">
                  MERN Developer
                </option>

                <option value="Full Stack Developer">
                  Full Stack Developer
                </option>

                <option value="Frontend Developer">
                  Frontend Developer
                </option>

                <option value="Backend Developer">
                  Backend Developer
                </option>

                <option value="Java Developer">
                  Java Developer
                </option>

                <option value="Software Developer">
                  Software Developer
                </option>

                <option value="Data Analyst">
                  Data Analyst
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Experience
              </label>

              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              >

                <option value="">
                  Select experience
                </option>

                <option value="Fresher">
                  Fresher
                </option>

                <option value="Internship">
                  Internship Experience
                </option>

                <option value="0-1 Years">
                  0-1 Years
                </option>

                <option value="1-2 Years">
                  1-2 Years
                </option>

                <option value="2+ Years">
                  2+ Years
                </option>

              </select>

            </div>

          </section>


          {/* SKILLS */}

          <section className="profile-card">

            <h2>
              Technical Skills
            </h2>

            <p className="section-description">
              Add the technologies and
              skills you know.
            </p>


            <div className="skill-input-wrapper">

              <input
                type="text"
                value={skillInput}
                onChange={(e) =>
                  setSkillInput(e.target.value)
                }
                onKeyDown={handleSkillKeyDown}
                placeholder="Example: React"
              />

              <button
                type="button"
                onClick={addSkill}
                className="add-skill-button"
              >
                + Add
              </button>

            </div>


            <div className="skills-container">

              {formData.skills.length === 0 ? (

                <p className="no-skills">
                  No skills added yet.
                </p>

              ) : (

                formData.skills.map(
                  (skill, index) => (

                    <div
                      className="skill-tag"
                      key={index}
                    >

                      <span>
                        {skill}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeSkill(skill)
                        }
                      >
                        ×
                      </button>

                    </div>

                  )
                )

              )}

            </div>

          </section>


          {/* BIO */}

          <section className="profile-card">

            <h2>
              About You
            </h2>

            <div className="form-group">

              <label>
                Short Bio
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself, your interests and career goals..."
                rows="6"
              />

            </div>

          </section>


          {/* SUBMIT */}

          <div className="profile-submit">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Cancel
            </button>


            <button
              type="submit"
              className="save-profile-button"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Save Profile"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};


export default Profile;