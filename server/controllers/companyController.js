const CompanyPreparation = require("../models/CompanyPreparation");

const defaultCompanies = [
  {
    name: "TCS",
    shortName: "TCS",
    description:
      "Tata Consultancy Services is one of India's largest IT services and consulting companies. Campus hiring commonly focuses on programming fundamentals, aptitude, technical knowledge and communication.",

    difficulty: "Medium",

    hiringType:
      "Campus Placement",

    selectionProcess: [
      "Online Aptitude Test",
      "Coding / Programming Assessment",
      "Technical Interview",
      "Managerial / Technical Discussion",
      "HR Interview",
    ],

    requiredSkills: [
      "Java",
      "DSA",
      "OOP",
      "DBMS",
      "SQL",
      "Computer Networks",
      "Operating Systems",
      "Communication",
    ],

    dsaTopics: [
      "Arrays",
      "Strings",
      "Searching",
      "Sorting",
      "Linked List",
      "Stack",
      "Queue",
      "Recursion",
      "Hashing",
      "Basic Trees",
    ],

    technicalQuestions: [
      {
        question:
          "What are the four pillars of OOP?",
        answer:
          "The four pillars are Encapsulation, Abstraction, Inheritance and Polymorphism.",
      },
      {
        question:
          "What is the difference between ArrayList and LinkedList in Java?",
        answer:
          "ArrayList uses a dynamic array and provides fast random access. LinkedList uses linked nodes and is better for frequent insertion or deletion at known positions.",
      },
      {
        question:
          "What is normalization in DBMS?",
        answer:
          "Normalization organizes database tables to reduce redundancy and improve data integrity.",
      },
      {
        question:
          "What is the difference between primary key and foreign key?",
        answer:
          "A primary key uniquely identifies records in a table. A foreign key creates a relationship with the primary key of another table.",
      },
      {
        question:
          "What is process vs thread?",
        answer:
          "A process is an independent program in execution, while a thread is a smaller execution unit within a process.",
      },
    ],

    hrQuestions: [
      {
        question:
          "Tell me about yourself.",
        answer:
          "Give a short introduction covering your education, technical skills, projects, achievements and career goal.",
      },
      {
        question:
          "Why do you want to join TCS?",
        answer:
          "Explain your interest in technology, learning opportunities, large-scale projects and long-term career growth.",
      },
      {
        question:
          "What are your strengths?",
        answer:
          "Mention genuine strengths such as problem solving, consistency, teamwork or willingness to learn, with a short example.",
      },
      {
        question:
          "Where do you see yourself in five years?",
        answer:
          "Explain that you want to become a strong software professional, take responsibility and contribute to challenging projects.",
      },
    ],

    preparationTips: [
      "Practice aptitude and logical reasoning regularly.",
      "Strengthen Java fundamentals and OOP.",
      "Solve easy and medium DSA problems.",
      "Revise SQL queries and DBMS concepts.",
      "Prepare a clear explanation of your projects.",
      "Practice HR answers in simple English.",
    ],
  },

  {
    name: "Deloitte",
    shortName: "Deloitte",
    description:
      "Deloitte is a global professional services organization. Technical hiring can involve aptitude, coding, technical fundamentals, communication and behavioral interviews.",

    difficulty: "Medium",

    hiringType:
      "Campus Placement",

    selectionProcess: [
      "Online Assessment",
      "Aptitude / Logical Reasoning",
      "Technical Assessment",
      "Technical Interview",
      "HR / Behavioral Interview",
    ],

    requiredSkills: [
      "Java",
      "JavaScript",
      "DSA",
      "OOP",
      "DBMS",
      "SQL",
      "Web Development",
      "Communication",
    ],

    dsaTopics: [
      "Arrays",
      "Strings",
      "HashMap",
      "Sorting",
      "Searching",
      "Linked List",
      "Stack",
      "Queue",
      "Recursion",
      "Basic Dynamic Programming",
    ],

    technicalQuestions: [
      {
        question:
          "What is JavaScript?",
        answer:
          "JavaScript is a high-level programming language widely used to create interactive web applications and also used on servers through environments such as Node.js.",
      },
      {
        question:
          "What is the difference between let, const and var?",
        answer:
          "var is function scoped, while let and const are block scoped. const cannot be reassigned after initialization.",
      },
      {
        question:
          "What is REST API?",
        answer:
          "REST is an architectural style for designing web APIs around resources using HTTP methods such as GET, POST, PUT and DELETE.",
      },
      {
        question:
          "What is a JOIN in SQL?",
        answer:
          "A JOIN combines rows from multiple tables based on a related column or condition.",
      },
      {
        question:
          "What is polymorphism?",
        answer:
          "Polymorphism allows the same interface or method concept to behave differently depending on the object or implementation.",
      },
    ],

    hrQuestions: [
      {
        question:
          "Why Deloitte?",
        answer:
          "Connect your answer with learning, professional growth, technology exposure and the opportunity to work on challenging projects.",
      },
      {
        question:
          "Why should we hire you?",
        answer:
          "Discuss your technical skills, project experience, problem-solving ability and willingness to learn.",
      },
      {
        question:
          "Describe a difficult situation you solved.",
        answer:
          "Use a real project or academic example and explain the situation, your action and the result.",
      },
      {
        question:
          "Are you comfortable working in a team?",
        answer:
          "Explain a real team project and how you communicated, divided work and handled disagreements.",
      },
    ],

    preparationTips: [
      "Practice aptitude and reasoning.",
      "Prepare Java and JavaScript fundamentals.",
      "Revise OOP, DBMS, SQL and networking.",
      "Practice DSA problems without depending only on memorized solutions.",
      "Prepare detailed explanations of your projects.",
      "Practice behavioral questions aloud.",
    ],
  },

  {
    name: "Infosys",
    shortName: "Infosys",
    description:
      "Infosys is a major IT services and consulting company. Preparation should focus on aptitude, programming, CS fundamentals and communication.",

    difficulty: "Medium",

    hiringType:
      "Campus Placement",

    selectionProcess: [
      "Online Assessment",
      "Logical Reasoning",
      "Quantitative Aptitude",
      "Programming / Coding",
      "Technical Interview",
      "HR Interview",
    ],

    requiredSkills: [
      "Java",
      "Python",
      "DSA",
      "OOP",
      "DBMS",
      "SQL",
      "Problem Solving",
      "Communication",
    ],

    dsaTopics: [
      "Arrays",
      "Strings",
      "Sorting",
      "Searching",
      "Linked List",
      "Stack",
      "Queue",
      "Hashing",
      "Recursion",
    ],

    technicalQuestions: [
      {
        question:
          "What is inheritance?",
        answer:
          "Inheritance allows a class to acquire properties and behaviors of another class.",
      },
      {
        question:
          "What is an exception in Java?",
        answer:
          "An exception is an abnormal condition that interrupts normal program execution and can be handled using mechanisms such as try-catch.",
      },
      {
        question:
          "What is DBMS?",
        answer:
          "DBMS is software used to create, store, manage and retrieve data from databases.",
      },
      {
        question:
          "What is an SQL query?",
        answer:
          "An SQL query is a command used to retrieve or manipulate data in a relational database.",
      },
    ],

    hrQuestions: [
      {
        question:
          "Introduce yourself.",
        answer:
          "Give a concise introduction covering your education, skills, projects and career goal.",
      },
      {
        question:
          "Why Infosys?",
        answer:
          "Discuss learning opportunities, technology exposure and your interest in building a long-term software career.",
      },
      {
        question:
          "What is your weakness?",
        answer:
          "Choose a genuine but manageable weakness and explain what you are doing to improve it.",
      },
    ],

    preparationTips: [
      "Practice aptitude every day.",
      "Revise programming basics.",
      "Practice arrays and strings.",
      "Revise DBMS and SQL.",
      "Prepare project explanations.",
      "Improve spoken communication.",
    ],
  },

  {
    name: "Accenture",
    shortName: "Accenture",
    description:
      "Accenture provides technology and consulting services. Preparation should include coding, problem solving, communication and core computer science concepts.",

    difficulty: "Medium",

    hiringType:
      "Campus Placement",

    selectionProcess: [
      "Cognitive Assessment",
      "Technical Assessment",
      "Coding",
      "Communication Assessment",
      "Technical Interview",
      "HR Interview",
    ],

    requiredSkills: [
      "Java",
      "JavaScript",
      "DSA",
      "OOP",
      "DBMS",
      "SQL",
      "Web Development",
      "Communication",
    ],

    dsaTopics: [
      "Arrays",
      "Strings",
      "Sorting",
      "Searching",
      "Hashing",
      "Linked List",
      "Stack",
      "Queue",
      "Recursion",
    ],

    technicalQuestions: [
      {
        question:
          "What is the difference between == and === in JavaScript?",
        answer:
          "== performs type conversion before comparison, while === checks both value and type without implicit conversion.",
      },
      {
        question:
          "What is Node.js?",
        answer:
          "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows JavaScript to run outside the browser.",
      },
      {
        question:
          "What is MongoDB?",
        answer:
          "MongoDB is a document-oriented NoSQL database that stores data in flexible BSON documents.",
      },
      {
        question:
          "What is an API?",
        answer:
          "An API defines how different software components communicate with each other.",
      },
    ],

    hrQuestions: [
      {
        question:
          "Why Accenture?",
        answer:
          "Explain your interest in technology, learning, consulting and working on diverse projects.",
      },
      {
        question:
          "Tell us about your project.",
        answer:
          "Explain the problem, technology stack, your contribution, important features and challenges.",
      },
      {
        question:
          "How do you handle pressure?",
        answer:
          "Explain how you prioritize tasks, divide large problems into smaller tasks and remain consistent.",
      },
    ],

    preparationTips: [
      "Practice coding problems regularly.",
      "Revise JavaScript and Node.js.",
      "Prepare MERN project concepts.",
      "Revise DBMS and SQL.",
      "Practice communication questions.",
      "Be ready to explain your personal contribution in projects.",
    ],
  },

  {
    name: "Wipro",
    shortName: "Wipro",
    description:
      "Wipro is a global IT services company. Campus preparation commonly includes aptitude, programming, technical fundamentals and HR preparation.",

    difficulty: "Medium",

    hiringType:
      "Campus Placement",

    selectionProcess: [
      "Online Assessment",
      "Aptitude",
      "Logical Reasoning",
      "Coding",
      "Technical Interview",
      "HR Interview",
    ],

    requiredSkills: [
      "Java",
      "C++",
      "DSA",
      "OOP",
      "DBMS",
      "SQL",
      "Problem Solving",
      "Communication",
    ],

    dsaTopics: [
      "Arrays",
      "Strings",
      "Sorting",
      "Searching",
      "Linked List",
      "Stack",
      "Queue",
      "Recursion",
      "Hashing",
    ],

    technicalQuestions: [
      {
        question:
          "What is a class and object?",
        answer:
          "A class is a blueprint defining properties and behaviors, while an object is an instance of that class.",
      },
      {
        question:
          "What is a foreign key?",
        answer:
          "A foreign key is a column that references a key in another table and helps establish relationships between tables.",
      },
      {
        question:
          "What is binary search?",
        answer:
          "Binary search repeatedly divides a sorted search space into two halves. Its time complexity is O(log n).",
      },
    ],

    hrQuestions: [
      {
        question:
          "Tell me about yourself.",
        answer:
          "Introduce your education, technical skills, projects and career objective in about one to two minutes.",
      },
      {
        question:
          "Why should we hire you?",
        answer:
          "Focus on your technical foundation, project experience, learning attitude and problem-solving skills.",
      },
      {
        question:
          "Are you willing to relocate?",
        answer:
          "Answer honestly and explain your flexibility according to your circumstances.",
      },
    ],

    preparationTips: [
      "Practice aptitude.",
      "Solve basic DSA problems.",
      "Revise OOP concepts.",
      "Practice SQL queries.",
      "Prepare your project thoroughly.",
      "Practice HR answers.",
    ],
  },
];

const ensureCompanies = async () => {
  const count =
    await CompanyPreparation.countDocuments();

  if (count === 0) {
    await CompanyPreparation.insertMany(
      defaultCompanies
    );
  }
};

const getCompanies = async (req, res) => {
  try {
    await ensureCompanies();

    const companies =
      await CompanyPreparation.find(
        { isActive: true },
        {
          name: 1,
          shortName: 1,
          description: 1,
          difficulty: 1,
          hiringType: 1,
          requiredSkills: 1,
        }
      ).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.error(
      "Get companies error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load companies.",
    });
  }
};

const getCompanyById = async (
  req,
  res
) => {
  try {
    await ensureCompanies();

    const company =
      await CompanyPreparation.findOne({
        _id: req.params.id,
        isActive: true,
      });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error(
      "Get company error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load company preparation.",
    });
  }
};

module.exports = {
  getCompanies,
  getCompanyById,
};