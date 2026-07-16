export const IDENTITY = {
  name: "Yachi Darji",
  role: "Data Scientist · ML Engineer",
  location: "Chicago, IL",
  email: "darjiyachi8@gmail.com",
  linkedin: "https://linkedin.com/in/yachi-darji",
  github: "https://github.com/yachi2605",
  resume: "/yachi-darji-resume.pdf",
  visa: "OPT · STEM",
  shipped: 5,
};

export const MANIFESTO = [
  {
    n: "01",
    title: "The numbers get the final say.",
    plain: "When the data disagreed with my favorite model, I let the data win.",
    body:
      "My 37-fold backtest showed XGBoost beating the LSTM I'd spent weeks on, across every department. I shipped XGBoost. Being attached to the clever model is how projects die.",
  },
  {
    n: "02",
    title: "A slide metric isn't a result.",
    plain: "A good-looking number on a slide means nothing until it moves a real business metric.",
    body:
      "0.81 AUC looks fine in a deck. What I actually care about is the 8-week A/B test behind it: onboarding driven by the model lifted conversion 9.4% and cut churn 14.7%.",
  },
  {
    n: "03",
    title: "Ground the model or don't ship it.",
    plain: "I build extra checks so the AI can't just make things up — accuracy over eloquence.",
    body:
      "A fine-tuned Mistral 7B router (94% accuracy, 60ms) plus three layers of constitutional validation took RAGAS faithfulness from 0.76 to 0.92. Freeform answers are a liability.",
  },
  {
    n: "04",
    title: "Safety belongs in the database.",
    plain: "Even if my code has a bug, one user should never be able to see another user's data.",
    body:
      "PII scrubbing and prompt-injection guards are table stakes. The part that matters is enforcing isolation with row-level security, so a bug in app code still can't hand someone another tenant's data.",
  },
];

export const PROJECTS = [
  {
    id: "rentpilot",
    title: "RentPilot",
    tag: "Full-Stack AI · Live Product",
    year: "2026",
    category: "live",
    oneLiner: "AI-powered renter safety — lease red-flags, scam scoring, tenant-rights RAG.",
    stack: ["Next.js 14", "FastAPI", "Supabase", "OpenAI Structured", "RLS", "JWT"],
    live: "https://rent-safe-rose.vercel.app/",
    code: "https://github.com/yachi2605",
    image:
      "https://customer-assets.emergentagent.com/job_data-lab-chi/artifacts/rentpilot-arch.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
    accent: "#5B73FF",
    isNew: false,
    architecture: [
      {
        id: "client",
        label: "Client",
        tech: "Next.js 14 · TypeScript · Tailwind",
        decision: "Anonymous-first. The AI tools run without a login.",
        tradeoff:
          "I gave up some sign-up conversion for trust. An account is optional and only buys you persistence.",
      },
      {
        id: "api",
        label: "API",
        tech: "FastAPI · Pydantic · rate limiting",
        decision: "Thin gateway. The real logic sits next to the database.",
        tradeoff: "One extra hop, but RLS and the safety checks are easier to reason about.",
      },
      {
        id: "ai",
        label: "AI Layer",
        tech: "OpenAI Structured Outputs · Zod schemas",
        decision: "Every model response is a validated JSON contract.",
        tradeoff:
          "No freeform prose, but the UI never has to guess and no field is ever hallucinated.",
      },
      {
        id: "data",
        label: "Data Layer",
        tech: "Supabase · Postgres · Row-Level Security",
        decision: "Isolation is enforced by RLS at the database, not by app code.",
        tradeoff:
          "The policies take longer to write. In exchange, an app-code bug can't leak someone else's lease.",
      },
      {
        id: "auth",
        label: "Auth",
        tech: "Supabase Auth · JWT",
        decision: "Optional path. Auth unlocks history; it doesn't gate the tools.",
        tradeoff: "Two flows to keep working, so anonymous stays the one I test first.",
      },
    ],
  },
  {
    id: "supplychainiq",
    title: "SupplyChainIQ",
    tag: "ML · Full-Stack · Live Demo",
    year: "2026",
    category: "live",
    oneLiner: "Upload any CSV. Three models compete. Winner ships a 30-day forecast.",
    stack: ["Prophet", "XGBoost", "FastAPI", "React 18", "PostgreSQL"],
    live: "https://supply-chain-dashboard-xi-two.vercel.app",
    code: "https://github.com/yachi2605",
    image:
      "https://customer-assets.emergentagent.com/job_data-lab-chi/artifacts/supplychainiq-arch.png",
    fallbackImage:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
    accent: "#4ADE80",
    isNew: false,
    architecture: [
      {
        id: "browser",
        label: "Browser",
        tech: "React 18 SPA · DashboardContext · api.js · Vercel CDN",
        decision:
          "One context is the single source of truth. Every fetch carries an X-API-Key header.",
        tradeoff:
          "A global store gets heavy as pages grow, but it kept the 5 pages (Data, Forecast, Restock, Sim, Reports) in sync without prop drilling.",
      },
      {
        id: "upload",
        label: "Ingestion",
        tech: "POST /api/data/preview → /api/data/upload",
        decision:
          "Preview detects the column mapping before anything is committed. Upload validates, then stores.",
        tradeoff:
          "Two round-trips instead of one. Worth it — nobody uploads a broken CSV and finds out three screens later.",
      },
      {
        id: "compete",
        label: "Model Competition",
        tech: "SeasonalNaive7 · Prophet · XGBoost",
        decision:
          "Three models run, ranked by a composite of MAE + RMSE + MAPE. The winner ships the 30-day forecast.",
        tradeoff:
          "More compute per run than picking one model up front. But the data decides, not me.",
      },
      {
        id: "api",
        label: "FastAPI",
        tech: "APIKeyMiddleware → per-user DashboardState",
        decision:
          "/forecast/run, /restock/plan, /simulation/run and the report endpoints all read one per-user state object.",
        tradeoff:
          "State lives server-side, so a cold start reloads it — cheaper than recomputing forecasts on every request.",
      },
      {
        id: "db",
        label: "PostgreSQL",
        tech: "Render free tier · key/value JSON store",
        decision:
          "Processed dataset, forecast results and network config survive restarts and redeploys.",
        tradeoff:
          "JSON blobs aren't queryable like real columns, but the demo doesn't need joins — it needs to not lose your work.",
      },
    ],
  },
  {
    id: "wandermind",
    title: "WanderMind AI",
    tag: "AI/ML · Multi-Agent RAG",
    year: "2025",
    category: "genai",
    oneLiner: "LangGraph + Neo4j + 3 vector DBs. A fine-tuned Mistral 7B routes every query.",
    stack: ["LangGraph", "Neo4j", "ChromaDB", "Mistral 7B", "Docker"],
    code: "https://github.com/yachi2605",
    image:
      "https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzB8MHwxfHNlYXJjaHwxfHxkYXJrJTIwYWJzdHJhY3QlMjBmbHVpZHxlbnwwfHx8fDE3ODQxNjE3Mjh8MA&ixlib=rb-4.1.0&q=85",
    accent: "#5B73FF",
    isNew: false,
  },
  {
    id: "catsense",
    title: "CatSense",
    tag: "AI/ML · Hackathon",
    year: "2026",
    category: "genai",
    oneLiner:
      "Multimodal inspection assistant. Photo + voice in, schema-validated JSON out.",
    stack: ["React", "Gemini 2.5 Flash", "FastAPI", "Zod", "Cloudflare Workers"],
    code: "https://github.com/yachi2605/catsense",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80",
    accent: "#FFCD11",
    isNew: true,
  },
  {
    id: "pulseboard",
    title: "PulseBoard AI",
    tag: "Research · Causal Inference",
    year: "2024",
    category: "research",
    oneLiner:
      "CUPED · Bayesian A/B · DiD · Synthetic Controls · RDD · IV. 2h → <10min.",
    stack: ["PyMC", "Plotly/Dash", "CUPED", "Python"],
    code: "https://github.com/yachi2605",
    image:
      "https://images.unsplash.com/photo-1644088379091-d574269d422f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwzfHxkYXJrJTIwYWJzdHJhY3QlMjBkYXRhfGVufDB8fHx8MTc4NDE2MTcyOXww&ixlib=rb-4.1.0&q=85",
    accent: "#5B73FF",
    isNew: false,
  },
];

export const FILTERS = [
  { id: "all", label: "All" },
  { id: "live", label: "Live Products" },
  { id: "genai", label: "GenAI & Agents" },
  { id: "research", label: "Research" },
];

export const TIMELINE = [
  {
    year: "2022",
    role: "Machine Learning Intern",
    org: "Orion Technolabs · Ahmedabad",
    body:
      "Built a B2B lead-scoring model (AUC-ROC 0.77–0.80) that lifted top-decile conversion 11–15% over the old rules. Shipped it on EC2 behind a Flask API and wired it into the CRM.",
  },
  {
    year: "2023",
    role: "SSIP Hackathon 2022 — Winner",
    org: "Gujarat Technological University",
    body:
      "Kept building through undergrad at GTU. Finished the BE in Information Technology in 2024 with a 3.8 GPA.",
  },
  {
    year: "2024",
    role: "Data Scientist Intern",
    org: "August Infotech · Surat → MS Data Science, Illinois Tech",
    body:
      "Built a churn and expansion model on AWS. XGBoost hit 0.81 AUC against a 0.68 logistic baseline, but the number that mattered came from the 8-week A/B test: +9.4% conversion, −14.7% churn. Then moved to Chicago to start the MS.",
  },
  {
    year: "2025",
    role: "Graduate Teaching Assistant",
    org: "Illinois Tech · CS487 Software Engineering",
    body:
      "Ran office hours and wrote rubrics for 50+ students while keeping a 3.72 GPA.",
  },
  {
    year: "2026",
    role: "Data Science Co-op",
    org: "Labelmaster · Chicago",
    body:
      "Forecasting across 8+ departments. Started with a recursive LSTM, moved to direct multi-output to stop the errors compounding, then ran a 37-fold rolling-origin backtest. XGBoost won everywhere, so that's what shipped. WAPE dropped 31.5%.",
  },
];

export const SKILLS = {
  core: [
    { name: "Agentic AI", note: "LangGraph, routers, validators" },
    { name: "Forecasting", note: "LSTM, Prophet, XGBoost, backtesting" },
    { name: "MLOps", note: "MLflow, feature stores, drift" },
    { name: "RAG Systems", note: "Adaptive routing, faithfulness" },
    { name: "Causal Inference", note: "CUPED, DiD, RDD, IV" },
    { name: "Distributed Systems", note: "Federated, async, staleness" },
  ],
  daily: ["Python", "SQL", "PyTorch", "XGBoost", "FastAPI", "AWS SageMaker"],
  supporting: [
    "Neo4j",
    "Docker",
    "Kubernetes",
    "Airflow",
    "LangChain",
    "LlamaIndex",
    "Pinecone",
    "ChromaDB",
    "Hugging Face",
    "TensorFlow",
    "R",
    "PySpark",
    "Tableau",
    "Power BI",
    "Streamlit",
    "Plotly",
    "Weights & Biases",
  ],
};

export const CREDENTIALS = [
  "AWS ML Foundations · Credly",
  "IBM Data Analysis using Python · Credly",
  "IBM Data Visualization using Python · Credly",
  "Google Cloud Skills · 13 badges · Silver League",
  "McKinsey Forward Program alumna",
  "SSIP Hackathon 2022 — Winner",
  "AICTE National Scholarship · 3×",
  "HackIllinois 2026 · Caterpillar Track",
];
