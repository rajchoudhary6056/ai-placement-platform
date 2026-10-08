const mongoose = require("mongoose");

const solvedQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      default: "Java",
    },

    score: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["solved", "attempted"],
      default: "attempted",
    },

    feedback: {
      type: String,
      default: "",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const dsaProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    solvedQuestions: [
      solvedQuestionSchema,
    ],

    totalSolved: {
      type: Number,
      default: 0,
    },

    totalAttempted: {
      type: Number,
      default: 0,
    },

    totalScore: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "DSAProgress",
    dsaProgressSchema
  );