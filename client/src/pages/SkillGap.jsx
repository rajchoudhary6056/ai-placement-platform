import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SkillGap = () => {
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/skill-gap/analyze"
      );

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error(
        "Skill gap error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to generate skill gap analysis"
      );
    } finally {
      setLoading(false);
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === "High") {
      return "priority-high";
    }

    if (priority === "Low") {
      return "priority-low";
    }

    return "priority-medium";
  };

  return (
    <div className="skill-gap-page">

      <div className="skill-gap-container">

        {/* HEADER */}

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

        <div className="skill-gap-header">

          <span className="page-kicker">
            AI Career Guidance
          </span>

          <h1>
            Skill Gap Analysis
          </h1>

          <p>
            Discover the skills you need to improve for
            your target job role and get a personalized
            placement roadmap.
          </p>

        </div>

        {/* GENERATE CARD */}

        {!analysis && (
          <div className="skill-gap-start-card">

            <div className="skill-gap-start-icon">
              🎯
            </div>

            <h2>
              Analyze Your Skills
            </h2>

            <p>
              Our AI will compare your current skills,
              profile and resume with your target job role.
            </p>

            <div className="analysis-features">

              <div>
                <span>✓</span>
                Current Skill Analysis
              </div>

              <div>
                <span>✓</span>
                Missing Skill Detection
              </div>

              <div>
                <span>✓</span>
                Priority Recommendations
              </div>

              <div>
                <span>✓</span>
                12-Week Career Roadmap
              </div>

            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button
              className="generate-analysis-button"
              onClick={generateAnalysis}
              disabled={loading}
            >
              {loading
                ? "AI is analyzing..."
                : "Analyze My Skill Gap →"}
            </button>

          </div>
        )}

        {/* LOADING */}

        {loading && !analysis && (
          <div className="skill-gap-loading">
            <div className="loader"></div>

            <h3>
              AI is analyzing your profile...
            </h3>

            <p>
              This may take a few seconds.
            </p>
          </div>
        )}

        {/* RESULT */}

        {analysis && (
          <div className="skill-gap-result">

            {/* TOP SCORE */}

            <div className="readiness-card">

              <div>
                <span className="result-label">
                  Placement Readiness
                </span>

                <h2>
                  {analysis.overallReadiness}%
                </h2>

                <p>
                  Target Role:{" "}
                  <strong>
                    {analysis.targetRole}
                  </strong>
                </p>
              </div>

              <div className="readiness-circle">
                {analysis.overallReadiness}%
              </div>

            </div>

            {/* SUMMARY */}

            <div className="skill-result-card">

              <h2>
                🤖 AI Career Summary
              </h2>

              <p className="skill-summary">
                {analysis.summary}
              </p>

            </div>

            {/* STRONG SKILLS */}

            <div className="skill-result-card">

              <h2>
                💪 Your Strong Skills
              </h2>

              {analysis.strongSkills?.length ? (
                <div className="skill-result-tags">

                  {analysis.strongSkills.map(
                    (skill, index) => (
                      <span
                        className="strong-skill-tag"
                        key={index}
                      >
                        ✓ {skill}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="empty-text">
                  No strong skills detected.
                </p>
              )}

            </div>

            {/* MISSING SKILLS */}

            <div className="skill-result-card">

              <div className="section-heading">
                <div>
                  <h2>
                    ⚠️ Skills You Need to Improve
                  </h2>

                  <p>
                    Focus on high-priority skills first.
                  </p>
                </div>
              </div>

              <div className="missing-skills-grid">

                {analysis.missingSkills?.map(
                  (item, index) => (
                    <div
                      className="missing-skill-card"
                      key={index}
                    >

                      <div className="missing-skill-top">

                        <h3>
                          {item.skill}
                        </h3>

                        <span
                          className={getPriorityClass(
                            item.priority
                          )}
                        >
                          {item.priority}
                        </span>

                      </div>

                      <p>
                        {item.reason}
                      </p>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* ROADMAP */}

            <div className="skill-result-card roadmap-card">

              <div className="section-heading">

                <div>
                  <h2>
                    🗺️ 12-Week Placement Roadmap
                  </h2>

                  <p>
                    Follow this roadmap step by step.
                  </p>
                </div>

              </div>

              <div className="roadmap-list">

                {analysis.roadmap?.map(
                  (week, index) => (
                    <div
                      className="roadmap-item"
                      key={index}
                    >

                      <div className="roadmap-week">
                        Week {week.week}
                      </div>

                      <div className="roadmap-content">

                        <h3>
                          {week.title}
                        </h3>

                        {week.skills?.length > 0 && (
                          <div className="roadmap-tags">

                            {week.skills.map(
                              (skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          </div>
                        )}

                        <h4>
                          Tasks
                        </h4>

                        <ul>
                          {week.tasks?.map(
                            (task, taskIndex) => (
                              <li key={taskIndex}>
                                {task}
                              </li>
                            )
                          )}
                        </ul>

                        {week.resources?.length > 0 && (
                          <>
                            <h4>
                              Resources
                            </h4>

                            <div className="roadmap-resources">

                              {week.resources.map(
                                (
                                  resource,
                                  resourceIndex
                                ) => (
                                  <span
                                    key={resourceIndex}
                                  >
                                    📚 {resource}
                                  </span>
                                )
                              )}

                            </div>
                          </>
                        )}

                      </div>

                    </div>
                  )
                )}

              </div>

            </div>

            {/* ACTIONS */}

            <div className="skill-gap-actions">

              <button
                className="secondary-action-button"
                onClick={() => {
                  setAnalysis(null);
                  setError("");
                }}
              >
                🔄 Analyze Again
              </button>

              <button
                className="generate-analysis-button"
                onClick={() =>
                  navigate("/mock-interview")
                }
              >
                🎤 Practice Interview →
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default SkillGap;