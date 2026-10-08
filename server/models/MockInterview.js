const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },

    missingPoints: [
      {
        type: String,
      },
    ],

    improvements: [
      {
        type: String,
      },
    ],
  },
  {
    _id: false,
  }
);

const mockInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
    },

    interviewType: {
      type: String,
      enum: ["Technical", "HR"],
      required: true,
    },

    totalQuestions: {
      type: Number,
      default: 5,
    },

    currentQuestion: {
      type: Number,
      default: 1,
    },

    questions: [
      {
        type: String,
      },
    ],

    answers: [answerSchema],

    totalScore: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "MockInterview",
    mockInterviewSchema
  );