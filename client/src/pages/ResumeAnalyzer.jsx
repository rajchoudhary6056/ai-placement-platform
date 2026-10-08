import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";


const ResumeAnalyzer = () => {

  const navigate = useNavigate();


  const [file, setFile] =
    useState(null);


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  const [result, setResult] =
    useState(null);


  const [dragging, setDragging] =
    useState(false);


  /* =========================================
     FILE SELECT
  ========================================= */

  const handleFile = (selectedFile) => {

    setError("");

    setResult(null);


    if (!selectedFile) {
      return;
    }


    if (
      selectedFile.type !==
      "application/pdf"
    ) {

      setError(
        "Only PDF files are allowed."
      );

      setFile(null);

      return;
    }


    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {

      setError(
        "File size must be less than 5 MB."
      );

      setFile(null);

      return;
    }


    setFile(selectedFile);
  };


  /* =========================================
     INPUT
  ========================================= */

  const handleFileChange = (e) => {

    const selectedFile =
      e.target.files?.[0];

    handleFile(selectedFile);
  };


  /* =========================================
     DRAG
  ========================================= */

  const handleDragOver = (e) => {

    e.preventDefault();

    setDragging(true);
  };


  const handleDragLeave = (e) => {

    e.preventDefault();

    setDragging(false);
  };


  const handleDrop = (e) => {

    e.preventDefault();

    setDragging(false);


    const droppedFile =
      e.dataTransfer.files?.[0];

    handleFile(droppedFile);
  };


  /* =========================================
     ANALYZE
  ========================================= */

  const analyzeResume = async () => {

    if (!file) {

      setError(
        "Please select a PDF resume first."
      );

      return;
    }


    try {

      setLoading(true);

      setError("");

      setResult(null);


      const formData =
        new FormData();


      formData.append(
        "resume",
        file
      );


      const response =
        await api.post(
          "/resume/analyze",
          formData
        );


      setResult(
        response.data.analysis
      );

    } catch (err) {

      console.error(err);


      setError(
        err.response?.data?.message ||
        "Failed to analyze resume."
      );

    } finally {

      setLoading(false);

    }
  };


  /* =========================================
     SCORE CLASS
  ========================================= */

  const getScoreClass = (score) => {

    if (score >= 80) {
      return "score-good";
    }

    if (score >= 60) {
      return "score-medium";
    }

    return "score-low";
  };


  return (
    <div className="resume-page">

      <div className="resume-container">

        {/* HEADER */}

        <div className="resume-header">

          <button
            className="back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

          <h1>
            AI Resume Analyzer
          </h1>

          <p>
            Upload your resume and get
            AI-powered feedback for your
            target placement role.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* UPLOAD CARD */}

        {!result && (
          <div className="resume-upload-card">

            <div
              className={`upload-box ${
                dragging
                  ? "upload-dragging"
                  : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={
                handleDragLeave
              }
              onDrop={handleDrop}
            >

              <div className="upload-icon">
                📄
              </div>

              <h2>
                Upload Your Resume
              </h2>

              <p>
                Drag & drop your PDF here
                or choose a file
              </p>

              <label
                className="choose-file-button"
              >

                Choose PDF

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={
                    handleFileChange
                  }
                  hidden
                />

              </label>

              <span className="upload-limit">
                PDF only • Maximum 5 MB
              </span>

            </div>


            {/* SELECTED FILE */}

            {file && (
              <div className="selected-file">

                <div>

                  <span className="file-icon">
                    📄
                  </span>

                  <div>

                    <strong>
                      {file.name}
                    </strong>

                    <small>
                      {(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </small>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setFile(null)
                  }
                >
                  Remove
                </button>

              </div>
            )}


            {/* ANALYZE BUTTON */}

            <button
              className="analyze-resume-button"
              onClick={
                analyzeResume
              }
              disabled={
                !file || loading
              }
            >

              {loading
                ? "Analyzing Resume..."
                : "🤖 Analyze Resume"}

            </button>


            {loading && (
              <div className="analyzing-text">

                <div className="loader"></div>

                <p>
                  AI is analyzing your
                  resume. Please wait...
                </p>

              </div>
            )}

          </div>
        )}


        {/* RESULT */}

        {result && (
          <div className="resume-result">

            {/* RESULT HEADER */}

            <div className="result-top">

              <div>

                <p className="result-label">
                  ANALYSIS COMPLETE
                </p>

                <h2>
                  {result.fileName}
                </h2>

                <p>
                  Target Role:{" "}
                  <strong>
                    {result.jobRole}
                  </strong>
                </p>

              </div>


              <button
                className="new-analysis-button"
                onClick={() => {
                  setResult(null);
                  setFile(null);
                }}
              >
                Analyze Another
              </button>

            </div>


            {/* SCORES */}

            <div className="resume-score-grid">

              <div className="resume-score-card">

                <p>
                  Resume Score
                </p>

                <div
                  className={`big-score ${getScoreClass(
                    result.resumeScore
                  )}`}
                >
                  {result.resumeScore}
                </div>

                <span>
                  / 100
                </span>

              </div>


              <div className="resume-score-card">

                <p>
                  ATS Score
                </p>

                <div
                  className={`big-score ${getScoreClass(
                    result.atsScore
                  )}`}
                >
                  {result.atsScore}
                </div>

                <span>
                  / 100
                </span>

              </div>


              <div className="resume-score-card">

                <p>
                  Experience Level
                </p>

                <div className="experience-result">
                  {result.experienceLevel ||
                    "Not detected"}
                </div>

              </div>

            </div>


            {/* SUMMARY */}

            <div className="result-card">

              <h3>
                📋 Resume Summary
              </h3>

              <p className="result-summary">
                {result.summary}
              </p>

            </div>


            {/* TWO COLUMN */}

            <div className="result-two-column">

              {/* STRENGTHS */}

              <div className="result-card">

                <h3>
                  ✅ Strengths
                </h3>

                <ul className="result-list">

                  {result.strengths?.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}

                </ul>

              </div>


              {/* MISSING SKILLS */}

              <div className="result-card">

                <h3>
                  ⚠️ Missing Skills
                </h3>

                <div className="result-tags">

                  {result.missingSkills?.map(
                    (skill, index) => (

                      <span
                        className="missing-tag"
                        key={index}
                      >
                        {skill}
                      </span>

                    )
                  )}

                </div>

              </div>

            </div>


            {/* RECOMMENDED SKILLS */}

            <div className="result-card">

              <h3>
                🎯 Recommended Skills
              </h3>

              <div className="result-tags">

                {result.recommendedSkills?.map(
                  (skill, index) => (

                    <span
                      className="recommended-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )}

              </div>

            </div>


            {/* IMPROVEMENTS */}

            <div className="result-card">

              <h3>
                🚀 Improvement Suggestions
              </h3>

              <div className="improvement-list">

                {result.improvements?.map(
                  (item, index) => (

                    <div
                      className="improvement-item"
                      key={index}
                    >

                      <span>
                        {index + 1}
                      </span>

                      <p>
                        {item}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};


export default ResumeAnalyzer;