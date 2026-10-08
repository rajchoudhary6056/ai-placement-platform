const express = require("express");
const multer = require("multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  analyzeResume,
  getResumeHistory,
} = require("../controllers/resumeController");


const router = express.Router();


/* =========================================
   MULTER CONFIGURATION
========================================= */

const storage =
  multer.memoryStorage();


const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    cb
  ) => {

    if (
      file.mimetype ===
      "application/pdf"
    ) {
      cb(null, true);

    } else {

      cb(
        new Error(
          "Only PDF files are allowed"
        )
      );

    }
  },
});


/* =========================================
   ANALYZE
========================================= */

router.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"),
  analyzeResume
);


/* =========================================
   HISTORY
========================================= */

router.get(
  "/history",
  authMiddleware,
  getResumeHistory
);


module.exports = router;