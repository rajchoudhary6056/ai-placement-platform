const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const User = require("../models/User");

const router = express.Router();


// Register
router.post(
  "/register",
  registerUser
);


// Login
router.post(
  "/login",
  loginUser
);


// Get logged-in user
router.get(
  "/me",
  protect,
  async (req, res) => {

    try {

      const user = await User.findById(
        req.user._id
      ).select("-password");


      res.status(200).json({
        success: true,
        user,
      });


    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Server error",
      });

    }

  }
);


module.exports = router;