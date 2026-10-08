const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  startInterview,
  submitAnswer,
  getInterviewHistory,
} = require("../controllers/interviewController");

const router = express.Router();

router.post(
  "/start",
  authMiddleware,
  startInterview
);

router.post(
  "/answer",
  authMiddleware,
  submitAnswer
);

router.get(
  "/history",
  authMiddleware,
  getInterviewHistory
);

module.exports = router;