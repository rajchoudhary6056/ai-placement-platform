const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      default: "",
    },

    expectedOutput: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const dsaQuestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    input: {
      type: String,
      default: "",
      trim: true,
    },

    output: {
      type: String,
      default: "",
      trim: true,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    constraints: {
      type: String,
      default: "",
      trim: true,
    },

    testCases: [testCaseSchema],

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
  "DSAQuestion",
  dsaQuestionSchema
);