const express = require("express");

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Get Profile
router.get("/", authMiddleware, getProfile);


// Update Profile
router.put("/", authMiddleware, updateProfile);


module.exports = router;