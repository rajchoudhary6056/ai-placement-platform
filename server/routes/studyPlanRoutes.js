const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  generateStudyPlan,
  getStudyPlan,
  completeWeek,
} = require("../controllers/studyPlanController");

const router = express.Router();

router.post(
  "/generate",
  authMiddleware,
  generateStudyPlan
);

router.get(
  "/",
  authMiddleware,
  getStudyPlan
);

router.put(
  "/week/:weekNumber",
  authMiddleware,
  completeWeek
);

module.exports = router;