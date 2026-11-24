export interface SectionMeta {
  id: SectionId
  index: string
  title: string
  shortLabel: string
  progressRange: [number, number]
  anchorProgress: number
}

export type SectionId =
  | 'foundation'
  | 'blueprint'
  | 'core-systems'
  | 'project-chambers'
  | 'horizon'

export interface BlueprintMilestone {
  id: string
  code: string
  title: string
  summary: string
  focus: string
}

export type ProficiencyTier =
  | 'Working Foundation'
  | 'Practical Builder'
  | 'Practical Workflow'
  | 'Applied Learner'

export interface SkillNode {
  id: string
  name: string
  category: string
  tier: ProficiencyTier
  /** Normalized 0..1 architectural resonance indicator representing honest current depth */
  honestDepth: number
  levelRing: 1 | 2 | 3
  description: string
  appliedIn: string[]
}

export interface ProjectSchematicMetric {
  label: string
  value: string
}

export interface ProjectChamber {
  id: string
  chamberCode: string
  name: string
  shortDescription: string
  technologies: string[]
  status: string
  highlights: string[]
  githubUrl: string
  liveDemoUrl: string | null
  liveDemoPlaceholder: string
  isScreenshotPlaceholder: true
  screenshotPlaceholderNote: string
  architectureModules: string[]
  metrics: ProjectSchematicMetric[]
  geometryKind: 'prism' | 'terrain' | 'conduit' | 'beacon' | 'vault'
}

export interface ContactLink {
  id: string
  label: string
  value: string
  href: string | null
  isPlaceholder: boolean
  placeholderNote?: string
}

export const OWNER_PROFILE = {
  brand: 'BUILDING MY WORLD',
  name: 'Armin Tayebi',
  githubHandle: 'ArminT13',
  githubUrl: 'https://github.com/ArminT13',
  introHeadline: 'BUILDING MY WORLD.',
  introGreeting: "Hi, I'm Armin Tayebi.",
  introStatement:
    "I'm a Computer Science student passionate about software development, AI, and building meaningful digital experiences.",
  horizonHeadline: 'THIS WORLD IS STILL UNDER CONSTRUCTION.',
  horizonStatement:
    "Always learning. Always building. Always exploring what's next.",
} as const

export const SECTIONS: readonly SectionMeta[] = [
  {
    id: 'foundation',
    index: '01',
    title: 'THE FOUNDATION',
    shortLabel: 'Foundation',
    progressRange: [0.0, 0.18],
    anchorProgress: 0.0,
  },
  {
    id: 'blueprint',
    index: '02',
    title: 'THE BLUEPRINT',
    shortLabel: 'Blueprint',
    progressRange: [0.18, 0.38],
    anchorProgress: 0.27,
  },
  {
    id: 'core-systems',
    index: '03',
    title: 'THE CORE SYSTEMS',
    shortLabel: 'Core Systems',
    progressRange: [0.38, 0.58],
    anchorProgress: 0.48,
  },
  {
    id: 'project-chambers',
    index: '04',
    title: 'THE PROJECT CHAMBERS',
    shortLabel: 'Chambers',
    progressRange: [0.58, 0.84],
    anchorProgress: 0.7,
  },
  {
    id: 'horizon',
    index: '05',
    title: 'THE HORIZON',
    shortLabel: 'Horizon',
    progressRange: [0.84, 1.0],
    anchorProgress: 0.96,
  },
] as const

export const BLUEPRINT_MILESTONES: readonly BlueprintMilestone[] = [
  {
    id: 'cs-student',
    code: 'NODE 01',
    title: 'Computer Science Student',
    summary:
      'Building a disciplined foundation in algorithms, data structures, relational modeling, and systems thinking.',
    focus: 'Core CS Foundations',
  },
  {
    id: 'learning-swe',
    code: 'NODE 02',
    title: 'Learning Software Development',
    summary:
      'Practicing clean separation of concerns, modular packages, error handling, and automated testing.',
    focus: 'Engineering Craft',
  },
  {
    id: 'python-java',
    code: 'NODE 03',
    title: 'Exploring Python & Java',
    summary:
      'Working across Python for rapid APIs, data scripts, and bots alongside typed Java object-oriented architecture.',
    focus: 'Dual-Language Fluency',
  },
  {
    id: 'practical-apps',
    code: 'NODE 04',
    title: 'Building Practical Applications',
    summary:
      'Shipping concrete tools that solve everyday workflows—study tracking, freelance management, inventory, and bots.',
    focus: 'Applied Problem Solving',
  },
  {
    id: 'exploring-ai',
    code: 'NODE 05',
    title: 'Exploring Artificial Intelligence',
    summary:
      'Experimenting with predictive machine learning pipelines and integrating generative AI models into interactive apps.',
    focus: 'ML & Generative AI',
  },
] as const

export const CORE_SKILLS: readonly SkillNode[] = [
  {
    id: 'python',
    name: 'Python',
    category: 'Core Language',
    tier: 'Working Foundation',
    honestDepth: 0.72,
    levelRing: 1,
    description:
      'Primary language used across web backends, data preparation, machine learning scripts, and Telegram automation.',
    appliedIn: [
      'StudyMate',
      'FreelanceFlow',
      'House Price Prediction',
      'Predict & Bet',
    ],
  },
  {
    id: 'java',
    name: 'Java',
    category: 'Core Language',
    tier: 'Working Foundation',
    honestDepth: 0.65,
    levelRing: 1,
    description:
      'Applied to object-oriented system modeling with interfaces, enums, custom domain exceptions, and DAO persistence.',
    appliedIn: ['Warehouse Management System'],
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'Backend Framework',
    tier: 'Practical Builder',
    honestDepth: 0.62,
    levelRing: 2,
    description:
      'Used to structure RESTful endpoints, Pydantic validation schemas, JWT authentication, and async service calls.',
    appliedIn: ['StudyMate'],
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    category: 'Data Persistence',
    tier: 'Working Foundation',
    honestDepth: 0.68,
    levelRing: 2,
    description:
      'Implemented relational schemas with foreign keys, WAL mode, parameterized queries, and JDBC / Python drivers.',
    appliedIn: [
      'StudyMate',
      'FreelanceFlow',
      'Predict & Bet',
      'Warehouse Management System',
    ],
  },
  {
    id: 'git-github',
    name: 'Git & GitHub',
    category: 'Developer Workflow',
    tier: 'Practical Workflow',
    honestDepth: 0.7,
    levelRing: 1,
    description:
      'Daily version control for structuring repositories, isolating environment secrets, and documenting builds.',
    appliedIn: ['All ArminT13 Public Repositories'],
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    category: 'Systems Connectivity',
    tier: 'Practical Builder',
    honestDepth: 0.64,
    levelRing: 2,
    description:
      'Integrating external HTTP APIs, Telegram Bot API command loops, and structured generative AI responses.',
    appliedIn: ['StudyMate', 'Predict & Bet', 'FreelanceFlow'],
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    category: 'Applied Exploration',
    tier: 'Applied Learner',
    honestDepth: 0.48,
    levelRing: 3,
    description:
      'Actively learning AI application design—integrating Google Gemini API for study planning and quiz generation.',
    appliedIn: ['StudyMate'],
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    category: 'Predictive Modeling',
    tier: 'Applied Learner',
    honestDepth: 0.46,
    levelRing: 3,
    description:
      'Exploring supervised regression workflows, EDA, train/test splitting, and model evaluation using scikit-learn.',
    appliedIn: ['California House Price Prediction'],
  },
] as const

export const PROJECT_CHAMBERS: readonly ProjectChamber[] = [
  {
    id: 'studymate',
    chamberCode: 'CHAMBER 01',
    name: 'StudyMate',
    shortDescription:
      'A gamified study platform designed to help students track study time, maintain motivation, and improve productivity with anti-cheat Pomodoro sessions, streaks, guild boss raids, and a Gemini AI planner.',
    technologies: [
      'Python',
      'FastAPI',
      'SQLite',
      'React 18',
      'JavaScript',
      'Tailwind CSS',
      'JWT',
      'Google Gemini AI',
    ],
    status: 'Completed Core Build · Render-Ready',
    highlights: [
      'Anti-cheat Pomodoro timer with coin rewards and optional AI recall quiz',
      '120-day study consistency heatmap and 7-day escalating streak cycle',
      'Guild Boss Raids turning focused study minutes into cooperative boss damage',
      'Gemini-powered day-by-day exam planner with locked future tasks',
    ],
    githubUrl: 'https://github.com/ArminT13/StudyMate',
    liveDemoUrl: null,
    liveDemoPlaceholder:
      'Live demo link placeholder — Render deployment blueprint (render.yaml) ready',
    isScreenshotPlaceholder: true,
    screenshotPlaceholderNote:
      'Screenshot placeholder — Architectural schematic generated from verified StudyMate modules',
    architectureModules: [
      'app/main.py',
      'app/ai_coach.py',
      'app/auth.py',
      'app/database.py',
      'static/js/app.jsx',
    ],
    metrics: [
      { label: 'Backend', value: 'FastAPI + SQLite WAL' },
      { label: 'AI Engine', value: 'Google Gemini Flash' },
      { label: 'Tests', value: 'test_suite.py' },
    ],
    geometryKind: 'prism',
  },
  {
    id: 'house-price-prediction',
    chamberCode: 'CHAMBER 02',
    name: 'California House Price Prediction',
    shortDescription:
      'A machine learning project focused on predicting house prices using California housing data, comparing Linear Regression and Random Forest Regressor models across an interactive CLI and Streamlit web interface.',
    technologies: ['Python', 'scikit-learn', 'pandas', 'Streamlit'],
    status: 'Completed & Deployed',
    highlights: [
      'Exploratory Data Analysis (EDA) and feature preparation on California Housing data',
      'Linear Regression baseline model: 0.5559 MSE and 57.58% R² score',
      'Random Forest Regressor model: 0.2560 MSE and 80.46% R² score',
      'Interactive CLI runner (main.py) and live Streamlit predictor app (app.py)',
    ],
    githubUrl: 'https://github.com/ArminT13/house-price-prediction',
    liveDemoUrl: 'https://house-price-prediction-armint13.streamlit.app/',
    liveDemoPlaceholder: 'Live Streamlit app available',
    isScreenshotPlaceholder: true,
    screenshotPlaceholderNote:
      'Screenshot placeholder — Model evaluation schematic from verified repository README',
    architectureModules: [
      'main.py (CLI Pipeline)',
      'app.py (Streamlit UI)',
      'requirements.txt',
    ],
    metrics: [
      { label: 'Baseline R²', value: '57.58% (Linear)' },
      { label: 'Best R²', value: '80.46% (Random Forest)' },
      { label: 'Best MSE', value: '0.2560' },
    ],
    geometryKind: 'terrain',
  },
  {
    id: 'freelance-flow',
    chamberCode: 'CHAMBER 03',
    name: 'FreelanceFlow',
    shortDescription:
      'A Python application for managing freelance projects and tracking income, combining client records, project lifecycle status filtering, CSV export, and real-time pipeline vs. realized income analytics.',
    technologies: [
      'Python',
      'Flask',
      'SQLite3',
      'HTML5',
      'JavaScript',
      'Tailwind CSS',
      'unittest',
    ],
    status: 'Completed & Deployed',
    highlights: [
      'Client directory and relational project tracking with foreign-key constraints',
      'Dynamic status filtering across pending, in_progress, and completed stages',
      'Live financial aggregation comparing total pipeline budget vs. realized income',
      'One-click CSV spreadsheet export and Flask integration test suite',
    ],
    githubUrl: 'https://github.com/ArminT13/FreelanceFlow',
    liveDemoUrl: 'https://armint13.pythonanywhere.com/',
    liveDemoPlaceholder: 'Live PythonAnywhere deployment available',
    isScreenshotPlaceholder: true,
    screenshotPlaceholderNote:
      'Screenshot placeholder — REST API & financial pipeline schematic from verified repo',
    architectureModules: [
      'app.py (Flask REST API)',
      'database.py (SQLite3)',
      'cli.py',
      'templates/index.html',
      'test_app.py',
    ],
    metrics: [
      { label: 'Endpoints', value: '/clients · /projects · /stats' },
      { label: 'Export', value: 'CSV Reporting' },
      { label: 'QA', value: 'unittest Suite' },
    ],
    geometryKind: 'conduit',
  },
  {
    id: 'predict-bet',
    chamberCode: 'CHAMBER 04',
    name: 'Predict & Bet',
    shortDescription:
      'A lightweight Telegram bot built with Python and SQLite for managing friendly match predictions and casual wagering using 100% virtual fake currency, rankings, and admin match resolution.',
    technologies: ['Python', 'pyTelegramBotAPI', 'Telegram Bot API', 'SQLite'],
    status: 'Completed · Self-Hosted Bot',
    highlights: [
      'Strictly virtual, zero-real-money currency designed for casual prediction games',
      'Interactive bot command routing (/start, /predict, /mybets, /leaderboard)',
      'Admin control commands (/admin) for match creation and payout settlement',
      'Portable SQLite persistence with isolated .env credential management',
    ],
    githubUrl: 'https://github.com/ArminT13/predict-bet-telegram-bot',
    liveDemoUrl: null,
    liveDemoPlaceholder:
      'Live demo link placeholder — Self-hosted Telegram bot service',
    isScreenshotPlaceholder: true,
    screenshotPlaceholderNote:
      'Screenshot placeholder — Telegram command router & virtual ledger schematic',
    architectureModules: [
      'Main.py (Bot Router)',
      'SQLite Ledger',
      '.env.example',
      'requirements.txt',
    ],
    metrics: [
      { label: 'Interface', value: '6 Bot Commands' },
      { label: 'Economy', value: '100% Virtual Coins' },
      { label: 'Storage', value: 'SQLite Portable DB' },
    ],
    geometryKind: 'beacon',
  },
  {
    id: 'warehouse-management',
    chamberCode: 'CHAMBER 05',
    name: 'Warehouse Management System',
    shortDescription:
      'A modular Java-based warehouse management application applying the Data Access Object (DAO) pattern, JDBC SQLite persistence, PreparedStatement safety, and structured domain exception handling.',
    technologies: ['Java (JDK 17+)', 'JDBC', 'SQLite', 'SLF4J', 'DAO Pattern'],
    status: 'Completed · Console Application',
    highlights: [
      'Clean separation of core domain models, DAO interfaces, and SQLite implementations',
      'Parameterized PreparedStatement queries and try-with-resources cleanup',
      'Relational entity architecture linking Warehouse, Category, Product, and Permit',
      'Custom exceptions for capacity, balance, stock, and missing warehouse guards',
    ],
    githubUrl: 'https://github.com/ArminT13/warehouse-management',
    liveDemoUrl: null,
    liveDemoPlaceholder:
      'Live demo link placeholder — Local JDK 17+ Java application',
    isScreenshotPlaceholder: true,
    screenshotPlaceholderNote:
      'Screenshot placeholder — DAO layered package blueprint from ir.ac.warehouse',
    architectureModules: [
      'core/ (Domain Models)',
      'dao/ (DAO + SQLite)',
      'db/ (DatabaseConnection)',
      'exception/ (Custom Guards)',
      'service/ (ReportService)',
    ],
    metrics: [
      { label: 'Architecture', value: 'DAO Pattern' },
      { label: 'Runtime', value: 'JDK 17+ / JDBC' },
      { label: 'Safety', value: 'PreparedStatement' },
    ],
    geometryKind: 'vault',
  },
] as const

export const CONTACT_LINKS: readonly ContactLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    value: 'github.com/ArminT13',
    href: 'https://github.com/ArminT13',
    isPlaceholder: false,
  },
  {
    id: 'email',
    label: 'Email',
    value: 'armin.tayebi@example.com',
    href: null,
    isPlaceholder: true,
    placeholderNote: 'Email Placeholder — Replace with preferred public address',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/placeholder',
    href: null,
    isPlaceholder: true,
    placeholderNote: 'Social Link Placeholder — Add when profile URL is ready',
  },
] as const
