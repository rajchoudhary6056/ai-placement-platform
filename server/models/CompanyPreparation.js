const mongoose = require("mongoose");

const companyPreparationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    shortName: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    hiringType: {
      type: String,
      default: "Campus Placement",
      trim: true,
    },

    selectionProcess: [
      {
        type: String,
        trim: true,
      },
    ],

    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],

    dsaTopics: [
      {
        type: String,
        trim: true,
      },
    ],

    technicalQuestions: [
      {
        question: String,
        answer: String,
      },
    ],

    hrQuestions: [
      {
        question: String,
        answer: String,
      },
    ],

    preparationTips: [
      {
        type: String,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "CompanyPreparation",
    companyPreparationSchema
  );