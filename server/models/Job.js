const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      default: "India",
      trim: true,
    },

    jobType: {
      type: String,
      enum: [
        "Full Time",
        "Internship",
        "Part Time",
      ],
      default: "Full Time",
    },

    experience: {
      type: String,
      default: "Fresher",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    salary: {
      type: String,
      default: "Not Disclosed",
      trim: true,
    },

    applyUrl: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Job",
  jobSchema
);