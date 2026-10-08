import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DSAProgress = () => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dsa/progress");

      setProgress(response.data.progress || null);
    } catch (err) {
      console.error("DSA progress error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load DSA progress"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dsa-progress-page">
        <div className="dsa-progress-loading">
          <div className="loader"></div>
          <p>Loading your DSA progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dsa-progress-page">
        <div className="dsa-progress-container">
          <button
            className="dsa-back-button"
            onClick={() => navigate("/dsa-practice")}
          >
            ← Back to DSA Practice
          </button>

          <div className="dsa-progress-error">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const totalSolved = progress?.totalSolved || 0;
  const totalQuestions = progress?.totalQuestions || 10;
  const totalScore = progress?.totalScore || 0;
  const totalAttempted = progress?.totalAttempted || 0;

  const percentage =
    progress?.progressPercentage ??
    Math.round(
      (totalSolved / totalQuestions) * 100
    );

  const solvedQuestions =
    progress?.solvedQuestions || [];

  return (
    <div className="dsa-progress-page">

      <div className="dsa-progress-container">

        {/* BACK */}

        <button
          className="dsa-back-button"
          onClick={() => navigate("/dsa-practice")}
        >
          ← Back to DSA Practice
        </button>

        {/* HEADER */}

        <div className="dsa-progress-header">

          <span>
            PLACEMENT PREPARATION
          </span>

          <h1>
            DSA Progress
          </h1>

          <p>
            Track your Data Structures and
            Algorithms preparation.
          </p>

        </div>

        {/* OVERVIEW */}

        <div className="dsa-progress-overview">

          <div className="dsa-progress-big-circle">
            {percentage}%
          </div>

          <div className="dsa-progress-overview-text">

            <h2>
              Your DSA Progress
            </h2>

            <p>
              You have solved{" "}
              <strong>{totalSolved}</strong>{" "}
              out of{" "}
              <strong>{totalQuestions}</strong>{" "}
              questions.
            </p>

          </div>

        </div>

        {/* STATS */}

        <div className="dsa-progress-stats">

          <div className="dsa-stat-card">

            <span>Questions Solved</span>

            <strong>
              {totalSolved}
            </strong>

          </div>

          <div className="dsa-stat-card">

            <span>Total Questions</span>

            <strong>
              {totalQuestions}
            </strong>

          </div>

          <div className="dsa-stat-card">

            <span>Attempts</span>

            <strong>
              {totalAttempted}
            </strong>

          </div>

          <div className="dsa-stat-card">

            <span>Total Score</span>

            <strong>
              {totalScore}
            </strong>

          </div>

        </div>

        {/* SOLVED QUESTIONS */}

        <div className="dsa-history-card">

          <div className="dsa-history-header">

            <div>
              <h2>
                Solved Questions
              </h2>

              <p>
                Your completed DSA problems
              </p>
            </div>

            <button
              className="dsa-practice-button"
              onClick={() =>
                navigate("/dsa-practice")
              }
            >
              Practice More →
            </button>

          </div>

          {solvedQuestions.length === 0 ? (

            <div className="dsa-no-history">

              <div>
                🧠
              </div>

              <h3>
                No solved questions yet
              </h3>

              <p>
                Start solving DSA questions to
                build your placement preparation.
              </p>

              <button
                className="dsa-practice-button"
                onClick={() =>
                  navigate("/dsa-practice")
                }
              >
                Start DSA Practice →
              </button>

            </div>

          ) : (

            <div className="dsa-history-list">

              {solvedQuestions.map(
                (item, index) => (

                  <div
                    className="dsa-history-item"
                    key={`${item.questionId}-${index}`}
                  >

                    <div className="dsa-history-left">

                      <div className="dsa-history-check">
                        ✓
                      </div>

                      <div>

                        <h3>
                          Question #{item.questionId}
                        </h3>

                        <span>
                          {item.language || "Java"}
                        </span>

                      </div>

                    </div>

                    <div className="dsa-history-score">

                      <strong>
                        {item.score || 0}/10
                      </strong>

                      <small>
                        {item.status === "solved"
                          ? "Solved"
                          : "Attempted"}
                      </small>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default DSAProgress;