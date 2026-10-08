const mongoose = require("mongoose");

const weekSchema = new mongoose.Schema(
  {
    weekNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    focus: {
      type: String,
      default: "",
      trim: true,
    },

    goals: [
      {
        type: String,
        trim: true,
      },
    ],

    topics: [
      {
        type: String,
        trim: true,
      },
    ],

    tasks: [
      {
        type: String,
        trim: true,
      },
    ],

    practice: [
      {
        type: String,
        trim: true,
      },
    ],

    resources: [
      {
        type: String,
        trim: true,
      },
    ],

    estimatedHours: {
      type: Number,
      default: 10,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  }
);

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    targetRole: {
      type: String,
      default: "Software Developer",
      trim: true,
    },

    planTitle: {
      type: String,
      default: "Personalized Placement Study Plan",
      trim: true,
    },

    summary: {
      type: String,
      default: "",
      trim: true,
    },

    currentLevel: {
      type: String,
      default: "Beginner",
      trim: true,
    },

    placementGoal: {
      type: String,
      default: "",
      trim: true,
    },

    weeks: {
      type: [weekSchema],
      default: [],
    },

    totalWeeks: {
      type: Number,
      default: 12,
    },

    completedWeeks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("StudyPlan", studyPlanSchema);