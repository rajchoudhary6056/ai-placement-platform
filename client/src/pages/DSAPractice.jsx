import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DSAPractice = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(null);

  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const topics = [
    "All",
    "Arrays",
    "Strings",
    "Searching",
    "Sorting",
    "Linked List",
    "Stack",
    "Hashing",
    "Recursion",
  ];

  const difficulties = [
    "All",
    "Easy",
    "Medium",
    "Hard",
  ];

  useEffect(() => {
    fetchQuestions();
  }, [topic, difficulty]);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/dsa/questions",
        {
          params: {
            topic,
            difficulty,
          },
        }
      );

      setQuestions(
        response.data.questions || []
      );
    } catch (err) {
      console.error(
        "Get DSA Questions Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load DSA questions"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await api.get(
        "/dsa/progress"
      );

      setProgress(
        response.data.progress || null
      );
    } catch (err) {
      console.error(
        "Get DSA Progress Error:",
        err
      );
    }
  };

  const isSolved = (question) => {
    if (question?.solved === true) {
      return true;
    }

    if (
      !progress ||
      !Array.isArray(
        progress.solvedQuestions
      )
    ) {
      return false;
    }

    return progress.solvedQuestions.some(
      (item) => {
        const savedId = String(
          item?.questionId
        );

        const currentId = String(
          question?.id
        );

        const status = String(
          item?.status || ""
        )
          .trim()
          .toLowerCase();

        return (
          savedId === currentId &&
          status === "solved"
        );
      }
    );
  };

  const handleSolve = (questionId) => {
    /*
      IMPORTANT:
      App.jsx route is:

      /dsa-practice/:id

      So Solve button must navigate
      to the same route.
    */

    navigate(
      `/dsa-practice/${questionId}`
    );
  };

  const getDifficultyClass = (level) => {
    if (level === "Easy") {
      return "dsa-easy";
    }

    if (level === "Medium") {
      return "dsa-medium";
    }

    if (level === "Hard") {
      return "dsa-hard";
    }

    return "";
  };

  if (loading) {
    return (
      <div className="dsa-page">
        <div className="dsa-loading">
          <div className="loader"></div>

          <p>
            Loading DSA questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dsa-page">
      <div className="dsa-container">

        <button
          className="back-button dsa-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

        <div className="dsa-header">

          <div>
            <span className="page-kicker">
              Placement Preparation
            </span>

            <h1>
              DSA Practice
            </h1>

            <p>
              Practice important Data
              Structures and Algorithms
              questions for placement
              interviews.
            </p>
          </div>

          <div className="dsa-progress-card">

            <div className="dsa-progress-circle">
              {progress?.progressPercentage ||
                0}
              %
            </div>

            <div>
              <span>
                DSA Progress
              </span>

              <strong>
                {progress?.totalSolved || 0}
                {" / "}
                {progress?.totalQuestions || 0}
              </strong>

              <small>
                Questions solved
              </small>
            </div>

          </div>

        </div>

        <div className="dsa-filter-card">

          <div className="dsa-filter-group">

            <label>
              Topic
            </label>

            <select
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
            >
              {topics.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>

          <div className="dsa-filter-group">

            <label>
              Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
            >
              {difficulties.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>

          <div className="dsa-question-count">

            <strong>
              {questions.length}
            </strong>

            <span>
              Questions Found
            </span>

          </div>

        </div>

        {error && (
          <div className="error-message dsa-error">
            {error}
          </div>
        )}

        {questions.length === 0 ? (

          <div className="dsa-empty">

            <div className="dsa-empty-icon">
              🔍
            </div>

            <h2>
              No Questions Found
            </h2>

            <p>
              Try changing the topic or
              difficulty filter.
            </p>

          </div>

        ) : (

          <div className="dsa-question-grid">

            {questions.map(
              (question, index) => {

                const solved =
                  isSolved(question);

                return (
                  <div
                    className="dsa-question-card"
                    key={question.id}
                  >

                    <div className="dsa-card-top">

                      <span className="dsa-question-number">
                        #
                        {String(
                          index + 1
                        ).padStart(2, "0")}
                      </span>

                      <span
                        className={`dsa-difficulty ${getDifficultyClass(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty}
                      </span>

                    </div>

                    <h2>
                      {question.title}
                    </h2>

                    <div className="dsa-topic">
                      {question.topic}
                    </div>

                    <p>
                      Solve this problem and
                      improve your{" "}
                      {question.topic} skills.
                    </p>

                    <div className="dsa-card-bottom">

                      {solved ? (
                        <span className="dsa-solved">
                          ✓ Solved
                        </span>
                      ) : (
                        <span className="dsa-not-solved">
                          Not Solved
                        </span>
                      )}

                      <button
                        className="solve-question-button"
                        onClick={() =>
                          handleSolve(
                            question.id
                          )
                        }
                      >
                        {solved
                          ? "Practice Again →"
                          : "Solve →"}
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default DSAPractice;