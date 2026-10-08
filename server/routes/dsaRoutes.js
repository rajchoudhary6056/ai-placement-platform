const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getQuestions,
  getQuestion,
  runCode,
  submitSolution,
  getProgress,
} = require("../controllers/dsaController");

const router = express.Router();

router.get(
  "/questions",
  authMiddleware,
  getQuestions
);

router.get(
  "/questions/:id",
  authMiddleware,
  getQuestion
);

router.post(
  "/run",
  authMiddleware,
  runCode
);

router.post(
  "/submit",
  authMiddleware,
  submitSolution
);

router.get(
  "/progress",
  authMiddleware,
  getProgress
);

module.exports = router;