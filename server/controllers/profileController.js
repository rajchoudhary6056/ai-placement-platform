const User = require("../models/User");

const calculateProfileScore = (user) => {
  let completed = 0;
  let total = 14;

  if (user.name && user.name.trim() !== "") completed++;

  if (user.email && user.email.trim() !== "") completed++;

  if (user.phone && user.phone.trim() !== "") completed++;

  if (user.location && user.location.trim() !== "") completed++;

  if (
    user.education &&
    user.education.college &&
    user.education.college.trim() !== ""
  ) {
    completed++;
  }

  if (
    user.education &&
    user.education.degree &&
    user.education.degree.trim() !== ""
  ) {
    completed++;
  }

  if (
    user.education &&
    user.education.branch &&
    user.education.branch.trim() !== ""
  ) {
    completed++;
  }

  if (
    user.education &&
    user.education.graduationYear
  ) {
    completed++;
  }

  if (
    user.education &&
    user.education.cgpa !== null &&
    user.education.cgpa !== undefined
  ) {
    completed++;
  }

  if (user.targetRole && user.targetRole.trim() !== "") {
    completed++;
  }

  if (user.skills && user.skills.length > 0) {
    completed++;
  }

  if (user.projects && user.projects.length > 0) {
    completed++;
  }

  if (user.experience && user.experience.trim() !== "") {
    completed++;
  }

  if (user.bio && user.bio.trim() !== "") {
    completed++;
  }

  return Math.round((completed / total) * 100);
};


// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      education,
      skills,
      targetRole,
      projects,
      experience,
      bio,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;

    user.phone = phone || "";

    user.location = location || "";

    user.education = {
      college: education?.college || "",
      degree: education?.degree || "",
      branch: education?.branch || "",
      graduationYear: education?.graduationYear
        ? Number(education.graduationYear)
        : null,
      cgpa:
        education?.cgpa !== "" &&
        education?.cgpa !== null &&
        education?.cgpa !== undefined
          ? Number(education.cgpa)
          : null,
    };

    user.skills = Array.isArray(skills) ? skills : [];

    user.targetRole = targetRole || "";

    user.projects = Array.isArray(projects) ? projects : [];

    user.experience = experience || "";

    user.bio = bio || "";

    user.profileScore = calculateProfileScore(user);

    await user.save();

    const safeUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};


module.exports = {
  getProfile,
  updateProfile,
};