const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    reason: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const roadmapItemSchema = new mongoose.Schema(
  {
    week: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
      },
    ],
    tasks: [
      {
        type: String,
      },
    ],
    resources: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

const skillGapAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    currentSkills: [
      {
        type: String,
      },
    ],

    strongSkills: [
      {
        type: String,
      },
    ],

    missingSkills: [skillSchema],

    overallReadiness: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      default: "",
    },

    roadmap: [roadmapItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SkillGapAnalysis",
  skillGapAnalysisSchema
);