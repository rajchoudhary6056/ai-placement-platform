import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyJob = {
  title: "",
  company: "",
  location: "India",
  jobType: "Full Time",
  experience: "Fresher",
  description: "",
  skills: "",
  salary: "",
  applyUrl: "",
  isActive: true,
};

const emptyCompany = {
  name: "",
  shortName: "",
  description: "",
  difficulty: "Medium",
  hiringType: "Campus Placement",
  selectionProcess: "",
  requiredSkills: "",
  dsaTopics: "",
  technicalQuestions: [],
  hrQuestions: [],
  preparationTips: "",
  isActive: true,
};

const emptyDSAQuestion = {
  title: "",
  topic: "Arrays",
  difficulty: "Easy",
  description: "",
  input: "",
  output: "",
  explanation: "",
  constraints: "",
  testCases: [
    {
      input: "",
      expectedOutput: "",
    },
  ],
  isActive: true,
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] =
    useState("overview");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] =
    useState([]);
  const [dsaQuestions, setDsaQuestions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [showJobModal, setShowJobModal] =
    useState(false);

  const [showCompanyModal, setShowCompanyModal] =
    useState(false);

  const [showDSAModal, setShowDSAModal] =
    useState(false);

  const [editingJob, setEditingJob] =
    useState(null);

  const [editingCompany, setEditingCompany] =
    useState(null);

  const [editingDSA, setEditingDSA] =
    useState(null);

  const [jobForm, setJobForm] =
    useState(emptyJob);

  const [companyForm, setCompanyForm] =
    useState(emptyCompany);

  const [dsaForm, setDsaForm] =
    useState(emptyDSAQuestion);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          "/admin/dashboard"
        );

      setStats(
        response.data.stats
      );
    } catch (err) {
      console.error(
        "Admin Dashboard Error:",
        err
      );

      if (
        err.response?.status === 403
      ) {
        navigate("/dashboard");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load admin dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response =
        await api.get(
          "/admin/users"
        );

      setUsers(
        response.data.users || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load users"
      );
    }
  };

  const loadJobs = async () => {
    try {
      const response =
        await api.get(
          "/admin/jobs"
        );

      setJobs(
        response.data.jobs || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load jobs"
      );
    }
  };

  const loadCompanies = async () => {
    try {
      const response =
        await api.get(
          "/admin/companies"
        );

      setCompanies(
        response.data.companies || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load companies"
      );
    }
  };

  const loadDSAQuestions = async () => {
    try {
      const response =
        await api.get(
          "/admin/dsa-questions"
        );

      setDsaQuestions(
        response.data.questions || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load DSA questions"
      );
    }
  };

  const handleTabChange = async (
    tab
  ) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");

    if (tab === "students") {
      await loadUsers();
    }

    if (tab === "jobs") {
      await loadJobs();
    }

    if (tab === "companies") {
      await loadCompanies();
    }

    if (tab === "dsa") {
      await loadDSAQuestions();
    }
  };

  /* =========================
     JOB FUNCTIONS
  ========================= */

  const openAddJob = () => {
    setEditingJob(null);
    setJobForm({
      ...emptyJob,
    });
    setShowJobModal(true);
  };

  const openEditJob = (job) => {
    setEditingJob(job);

    setJobForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "India",
      jobType:
        job.jobType || "Full Time",
      experience:
        job.experience || "Fresher",
      description:
        job.description || "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : "",
      salary: job.salary || "",
      applyUrl:
        job.applyUrl || "",
      isActive:
        job.isActive !== false,
    });

    setShowJobModal(true);
  };

  const handleJobChange = (
    e
  ) => {
    const { name, value, type, checked } =
      e.target;

    setJobForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const saveJob = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingJob) {
        await api.put(
          `/admin/jobs/${editingJob._id}`,
          jobForm
        );

        setSuccess(
          "Job updated successfully."
        );
      } else {
        await api.post(
          "/admin/jobs",
          jobForm
        );

        setSuccess(
          "Job created successfully."
        );
      }

      setShowJobModal(false);
      setEditingJob(null);

      await loadJobs();
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save job"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteJob = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/jobs/${id}`
      );

      setSuccess(
        "Job deleted successfully."
      );

      await loadJobs();
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete job"
      );
    }
  };

  /* =========================
     COMPANY FUNCTIONS
  ========================= */

  const openAddCompany = () => {
    setEditingCompany(null);

    setCompanyForm({
      ...emptyCompany,
      technicalQuestions: [],
      hrQuestions: [],
    });

    setShowCompanyModal(true);
  };

  const openEditCompany = (
    company
  ) => {
    setEditingCompany(company);

    setCompanyForm({
      name: company.name || "",
      shortName:
        company.shortName || "",
      description:
        company.description || "",
      difficulty:
        company.difficulty || "Medium",
      hiringType:
        company.hiringType ||
        "Campus Placement",

      selectionProcess:
        Array.isArray(
          company.selectionProcess
        )
          ? company.selectionProcess.join(
              ", "
            )
          : "",

      requiredSkills:
        Array.isArray(
          company.requiredSkills
        )
          ? company.requiredSkills.join(
              ", "
            )
          : "",

      dsaTopics:
        Array.isArray(
          company.dsaTopics
        )
          ? company.dsaTopics.join(
              ", "
            )
          : "",

      technicalQuestions:
        Array.isArray(
          company.technicalQuestions
        )
          ? company.technicalQuestions.map(
              (item) => ({
                question:
                  item.question || "",
                answer:
                  item.answer || "",
              })
            )
          : [],

      hrQuestions:
        Array.isArray(
          company.hrQuestions
        )
          ? company.hrQuestions.map(
              (item) => ({
                question:
                  item.question || "",
                answer:
                  item.answer || "",
              })
            )
          : [],

      preparationTips:
        Array.isArray(
          company.preparationTips
        )
          ? company.preparationTips.join(
              ", "
            )
          : "",

      isActive:
        company.isActive !== false,
    });

    setShowCompanyModal(true);
  };

  const handleCompanyChange = (
    e
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setCompanyForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const updateCompanyQuestion = (
    type,
    index,
    field,
    value
  ) => {
    setCompanyForm((prev) => {
      const questions = [
        ...prev[type],
      ];

      questions[index] = {
        ...questions[index],
        [field]: value,
      };

      return {
        ...prev,
        [type]: questions,
      };
    });
  };

  const addCompanyQuestion = (
    type
  ) => {
    setCompanyForm((prev) => ({
      ...prev,

      [type]: [
        ...prev[type],

        {
          question: "",
          answer: "",
        },
      ],
    }));
  };

  const removeCompanyQuestion = (
    type,
    index
  ) => {
    setCompanyForm((prev) => ({
      ...prev,

      [type]: prev[type].filter(
        (_, i) => i !== index
      ),
    }));
  };

  const saveCompany = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingCompany) {
        await api.put(
          `/admin/companies/${editingCompany._id}`,
          companyForm
        );

        setSuccess(
          "Company updated successfully."
        );
      } else {
        await api.post(
          "/admin/companies",
          companyForm
        );

        setSuccess(
          "Company created successfully."
        );
      }

      setShowCompanyModal(false);
      setEditingCompany(null);

      await loadCompanies();
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save company"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteCompany = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this company?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/companies/${id}`
      );

      setSuccess(
        "Company deleted successfully."
      );

      await loadCompanies();
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete company"
      );
    }
  };

  /* =========================
     DSA FUNCTIONS
  ========================= */

  const openAddDSA = () => {
    setEditingDSA(null);

    setDsaForm({
      ...emptyDSAQuestion,

      testCases: [
        {
          input: "",
          expectedOutput: "",
        },
      ],
    });

    setShowDSAModal(true);
  };

  const openEditDSA = (
    question
  ) => {
    setEditingDSA(question);

    setDsaForm({
      title:
        question.title || "",

      topic:
        question.topic || "Arrays",

      difficulty:
        question.difficulty || "Easy",

      description:
        question.description || "",

      input:
        question.input || "",

      output:
        question.output || "",

      explanation:
        question.explanation || "",

      constraints:
        question.constraints || "",

      testCases:
        Array.isArray(
          question.testCases
        ) &&
        question.testCases.length > 0
          ? question.testCases.map(
              (test) => ({
                input:
                  test.input || "",

                expectedOutput:
                  test.expectedOutput ||
                  test.output ||
                  "",
              })
            )
          : [
              {
                input: "",
                expectedOutput: "",
              },
            ],

      isActive:
        question.isActive !== false,
    });

    setShowDSAModal(true);
  };

  const handleDSAChange = (
    e
  ) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setDsaForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const updateDSATestCase = (
    index,
    field,
    value
  ) => {
    setDsaForm((prev) => {
      const testCases = [
        ...prev.testCases,
      ];

      testCases[index] = {
        ...testCases[index],
        [field]: value,
      };

      return {
        ...prev,
        testCases,
      };
    });
  };

  const addDSATestCase = () => {
    setDsaForm((prev) => ({
      ...prev,

      testCases: [
        ...prev.testCases,

        {
          input: "",
          expectedOutput: "",
        },
      ],
    }));
  };

  const removeDSATestCase = (
    index
  ) => {
    setDsaForm((prev) => {
      const testCases =
        prev.testCases.filter(
          (_, i) => i !== index
        );

      return {
        ...prev,

        testCases:
          testCases.length > 0
            ? testCases
            : [
                {
                  input: "",
                  expectedOutput: "",
                },
              ],
      };
    });
  };

  const saveDSAQuestion = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (
        !dsaForm.title.trim()
      ) {
        setError(
          "Question title is required."
        );
        return;
      }

      if (
        !dsaForm.topic.trim()
      ) {
        setError(
          "Question topic is required."
        );
        return;
      }

      if (editingDSA) {
        await api.put(
          `/admin/dsa-questions/${editingDSA._id}`,
          dsaForm
        );

        setSuccess(
          "DSA question updated successfully."
        );
      } else {
        await api.post(
          "/admin/dsa-questions",
          dsaForm
        );

        setSuccess(
          "DSA question created successfully."
        );
      }

      setShowDSAModal(false);
      setEditingDSA(null);

      await loadDSAQuestions();
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save DSA question"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteDSAQuestion = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this DSA question?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/dsa-questions/${id}`
      );

      setSuccess(
        "DSA question deleted successfully."
      );

      await loadDSAQuestions();
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete DSA question"
      );
    }
  };

  /* =========================
     DELETE USER
  ========================= */

  const deleteUser = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this student?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/users/${id}`
      );

      setSuccess(
        "Student deleted successfully."
      );

      await loadUsers();
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete student"
      );
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.spinner}></div>

        <p>
          Loading Admin Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div
        className="admin-container"
        style={styles.container}
      >
        {/* HEADER */}

        <div style={styles.header}>
          <div>
            <span
              style={styles.kicker}
            >
              ADMIN PANEL
            </span>

            <h1 style={styles.title}>
              Admin Dashboard
            </h1>

            <p style={styles.subtitle}>
              Manage students, jobs,
              companies and DSA questions.
            </p>
          </div>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            style={styles.backButton}
          >
            ← Dashboard
          </button>
        </div>

        {/* MESSAGES */}

        {success && (
          <div style={styles.success}>
            ✓ {success}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            ⚠ {error}
          </div>
        )}

        {/* TABS */}

        <div
          style={styles.tabs}
        >
          <button
            style={tabStyle(
              activeTab === "overview"
            )}
            onClick={() =>
              handleTabChange(
                "overview"
              )
            }
          >
            📊 Overview
          </button>

          <button
            style={tabStyle(
              activeTab === "students"
            )}
            onClick={() =>
              handleTabChange(
                "students"
              )
            }
          >
            👨‍🎓 Students
          </button>

          <button
            style={tabStyle(
              activeTab === "jobs"
            )}
            onClick={() =>
              handleTabChange(
                "jobs"
              )
            }
          >
            💼 Jobs
          </button>

          <button
            style={tabStyle(
              activeTab === "companies"
            )}
            onClick={() =>
              handleTabChange(
                "companies"
              )
            }
          >
            🏢 Companies
          </button>

          <button
            style={tabStyle(
              activeTab === "dsa"
            )}
            onClick={() =>
              handleTabChange(
                "dsa"
              )
            }
          >
            💻 DSA Questions
          </button>
        </div>

        {/* =========================
            OVERVIEW
        ========================= */}

        {activeTab === "overview" && (
          <div>
            <div style={styles.statsGrid}>
              <StatCard
                icon="👥"
                title="Total Users"
                value={
                  stats?.totalUsers || 0
                }
              />

              <StatCard
                icon="🎓"
                title="Students"
                value={
                  stats?.totalStudents ||
                  0
                }
              />

              <StatCard
                icon="💼"
                title="Active Jobs"
                value={
                  stats?.totalJobs || 0
                }
              />

              <StatCard
                icon="🏢"
                title="Companies"
                value={
                  stats?.totalCompanies ||
                  0
                }
              />

              <StatCard
                icon="💻"
                title="DSA Questions"
                value={
                  stats?.totalDSAQuestions ||
                  0
                }
              />

              <StatCard
                icon="✅"
                title="DSA Solved"
                value={
                  stats?.totalDSASolved ||
                  0
                }
              />
            </div>

            <div
              style={
                styles.overviewGrid
              }
            >
              <div
                style={
                  styles.panel
                }
              >
                <h2
                  style={
                    styles.panelTitle
                  }
                >
                  Platform Summary
                </h2>

                <div
                  style={
                    styles.summaryRow
                  }
                >
                  <span>
                    Total Users
                  </span>

                  <strong>
                    {stats?.totalUsers ||
                      0}
                  </strong>
                </div>

                <div
                  style={
                    styles.summaryRow
                  }
                >
                  <span>
                    Students
                  </span>

                  <strong>
                    {stats?.totalStudents ||
                      0}
                  </strong>
                </div>

                <div
                  style={
                    styles.summaryRow
                  }
                >
                  <span>
                    Admins
                  </span>

                  <strong>
                    {stats?.totalAdmins ||
                      0}
                  </strong>
                </div>

                <div
                  style={
                    styles.summaryRow
                  }
                >
                  <span>
                    Active Jobs
                  </span>

                  <strong>
                    {stats?.totalJobs ||
                      0}
                  </strong>
                </div>

                <div
                  style={
                    styles.summaryRow
                  }
                >
                  <span>
                    Companies
                  </span>

                  <strong>
                    {stats?.totalCompanies ||
                      0}
                  </strong>
                </div>

                <div
                  style={
                    styles.summaryRow
                  }
                >
                  <span>
                    DSA Questions
                  </span>

                  <strong>
                    {stats?.totalDSAQuestions ||
                      0}
                  </strong>
                </div>
              </div>

              <div
                style={
                  styles.panel
                }
              >
                <h2
                  style={
                    styles.panelTitle
                  }
                >
                  Quick Actions
                </h2>

                <div
                  style={
                    styles.quickGrid
                  }
                >
                  <button
                    style={
                      styles.quickButton
                    }
                    onClick={() =>
                      handleTabChange(
                        "students"
                      )
                    }
                  >
                    👨‍🎓
                    <span>
                      Manage Students
                    </span>
                  </button>

                  <button
                    style={
                      styles.quickButton
                    }
                    onClick={() =>
                      handleTabChange(
                        "jobs"
                      )
                    }
                  >
                    💼
                    <span>
                      Manage Jobs
                    </span>
                  </button>

                  <button
                    style={
                      styles.quickButton
                    }
                    onClick={() =>
                      handleTabChange(
                        "companies"
                      )
                    }
                  >
                    🏢
                    <span>
                      Manage Companies
                    </span>
                  </button>

                  <button
                    style={
                      styles.quickButton
                    }
                    onClick={() =>
                      handleTabChange(
                        "dsa"
                      )
                    }
                  >
                    💻
                    <span>
                      Manage DSA
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            STUDENTS
        ========================= */}

        {activeTab === "students" && (
          <div
            style={
              styles.panel
            }
          >
            <div
              style={
                styles.sectionHeader
              }
            >
              <div>
                <h2
                  style={
                    styles.panelTitle
                  }
                >
                  Students
                </h2>

                <p
                  style={
                    styles.sectionText
                  }
                >
                  Manage registered
                  students.
                </p>
              </div>

              <span
                style={
                  styles.countBadge
                }
              >
                {users.length} Students
              </span>
            </div>

            {users.length === 0 ? (
              <EmptyState
                text="No students found."
              />
            ) : (
              <div
                style={
                  styles.tableWrapper
                }
              >
                <table
                  style={
                    styles.table
                  }
                >
                  <thead>
                    <tr>
                      <th
                        style={
                          styles.th
                        }
                      >
                        Student
                      </th>

                      <th
                        style={
                          styles.th
                        }
                      >
                        Email
                      </th>

                      <th
                        style={
                          styles.th
                        }
                      >
                        Role
                      </th>

                      <th
                        style={
                          styles.th
                        }
                      >
                        Profile
                      </th>

                      <th
                        style={
                          styles.th
                        }
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map(
                      (student) => (
                        <tr
                          key={
                            student._id
                          }
                        >
                          <td
                            style={
                              styles.td
                            }
                          >
                            <strong>
                              {
                                student.name
                              }
                            </strong>
                          </td>

                          <td
                            style={
                              styles.td
                            }
                          >
                            {
                              student.email
                            }
                          </td>

                          <td
                            style={
                              styles.td
                            }
                          >
                            <span
                              style={
                                styles.roleBadge
                              }
                            >
                              {
                                student.role
                              }
                            </span>
                          </td>

                          <td
                            style={
                              styles.td
                            }
                          >
                            {
                              student.profileScore ||
                              0
                            }
                            %
                          </td>

                          <td
                            style={
                              styles.td
                            }
                          >
                            {student.role !==
                              "admin" && (
                              <button
                                style={
                                  styles.deleteButton
                                }
                                onClick={() =>
                                  deleteUser(
                                    student._id
                                  )
                                }
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================
            JOBS
        ========================= */}

        {activeTab === "jobs" && (
          <div
            style={
              styles.panel
            }
          >
            <div
              style={
                styles.sectionHeader
              }
            >
              <div>
                <h2
                  style={
                    styles.panelTitle
                  }
                >
                  Job Management
                </h2>

                <p
                  style={
                    styles.sectionText
                  }
                >
                  Add, edit or delete
                  placement jobs.
                </p>
              </div>

              <button
                style={
                  styles.primaryButton
                }
                onClick={
                  openAddJob
                }
              >
                + Add Job
              </button>
            </div>

            {jobs.length === 0 ? (
              <EmptyState
                text="No jobs found."
              />
            ) : (
              <div
                style={
                  styles.cardsGrid
                }
              >
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    style={
                      styles.itemCard
                    }
                  >
                    <div
                      style={
                        styles.itemTop
                      }
                    >
                      <div>
                        <h3
                          style={
                            styles.itemTitle
                          }
                        >
                          {job.title}
                        </h3>

                        <p
                          style={
                            styles.itemCompany
                          }
                        >
                          {job.company}
                        </p>
                      </div>

                      <span
                        style={{
                          ...styles.statusBadge,
                          ...(job.isActive
                            ? styles.active
                            : styles.inactive),
                        }}
                      >
                        {job.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div
                      style={
                        styles.itemDetails
                      }
                    >
                      <span>
                        📍{" "}
                        {job.location}
                      </span>

                      <span>
                        💼{" "}
                        {job.jobType}
                      </span>

                      <span>
                        🎯{" "}
                        {job.experience}
                      </span>
                    </div>

                    <div
                      style={
                        styles.cardActions
                      }
                    >
                      <button
                        style={
                          styles.editButton
                        }
                        onClick={() =>
                          openEditJob(
                            job
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        style={
                          styles.deleteButton
                        }
                        onClick={() =>
                          deleteJob(
                            job._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================
            COMPANIES
        ========================= */}

        {activeTab === "companies" && (
          <div
            style={
              styles.panel
            }
          >
            <div
              style={
                styles.sectionHeader
              }
            >
              <div>
                <h2
                  style={
                    styles.panelTitle
                  }
                >
                  Company Management
                </h2>

                <p
                  style={
                    styles.sectionText
                  }
                >
                  Manage company
                  preparation content.
                </p>
              </div>

              <button
                style={
                  styles.primaryButton
                }
                onClick={
                  openAddCompany
                }
              >
                + Add Company
              </button>
            </div>

            {companies.length ===
            0 ? (
              <EmptyState
                text="No companies found."
              />
            ) : (
              <div
                style={
                  styles.cardsGrid
                }
              >
                {companies.map(
                  (company) => (
                    <div
                      key={
                        company._id
                      }
                      style={
                        styles.itemCard
                      }
                    >
                      <div
                        style={
                          styles.itemTop
                        }
                      >
                        <div>
                          <h3
                            style={
                              styles.itemTitle
                            }
                          >
                            {
                              company.name
                            }
                          </h3>

                          <p
                            style={
                              styles.itemCompany
                            }
                          >
                            {
                              company.shortName
                            }
                          </p>
                        </div>

                        <span
                          style={{
                            ...styles.statusBadge,
                            ...(company.isActive
                              ? styles.active
                              : styles.inactive),
                          }}
                        >
                          {company.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <p
                        style={
                          styles.description
                        }
                      >
                        {
                          company.description
                        }
                      </p>

                      <div
                        style={
                          styles.itemDetails
                        }
                      >
                        <span>
                          🎯{" "}
                          {
                            company.difficulty
                          }
                        </span>

                        <span>
                          💼{" "}
                          {
                            company.hiringType
                          }
                        </span>

                        <span>
                          💻{" "}
                          {
                            company
                              .dsaTopics
                              ?.length ||
                            0
                          }{" "}
                          DSA Topics
                        </span>
                      </div>

                      <div
                        style={
                          styles.cardActions
                        }
                      >
                        <button
                          style={
                            styles.editButton
                          }
                          onClick={() =>
                            openEditCompany(
                              company
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          style={
                            styles.deleteButton
                          }
                          onClick={() =>
                            deleteCompany(
                              company._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================
            DSA QUESTIONS
        ========================= */}

        {activeTab === "dsa" && (
          <div
            style={
              styles.panel
            }
          >
            <div
              style={
                styles.sectionHeader
              }
            >
              <div>
                <h2
                  style={
                    styles.panelTitle
                  }
                >
                  DSA Question Management
                </h2>

                <p
                  style={
                    styles.sectionText
                  }
                >
                  Create placement-focused
                  coding questions for
                  students.
                </p>
              </div>

              <button
                style={
                  styles.primaryButton
                }
                onClick={
                  openAddDSA
                }
              >
                + Add DSA Question
              </button>
            </div>

            {dsaQuestions.length ===
            0 ? (
              <EmptyState
                text="No DSA questions found."
              />
            ) : (
              <div
                style={
                  styles.dsaAdminGrid
                }
              >
                {dsaQuestions.map(
                  (question, index) => (
                    <div
                      key={
                        question._id
                      }
                      style={
                        styles.dsaCard
                      }
                    >
                      <div
                        style={
                          styles.dsaCardHeader
                        }
                      >
                        <span
                          style={
                            styles.numberBadge
                          }
                        >
                          #
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span
                          style={{
                            ...styles.difficultyBadge,

                            ...(question.difficulty ===
                            "Easy"
                              ? styles.easy
                              : question.difficulty ===
                                "Medium"
                              ? styles.medium
                              : styles.hard),
                          }}
                        >
                          {
                            question.difficulty
                          }
                        </span>
                      </div>

                      <h3
                        style={
                          styles.dsaTitle
                        }
                      >
                        {
                          question.title
                        }
                      </h3>

                      <span
                        style={
                          styles.topicBadge
                        }
                      >
                        {
                          question.topic
                        }
                      </span>

                      <p
                        style={
                          styles.dsaDescription
                        }
                      >
                        {
                          question.description ||
                          "No description available."
                        }
                      </p>

                      <div
                        style={
                          styles.dsaMeta
                        }
                      >
                        <span>
                          🧪{" "}
                          {
                            question
                              .testCases
                              ?.length ||
                            0
                          }{" "}
                          Test Cases
                        </span>

                        <span
                          style={{
                            color:
                              question.isActive
                                ? "#15803d"
                                : "#dc2626",
                            fontWeight: 700,
                          }}
                        >
                          {question.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <div
                        style={
                          styles.cardActions
                        }
                      >
                        <button
                          style={
                            styles.editButton
                          }
                          onClick={() =>
                            openEditDSA(
                              question
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          style={
                            styles.deleteButton
                          }
                          onClick={() =>
                            deleteDSAQuestion(
                              question._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================
          JOB MODAL
      ========================= */}

      {showJobModal && (
        <Modal
          title={
            editingJob
              ? "Edit Job"
              : "Add New Job"
          }
          onClose={() =>
            setShowJobModal(false)
          }
        >
          <form
            onSubmit={saveJob}
          >
            <div
              style={
                styles.formGrid
              }
            >
              <FormInput
                label="Job Title"
                name="title"
                value={
                  jobForm.title
                }
                onChange={
                  handleJobChange
                }
                required
              />

              <FormInput
                label="Company"
                name="company"
                value={
                  jobForm.company
                }
                onChange={
                  handleJobChange
                }
                required
              />

              <FormInput
                label="Location"
                name="location"
                value={
                  jobForm.location
                }
                onChange={
                  handleJobChange
                }
              />

              <FormInput
                label="Experience"
                name="experience"
                value={
                  jobForm.experience
                }
                onChange={
                  handleJobChange
                }
              />

              <div>
                <label
                  style={
                    styles.label
                  }
                >
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={
                    jobForm.jobType
                  }
                  onChange={
                    handleJobChange
                  }
                  style={
                    styles.input
                  }
                >
                  <option>
                    Full Time
                  </option>

                  <option>
                    Internship
                  </option>

                  <option>
                    Part Time
                  </option>
                </select>
              </div>

              <FormInput
                label="Salary"
                name="salary"
                value={
                  jobForm.salary
                }
                onChange={
                  handleJobChange
                }
              />

              <FormInput
                label="Skills"
                name="skills"
                value={
                  jobForm.skills
                }
                onChange={
                  handleJobChange
                }
                placeholder="React, Node.js, MongoDB"
              />

              <FormInput
                label="Apply URL"
                name="applyUrl"
                value={
                  jobForm.applyUrl
                }
                onChange={
                  handleJobChange
                }
              />

              <div
                style={
                  styles.fullField
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    jobForm.description
                  }
                  onChange={
                    handleJobChange
                  }
                  style={
                    styles.textarea
                  }
                  rows="4"
                />
              </div>

              <label
                style={
                  styles.checkboxLabel
                }
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    jobForm.isActive
                  }
                  onChange={
                    handleJobChange
                  }
                />

                Active Job
              </label>
            </div>

            <ModalActions
              onCancel={() =>
                setShowJobModal(
                  false
                )
              }
              saving={saving}
            />
          </form>
        </Modal>
      )}

      {/* =========================
          COMPANY MODAL
      ========================= */}

      {showCompanyModal && (
        <Modal
          title={
            editingCompany
              ? "Edit Company"
              : "Add New Company"
          }
          onClose={() =>
            setShowCompanyModal(
              false
            )
          }
          wide
        >
          <form
            onSubmit={
              saveCompany
            }
          >
            <div
              style={
                styles.formGrid
              }
            >
              <FormInput
                label="Company Name"
                name="name"
                value={
                  companyForm.name
                }
                onChange={
                  handleCompanyChange
                }
                required
              />

              <FormInput
                label="Short Name"
                name="shortName"
                value={
                  companyForm.shortName
                }
                onChange={
                  handleCompanyChange
                }
              />

              <div>
                <label
                  style={
                    styles.label
                  }
                >
                  Difficulty
                </label>

                <select
                  name="difficulty"
                  value={
                    companyForm.difficulty
                  }
                  onChange={
                    handleCompanyChange
                  }
                  style={
                    styles.input
                  }
                >
                  <option>
                    Easy
                  </option>

                  <option>
                    Medium
                  </option>

                  <option>
                    Hard
                  </option>
                </select>
              </div>

              <FormInput
                label="Hiring Type"
                name="hiringType"
                value={
                  companyForm.hiringType
                }
                onChange={
                  handleCompanyChange
                }
              />

              <FormInput
                label="Selection Process"
                name="selectionProcess"
                value={
                  companyForm.selectionProcess
                }
                onChange={
                  handleCompanyChange
                }
                placeholder="Aptitude, Technical, HR"
              />

              <FormInput
                label="Required Skills"
                name="requiredSkills"
                value={
                  companyForm.requiredSkills
                }
                onChange={
                  handleCompanyChange
                }
                placeholder="Java, DSA, SQL"
              />

              <FormInput
                label="DSA Topics"
                name="dsaTopics"
                value={
                  companyForm.dsaTopics
                }
                onChange={
                  handleCompanyChange
                }
                placeholder="Arrays, Strings, Trees"
              />

              <FormInput
                label="Preparation Tips"
                name="preparationTips"
                value={
                  companyForm.preparationTips
                }
                onChange={
                  handleCompanyChange
                }
                placeholder="Practice DSA daily, revise SQL"
              />

              <div
                style={
                  styles.fullField
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    companyForm.description
                  }
                  onChange={
                    handleCompanyChange
                  }
                  style={
                    styles.textarea
                  }
                  rows="4"
                />
              </div>

              <div
                style={
                  styles.fullField
                }
              >
                <QuestionEditor
                  title="Technical Questions"
                  questions={
                    companyForm.technicalQuestions
                  }
                  type="technicalQuestions"
                  onAdd={
                    addCompanyQuestion
                  }
                  onRemove={
                    removeCompanyQuestion
                  }
                  onChange={
                    updateCompanyQuestion
                  }
                />
              </div>

              <div
                style={
                  styles.fullField
                }
              >
                <QuestionEditor
                  title="HR Questions"
                  questions={
                    companyForm.hrQuestions
                  }
                  type="hrQuestions"
                  onAdd={
                    addCompanyQuestion
                  }
                  onRemove={
                    removeCompanyQuestion
                  }
                  onChange={
                    updateCompanyQuestion
                  }
                />
              </div>

              <label
                style={
                  styles.checkboxLabel
                }
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    companyForm.isActive
                  }
                  onChange={
                    handleCompanyChange
                  }
                />

                Active Company
              </label>
            </div>

            <ModalActions
              onCancel={() =>
                setShowCompanyModal(
                  false
                )
              }
              saving={saving}
            />
          </form>
        </Modal>
      )}

      {/* =========================
          DSA MODAL
      ========================= */}

      {showDSAModal && (
        <Modal
          title={
            editingDSA
              ? "Edit DSA Question"
              : "Add DSA Question"
          }
          onClose={() =>
            setShowDSAModal(
              false
            )
          }
          wide
        >
          <form
            onSubmit={
              saveDSAQuestion
            }
          >
            <div
              style={
                styles.formGrid
              }
            >
              <FormInput
                label="Question Title"
                name="title"
                value={
                  dsaForm.title
                }
                onChange={
                  handleDSAChange
                }
                required
                placeholder="Two Sum"
              />

              <FormInput
                label="Topic"
                name="topic"
                value={
                  dsaForm.topic
                }
                onChange={
                  handleDSAChange
                }
                required
                placeholder="Arrays"
              />

              <div>
                <label
                  style={
                    styles.label
                  }
                >
                  Difficulty
                </label>

                <select
                  name="difficulty"
                  value={
                    dsaForm.difficulty
                  }
                  onChange={
                    handleDSAChange
                  }
                  style={
                    styles.input
                  }
                >
                  <option>
                    Easy
                  </option>

                  <option>
                    Medium
                  </option>

                  <option>
                    Hard
                  </option>
                </select>
              </div>

              <div
                style={
                  styles.fullField
                }
              >
                <label
                  style={
                    styles.label
                  }
                >
                  Problem Description
                </label>

                <textarea
                  name="description"
                  value={
                    dsaForm.description
                  }
                  onChange={
                    handleDSAChange
                  }
                  style={
                    styles.textarea
                  }
                  rows="5"
                  placeholder="Explain the problem clearly..."
                />
              </div>

              <div>
                <label
                  style={
                    styles.label
                  }
                >
                  Input Format
                </label>

                <textarea
                  name="input"
                  value={
                    dsaForm.input
                  }
                  onChange={
                    handleDSAChange
                  }
                  style={
                    styles.textarea
                  }
                  rows="4"
                  placeholder="Describe input format..."
                />
              </div>

              <div>
                <label
                  style={
                    styles.label
                  }
                >
                  Output Format
                </label>

                <textarea
                  name="output"
                  value={
                    dsaForm.output
                  }
                  onChange={
                    handleDSAChange
                  }
                  style={
                    styles.textarea
                  }
                  rows="4"
                  placeholder="Describe expected output..."
                />
              </div>

              <div>
                <label
                  style={
                    styles.label
                  }
                >
                  Explanation
                </label>

                <textarea
                  name="explanation"
                  value={
                    dsaForm.explanation
                  }
                  onChange={
                    handleDSAChange
                  }
                  style={
                    styles.textarea
                  }
                  rows="4"
                  placeholder="Explain the approach..."
                />
              </div>

              <div>
                <label
                  style={
                    styles.label
                  }
                >
                  Constraints
                </label>

                <textarea
                  name="constraints"
                  value={
                    dsaForm.constraints
                  }
                  onChange={
                    handleDSAChange
                  }
                  style={
                    styles.textarea
                  }
                  rows="4"
                  placeholder="1 <= n <= 100000"
                />
              </div>

              {/* TEST CASES */}

              <div
                style={
                  styles.fullField
                }
              >
                <div
                  style={
                    styles.testHeader
                  }
                >
                  <div>
                    <h3
                      style={
                        styles.subTitle
                      }
                    >
                      Test Cases
                    </h3>

                    <p
                      style={
                        styles.sectionText
                      }
                    >
                      These inputs will be
                      used to test the
                      student's Java code.
                    </p>
                  </div>

                  <button
                    type="button"
                    style={
                      styles.secondaryButton
                    }
                    onClick={
                      addDSATestCase
                    }
                  >
                    + Add Test Case
                  </button>
                </div>

                {dsaForm.testCases.map(
                  (
                    testCase,
                    index
                  ) => (
                    <div
                      key={index}
                      style={
                        styles.testCaseBox
                      }
                    >
                      <div
                        style={
                          styles.testCaseHeader
                        }
                      >
                        <strong>
                          Test Case{" "}
                          {index + 1}
                        </strong>

                        {dsaForm
                          .testCases
                          .length >
                          1 && (
                          <button
                            type="button"
                            style={
                              styles.smallDelete
                            }
                            onClick={() =>
                              removeDSATestCase(
                                index
                              )
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div
                        style={
                          styles.testGrid
                        }
                      >
                        <div>
                          <label
                            style={
                              styles.label
                            }
                          >
                            Input
                          </label>

                          <textarea
                            value={
                              testCase.input
                            }
                            onChange={(
                              e
                            ) =>
                              updateDSATestCase(
                                index,
                                "input",
                                e
                                  .target
                                  .value
                              )
                            }
                            style={
                              styles.codeTextarea
                            }
                            rows="5"
                            placeholder={
                              "4\n2 7 11 15\n9"
                            }
                          />
                        </div>

                        <div>
                          <label
                            style={
                              styles.label
                            }
                          >
                            Expected Output
                          </label>

                          <textarea
                            value={
                              testCase.expectedOutput
                            }
                            onChange={(
                              e
                            ) =>
                              updateDSATestCase(
                                index,
                                "expectedOutput",
                                e
                                  .target
                                  .value
                              )
                            }
                            style={
                              styles.codeTextarea
                            }
                            rows="5"
                            placeholder="0 1"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>

              <label
                style={
                  styles.checkboxLabel
                }
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    dsaForm.isActive
                  }
                  onChange={
                    handleDSAChange
                  }
                />

                Active Question
              </label>
            </div>

            <ModalActions
              onCancel={() =>
                setShowDSAModal(
                  false
                )
              }
              saving={saving}
              saveText={
                editingDSA
                  ? "Update Question"
                  : "Create Question"
              }
            />
          </form>
        </Modal>
      )}
    </div>
  );
};

/* =========================
   COMPONENTS
========================= */

const StatCard = ({
  icon,
  title,
  value,
}) => {
  return (
    <div style={styles.statCard}>
      <div
        style={
          styles.statIcon
        }
      >
        {icon}
      </div>

      <div>
        <span
          style={
            styles.statTitle
          }
        >
          {title}
        </span>

        <strong
          style={
            styles.statValue
          }
        >
          {value}
        </strong>
      </div>
    </div>
  );
};

const EmptyState = ({
  text,
}) => {
  return (
    <div
      style={
        styles.empty
      }
    >
      <div
        style={
          styles.emptyIcon
        }
      >
        📭
      </div>

      <p>{text}</p>
    </div>
  );
};

const FormInput = ({
  label,
  name,
  value,
  onChange,
  required,
  placeholder,
}) => {
  return (
    <div>
      <label
        style={
          styles.label
        }
      >
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={
          styles.input
        }
      />
    </div>
  );
};

const Modal = ({
  title,
  onClose,
  children,
  wide,
}) => {
  return (
    <div
      style={
        styles.modalOverlay
      }
    >
      <div
        style={{
          ...styles.modal,
          ...(wide
            ? styles.modalWide
            : {}),
        }}
      >
        <div
          style={
            styles.modalHeader
          }
        >
          <h2
            style={
              styles.modalTitle
            }
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            style={
              styles.closeButton
            }
          >
            ×
          </button>
        </div>

        <div
          style={
            styles.modalBody
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const ModalActions = ({
  onCancel,
  saving,
  saveText = "Save",
}) => {
  return (
    <div
      style={
        styles.modalActions
      }
    >
      <button
        type="button"
        style={
          styles.cancelButton
        }
        onClick={onCancel}
      >
        Cancel
      </button>

      <button
        type="submit"
        style={
          styles.primaryButton
        }
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : saveText}
      </button>
    </div>
  );
};

const QuestionEditor = ({
  title,
  questions,
  type,
  onAdd,
  onRemove,
  onChange,
}) => {
  return (
    <div>
      <div
        style={
          styles.questionEditorHeader
        }
      >
        <h3
          style={
            styles.subTitle
          }
        >
          {title}
        </h3>

        <button
          type="button"
          style={
            styles.secondaryButton
          }
          onClick={() =>
            onAdd(type)
          }
        >
          + Add
        </button>
      </div>

      {questions.length ===
      0 ? (
        <p
          style={
            styles.mutedText
          }
        >
          No questions added.
        </p>
      ) : (
        questions.map(
          (
            item,
            index
          ) => (
            <div
              key={index}
              style={
                styles.questionEditor
              }
            >
              <div
                style={
                  styles.questionEditorTop
                }
              >
                <strong>
                  Question{" "}
                  {index + 1}
                </strong>

                <button
                  type="button"
                  style={
                    styles.smallDelete
                  }
                  onClick={() =>
                    onRemove(
                      type,
                      index
                    )
                  }
                >
                  Remove
                </button>
              </div>

              <input
                type="text"
                value={
                  item.question
                }
                onChange={(e) =>
                  onChange(
                    type,
                    index,
                    "question",
                    e.target.value
                  )
                }
                placeholder="Question"
                style={
                  styles.input
                }
              />

              <textarea
                value={
                  item.answer
                }
                onChange={(e) =>
                  onChange(
                    type,
                    index,
                    "answer",
                    e.target.value
                  )
                }
                placeholder="Answer"
                style={
                  styles.textarea
                }
                rows="3"
              />
            </div>
          )
        )
      )}
    </div>
  );
};

/* =========================
   TAB STYLE
========================= */

const tabStyle = (
  active
) => ({
  padding: "12px 18px",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "14px",

  background: active
    ? "#4f46e5"
    : "#f3f4f6",

  color: active
    ? "#ffffff"
    : "#374151",

  transition:
    "0.2s ease",
});

/* =========================
   STYLES
========================= */

const styles = {
  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "35px 20px 60px",
  },

  loadingPage: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop:
      "4px solid #4f46e5",
    borderRadius: "50%",
    animation:
      "adminSpin 1s linear infinite",
    marginBottom: "15px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "20px",
    marginBottom: "25px",
  },

  kicker: {
    color: "#4f46e5",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1.5px",
  },

  title: {
    margin: "6px 0",
    fontSize: "34px",
    color: "#111827",
  },

  subtitle: {
    margin: 0,
    color: "#6b7280",
  },

  backButton: {
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    borderRadius: "10px",
    padding: "11px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },

  tabs: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    padding: "8px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    marginBottom: "25px",
    boxShadow:
      "0 5px 20px rgba(15,23,42,0.04)",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "15px",
    fontWeight: 600,
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "15px",
    fontWeight: 600,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "22px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.05)",
  },

  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "13px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  },

  statTitle: {
    display: "block",
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "4px",
  },

  statValue: {
    display: "block",
    color: "#111827",
    fontSize: "25px",
  },

  overviewGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },

  panel: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "22px",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.05)",
  },

  panelTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#111827",
  },

  sectionText: {
    margin: "5px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  summaryRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "13px 0",
    borderBottom:
      "1px solid #f3f4f6",
    color: "#6b7280",
  },

  quickGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "12px",
    marginTop: "18px",
  },

  quickButton: {
    border: "1px solid #e5e7eb",
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontWeight: 700,
    color: "#374151",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "15px",
    marginBottom: "20px",
  },

  countBadge: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 700,
  },

  primaryButton: {
    border: "none",
    background: "#4f46e5",
    color: "#ffffff",
    padding: "11px 17px",
    borderRadius: "9px",
    fontWeight: 700,
    cursor: "pointer",
  },

  secondaryButton: {
    border: "1px solid #c7d2fe",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "9px 13px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse:
      "collapse",
    minWidth: "750px",
  },

  th: {
    textAlign: "left",
    padding: "13px",
    background: "#f9fafb",
    color: "#4b5563",
    fontSize: "13px",
  },

  td: {
    padding: "14px 13px",
    borderBottom:
      "1px solid #f3f4f6",
    color: "#4b5563",
    fontSize: "14px",
  },

  roleBadge: {
    background: "#eef2ff",
    color: "#4338ca",
    padding: "5px 9px",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: 700,
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "18px",
  },

  itemCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "18px",
    background: "#ffffff",
  },

  itemTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent:
      "space-between",
    gap: "10px",
  },

  itemTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#111827",
  },

  itemCompany: {
    margin: "5px 0 0",
    color: "#4f46e5",
    fontWeight: 700,
  },

  itemDetails: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "15px",
    fontSize: "12px",
    color: "#6b7280",
  },

  statusBadge: {
    padding: "5px 9px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: 800,
  },

  active: {
    background: "#dcfce7",
    color: "#15803d",
  },

  inactive: {
    background: "#fee2e2",
    color: "#dc2626",
  },

  description: {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: 1.5,
    marginTop: "14px",
  },

  cardActions: {
    display: "flex",
    gap: "8px",
    marginTop: "18px",
  },

  editButton: {
    flex: 1,
    border: "none",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "9px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },

  deleteButton: {
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    padding: "9px 13px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  /* DSA */

  dsaAdminGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
  },

  dsaCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "19px",
    background: "#ffffff",
    boxShadow:
      "0 5px 18px rgba(15,23,42,0.04)",
  },

  dsaCardHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  numberBadge: {
    background: "#f3f4f6",
    color: "#4b5563",
    padding: "5px 9px",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: 800,
  },

  difficultyBadge: {
    padding: "5px 9px",
    borderRadius: "7px",
    fontSize: "11px",
    fontWeight: 800,
  },

  easy: {
    background: "#dcfce7",
    color: "#15803d",
  },

  medium: {
    background: "#fef3c7",
    color: "#b45309",
  },

  hard: {
    background: "#fee2e2",
    color: "#dc2626",
  },

  dsaTitle: {
    margin:
      "15px 0 8px",
    fontSize: "19px",
    color: "#111827",
  },

  topicBadge: {
    display: "inline-block",
    background: "#eef2ff",
    color: "#4338ca",
    padding: "5px 9px",
    borderRadius: "7px",
    fontSize: "12px",
    fontWeight: 700,
  },

  dsaDescription: {
    color: "#6b7280",
    fontSize: "13px",
    lineHeight: 1.5,
    minHeight: "40px",
  },

  dsaMeta: {
    display: "flex",
    justifyContent:
      "space-between",
    gap: "10px",
    marginTop: "15px",
    fontSize: "12px",
    color: "#6b7280",
  },

  /* MODAL */

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(15,23,42,0.62)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  modal: {
    width: "100%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.2)",
  },

  modalWide: {
    maxWidth: "1000px",
  },

  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    padding: "20px 22px",
    borderBottom:
      "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    background: "#ffffff",
    zIndex: 2,
  },

  modalTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#111827",
  },

  closeButton: {
    border: "none",
    background: "#f3f4f6",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    fontSize: "22px",
    cursor: "pointer",
    color: "#374151",
  },

  modalBody: {
    padding: "22px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "17px",
  },

  fullField: {
    gridColumn:
      "1 / -1",
  },

  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "11px 12px",
    outline: "none",
    fontSize: "14px",
    background: "#ffffff",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "11px 12px",
    outline: "none",
    fontSize: "14px",
    resize: "vertical",
    fontFamily:
      "inherit",
  },

  codeTextarea: {
    width: "100%",
    boxSizing: "border-box",
    border:
      "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "11px 12px",
    outline: "none",
    fontSize: "13px",
    resize: "vertical",
    fontFamily:
      "Consolas, monospace",
    background: "#f9fafb",
  },

  checkboxLabel: {
    gridColumn:
      "1 / -1",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#374151",
    fontWeight: 700,
    fontSize: "14px",
  },

  modalActions: {
    display: "flex",
    justifyContent:
      "flex-end",
    gap: "10px",
    marginTop: "25px",
    paddingTop: "18px",
    borderTop:
      "1px solid #e5e7eb",
  },

  cancelButton: {
    border:
      "1px solid #d1d5db",
    background: "#ffffff",
    color: "#374151",
    padding: "10px 17px",
    borderRadius: "8px",
    fontWeight: 700,
    cursor: "pointer",
  },

  testHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "14px",
  },

  subTitle: {
    margin: 0,
    fontSize: "17px",
    color: "#111827",
  },

  testCaseBox: {
    border:
      "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "12px",
    background: "#f9fafb",
  },

  testCaseHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: "12px",
    color: "#374151",
  },

  testGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "15px",
  },

  smallDelete: {
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    padding: "6px 9px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },

  questionEditorHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: "12px",
  },

  questionEditor: {
    border:
      "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "12px",
    background: "#f9fafb",
  },

  questionEditorTop: {
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: "10px",
  },

  mutedText: {
    color: "#9ca3af",
    fontSize: "13px",
  },
};

export default AdminDashboard;