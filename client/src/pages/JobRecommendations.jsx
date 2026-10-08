import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const JobRecommendations = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [targetRole, setTargetRole] = useState("");
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/jobs/recommendations"
      );

      setJobs(response.data.jobs || []);
      setTargetRole(response.data.targetRole || "");
      setUserSkills(response.data.userSkills || []);
    } catch (err) {
      console.error(
        "Job recommendation error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load job recommendations."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchText ||
        job.title
          ?.toLowerCase()
          .includes(searchText) ||
        job.company
          ?.toLowerCase()
          .includes(searchText) ||
        job.location
          ?.toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "All" ||
        job.jobType === filter;

      return matchesSearch && matchesFilter;
    });
  }, [jobs, search, filter]);

  const getMatchClass = (percentage) => {
    if (percentage >= 75) {
      return "job-match-high";
    }

    if (percentage >= 50) {
      return "job-match-medium";
    }

    return "job-match-low";
  };

  const handleApply = (job) => {
    if (
      job.applyUrl &&
      job.applyUrl !== "#"
    ) {
      window.open(
        job.applyUrl,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    alert(
      "Application link is not available for this demo job."
    );
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>

        <p
          style={{
            marginTop: "18px",
            color: "#64748b",
          }}
        >
          Finding jobs matching your skills...
        </p>
      </div>
    );
  }

  return (
    <div
      className="job-page"
      style={{
        minHeight: "calc(100vh - 70px)",
        padding: "35px 20px 60px",
        background:
          "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            border: "none",
            background: "transparent",
            color: "#475569",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          ← Back to Dashboard
        </button>

        {/* HEADER */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #4f46e5, #7c3aed)",
            borderRadius: "24px",
            padding: "35px",
            color: "white",
            marginBottom: "25px",
            boxShadow:
              "0 15px 40px rgba(79,70,229,0.20)",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: "700",
              opacity: 0.85,
              marginBottom: "8px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            AI Career Guidance
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: "34px",
            }}
          >
            Recommended Jobs 💼
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "700px",
              lineHeight: 1.6,
              opacity: 0.92,
            }}
          >
            Jobs are ranked according to your
            skills and target career role.
          </p>

          {targetRole && (
            <div
              style={{
                display: "inline-flex",
                marginTop: "20px",
                padding: "9px 15px",
                borderRadius: "999px",
                background:
                  "rgba(255,255,255,0.15)",
                border:
                  "1px solid rgba(255,255,255,0.25)",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              🎯 Target Role: {targetRole}
            </div>
          )}
        </div>

        {/* USER SKILLS */}
        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "22px",
            marginBottom: "25px",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 5px 20px rgba(15,23,42,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 5px",
                  color: "#0f172a",
                }}
              >
                Your Skills
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                These skills are used to calculate
                job matching.
              </p>
            </div>

            <button
              onClick={() => navigate("/profile")}
              style={{
                border: "1px solid #c7d2fe",
                background: "#eef2ff",
                color: "#4338ca",
                borderRadius: "10px",
                padding: "10px 15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Edit Skills
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "15px",
            }}
          >
            {userSkills.length > 0 ? (
              userSkills.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  style={{
                    background: "#f1f5f9",
                    color: "#334155",
                    padding: "7px 12px",
                    borderRadius: "999px",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  {skill}
                </span>
              ))
            ) : (
              <span
                style={{
                  color: "#ef4444",
                  fontSize: "14px",
                }}
              >
                No skills added. Update your profile
                first.
              </span>
            )}
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search jobs, companies or locations..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={{
              flex: "1",
              minWidth: "250px",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              outline: "none",
              fontSize: "14px",
              background: "white",
            }}
          />

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              background: "white",
              fontSize: "14px",
              cursor: "pointer",
              minWidth: "160px",
            }}
          >
            <option value="All">All Jobs</option>
            <option value="Full Time">
              Full Time
            </option>
            <option value="Internship">
              Internship
            </option>
            <option value="Part Time">
              Part Time
            </option>
          </select>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "15px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {/* JOB COUNT */}
        <div
          style={{
            marginBottom: "15px",
            color: "#475569",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {filteredJobs.length} job
          {filteredJobs.length !== 1
            ? "s"
            : ""} found
        </div>

        {/* JOBS */}
        {filteredJobs.length === 0 ? (
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "50px 25px",
              textAlign: "center",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                fontSize: "45px",
                marginBottom: "12px",
              }}
            >
              🔍
            </div>

            <h3
              style={{
                margin: "0 0 8px",
              }}
            >
              No matching jobs found
            </h3>

            <p
              style={{
                color: "#64748b",
                margin: 0,
              }}
            >
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {filteredJobs.map((job) => {
              const match =
                Number(job.matchPercentage) || 0;

              return (
                <div
                  key={job._id || job.id}
                  style={{
                    background: "white",
                    borderRadius: "20px",
                    padding: "23px",
                    border:
                      "1px solid #e2e8f0",
                    boxShadow:
                      "0 7px 25px rgba(15,23,42,0.06)",
                    transition:
                      "transform 0.2s ease",
                  }}
                >
                  {/* TOP */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: "0 0 7px",
                          fontSize: "20px",
                          color: "#0f172a",
                        }}
                      >
                        {job.title}
                      </h2>

                      <p
                        style={{
                          margin: 0,
                          color: "#475569",
                          fontWeight: "600",
                        }}
                      >
                        {job.company}
                      </p>
                    </div>

                    <div
                      className={getMatchClass(
                        match
                      )}
                      style={{
                        minWidth: "65px",
                        textAlign: "center",
                        padding: "8px 7px",
                        borderRadius: "10px",
                        background:
                          match >= 75
                            ? "#dcfce7"
                            : match >= 50
                            ? "#fef3c7"
                            : "#fee2e2",
                        color:
                          match >= 75
                            ? "#15803d"
                            : match >= 50
                            ? "#b45309"
                            : "#b91c1c",
                        fontWeight: "800",
                        fontSize: "13px",
                      }}
                    >
                      {match}%
                      <div
                        style={{
                          fontSize: "9px",
                          fontWeight: "600",
                        }}
                      >
                        MATCH
                      </div>
                    </div>
                  </div>

                  {/* META */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      margin:
                        "17px 0",
                    }}
                  >
                    <span
                      style={{
                        padding: "6px 9px",
                        background: "#f8fafc",
                        borderRadius: "8px",
                        color: "#475569",
                        fontSize: "12px",
                      }}
                    >
                      📍 {job.location}
                    </span>

                    <span
                      style={{
                        padding: "6px 9px",
                        background: "#f8fafc",
                        borderRadius: "8px",
                        color: "#475569",
                        fontSize: "12px",
                      }}
                    >
                      💼 {job.jobType}
                    </span>

                    <span
                      style={{
                        padding: "6px 9px",
                        background: "#f8fafc",
                        borderRadius: "8px",
                        color: "#475569",
                        fontSize: "12px",
                      }}
                    >
                      💰 {job.salary}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p
                    style={{
                      color: "#64748b",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      marginBottom: "17px",
                    }}
                  >
                    {job.description ||
                      "No description available."}
                  </p>

                  {/* SKILLS */}
                  <div>
                    <strong
                      style={{
                        fontSize: "13px",
                        color: "#334155",
                      }}
                    >
                      Required Skills
                    </strong>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginTop: "9px",
                      }}
                    >
                      {(job.skills || []).map(
                        (skill, index) => {
                          const matched =
                            (job.matchedSkills ||
                              [])
                              .map((item) =>
                                item.toLowerCase()
                              )
                              .includes(
                                skill.toLowerCase()
                              );

                          return (
                            <span
                              key={`${skill}-${index}`}
                              style={{
                                padding:
                                  "5px 9px",
                                borderRadius:
                                  "7px",
                                fontSize:
                                  "11px",
                                fontWeight:
                                  "600",
                                background:
                                  matched
                                    ? "#dcfce7"
                                    : "#f1f5f9",
                                color:
                                  matched
                                    ? "#166534"
                                    : "#64748b",
                              }}
                            >
                              {matched
                                ? "✓ "
                                : ""}
                              {skill}
                            </span>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* MATCH INFO */}
                  <div
                    style={{
                      marginTop: "17px",
                      padding: "12px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        fontSize: "12px",
                        marginBottom: "5px",
                      }}
                    >
                      <span>
                        Matched Skills
                      </span>

                      <strong>
                        {job.matchedSkills
                          ?.length || 0}
                      </strong>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        fontSize: "12px",
                      }}
                    >
                      <span>
                        Skills to Improve
                      </span>

                      <strong>
                        {job.missingSkills
                          ?.length || 0}
                      </strong>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div
                    style={{
                      display: "flex",
                      gap: "9px",
                      marginTop: "18px",
                    }}
                  >
                    <button
                      onClick={() =>
                        setSelectedJob(
                          selectedJob?._id ===
                            job._id
                            ? null
                            : job
                        )
                      }
                      style={{
                        flex: 1,
                        padding: "11px",
                        borderRadius: "10px",
                        border:
                          "1px solid #cbd5e1",
                        background: "white",
                        color: "#334155",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      {selectedJob?._id ===
                      job._id
                        ? "Hide Details"
                        : "View Details"}
                    </button>

                    <button
                      onClick={() =>
                        handleApply(job)
                      }
                      style={{
                        flex: 1,
                        padding: "11px",
                        borderRadius: "10px",
                        border: "none",
                        background:
                          "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        color: "white",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Apply Now →
                    </button>
                  </div>

                  {/* DETAILS */}
                  {selectedJob?._id ===
                    job._id && (
                    <div
                      style={{
                        marginTop: "17px",
                        paddingTop: "17px",
                        borderTop:
                          "1px solid #e2e8f0",
                      }}
                    >
                      <h4
                        style={{
                          margin:
                            "0 0 10px",
                        }}
                      >
                        Missing Skills
                      </h4>

                      {job.missingSkills
                        ?.length ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px",
                          }}
                        >
                          {job.missingSkills.map(
                            (skill, index) => (
                              <span
                                key={`${skill}-${index}`}
                                style={{
                                  background:
                                    "#fee2e2",
                                  color:
                                    "#b91c1c",
                                  padding:
                                    "5px 9px",
                                  borderRadius:
                                    "7px",
                                  fontSize:
                                    "11px",
                                  fontWeight:
                                    "600",
                                }}
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      ) : (
                        <p
                          style={{
                            color: "#15803d",
                            fontSize: "13px",
                          }}
                        >
                          🎉 You have all major
                          skills for this job!
                        </p>
                      )}

                      <p
                        style={{
                          margin:
                            "15px 0 0",
                          fontSize: "13px",
                          color: "#64748b",
                        }}
                      >
                        Experience:{" "}
                        <strong>
                          {job.experience ||
                            "Fresher"}
                        </strong>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;