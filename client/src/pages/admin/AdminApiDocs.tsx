import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Key, Copy, Check, Terminal, Code2, Globe, Send, Server, Eye, EyeOff, FileText, LayoutDashboard, Database, Cpu, Download, RefreshCw, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import axios from 'axios';
import { userApi } from '../../api/user.api';

const SAMPLE_BASIC_OUTPUT = {
  success: true,
  count: 2,
  roadmaps: [
    {
      id: "67a78b9f10293847561a0001",
      slug: "full-stack-web-developer",
      name: "Full Stack Web Developer",
      category: "Software Development",
      status: "PUBLISHED",
      version: 1,
      overview: {
        difficulty: "BEGINNER_TO_ADVANCED",
        estimatedMonths: 6,
        hoursPerWeek: 10,
        prerequisites: ["HTML & CSS Fundamentals", "Basic Programming Logic"],
        outcomes: ["Build scalable full-stack web applications", "Deploy production Node.js & React services"]
      },
      nodeCount: 24,
      edgeCount: 30,
      specializationCount: 3,
      createdAt: "2026-02-10T10:00:00.000Z",
      updatedAt: "2026-02-10T10:00:00.000Z"
    },
    {
      id: "67a78b9f10293847561a0002",
      slug: "ai-machine-learning-engineer",
      name: "AI & Machine Learning Engineer",
      category: "Artificial Intelligence",
      status: "PUBLISHED",
      version: 1,
      overview: {
        difficulty: "INTERMEDIATE_TO_ADVANCED",
        estimatedMonths: 8,
        hoursPerWeek: 12,
        prerequisites: ["Python", "Linear Algebra", "Calculus"],
        outcomes: ["Train deep neural networks", "Deploy ML models in production"]
      },
      nodeCount: 32,
      edgeCount: 41,
      specializationCount: 4,
      createdAt: "2026-02-10T11:30:00.000Z",
      updatedAt: "2026-02-10T11:30:00.000Z"
    }
  ]
};

const SAMPLE_DETAIL_OUTPUT = {
  success: true,
  roadmap: {
    _id: "67a78b9f10293847561a0001",
    slug: "full-stack-web-developer",
    domainId: {
      _id: "67a78a1e10293847561a0099",
      name: "Full Stack Web Developer",
      category: "Software Development",
      slug: "full-stack-web-developer",
      status: "PUBLISHED"
    },
    status: "PUBLISHED",
    version: 1,
    overview: {
      difficulty: "BEGINNER_TO_ADVANCED",
      estimatedMonths: 6,
      hoursPerWeek: 10,
      prerequisites: ["Basic Computer Literacy", "HTML & CSS"],
      outcomes: [
        "Master Frontend with React & Next.js",
        "Master Backend with Node.js, Express & MongoDB",
        "Implement Secure Auth & CI/CD Pipelines"
      ]
    },
    foundation: [
      "Internet Fundamentals (HTTP, DNS, Browsers)",
      "HTML5 Semantic Layouts",
      "CSS3 Flexbox & Grid Systems",
      "JavaScript ES6+ Syntax & Async Programming"
    ],
    nodes: [
      {
        id: "node-html-css",
        type: "FOUNDATION",
        title: "HTML5 & Modern CSS3",
        category: "FOUNDATION",
        level: "BEGINNER",
        description: "Learn how web pages are structured with semantic HTML5 tags and styled using responsive CSS3 layout modules.",
        whyLearn: "Fundamental markup language of the web without which no website can render UI.",
        topics: ["Semantic Elements", "Flexbox & Grid", "CSS Variables", "Responsive Media Queries"],
        estimatedHours: 15,
        importance: 10,
        prerequisites: [],
        resources: ["res-html-mdn", "res-css-tricks"],
        projects: ["proj-personal-portfolio"],
        checkpoint: "Build a responsive static landing page from scratch",
        optional: false,
        specializationId: null
      },
      {
        id: "node-react",
        type: "CORE",
        title: "React.js Framework",
        category: "CORE",
        level: "INTERMEDIATE",
        description: "Declarative, component-driven UI development using JSX, React Hooks, Context API, and state management.",
        whyLearn: "De-facto industry standard component library for modern interactive web applications.",
        topics: ["JSX", "useState & useEffect", "Component Lifecycle", "Custom Hooks", "State Management"],
        estimatedHours: 35,
        importance: 9,
        prerequisites: ["node-html-css", "node-javascript"],
        resources: ["res-react-official-docs"],
        projects: ["proj-interactive-dashboard"],
        checkpoint: "Create a multi-tab dashboard with asynchronous API fetching and state persistence",
        optional: false,
        specializationId: null
      }
    ],
    edges: [
      {
        id: "edge-1",
        source: "node-html-css",
        target: "node-react",
        relationship: "PREREQUISITE",
        strength: "STRONG",
        reason: "Must understand DOM structures and JavaScript before building React components."
      }
    ],
    specializations: [
      {
        id: "spec-frontend-lead",
        name: "Advanced Frontend Architect",
        recommended: true,
        description: "Deep dive into Web Performance, Micro-frontends, WebGL, and Next.js App Router.",
        commonFoundation: ["node-html-css", "node-react"],
        specializationNodes: ["node-nextjs", "node-web-perf"],
        careerRoles: ["Senior Frontend Engineer", "UI Architect"],
        estimatedMonths: 3
      }
    ],
    projects: [
      {
        id: "proj-personal-portfolio",
        title: "Developer Portfolio Website",
        description: "Build and deploy a mobile-responsive portfolio showcasing your projects and resume.",
        difficulty: "BEGINNER",
        estimatedHours: 8
      }
    ],
    checkpoints: [
      {
        id: "cp-1",
        title: "HTML/CSS Foundation Checkpoint",
        task: "Build a 3-page fully responsive website conforming to WCAG accessibility standards."
      }
    ],
    interview: {
      commonQuestions: [
        {
          question: "What is the event loop in JavaScript?",
          answer: "The event loop monitors the Call Stack and Callback Queue to execute async code callbacks when stack is empty."
        }
      ]
    },
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-02-10T10:00:00.000Z"
  }
};

export const AdminApiDocs: React.FC = () => {
  const apiBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://roadmaps.engimind.cloud';
  const apiHost = typeof window !== 'undefined' ? window.location.host : 'roadmaps.engimind.cloud';
  const apiProtocol = typeof window !== 'undefined' ? window.location.protocol.replace(':', '') : 'https';
  const [hostname, portNumber] = apiHost.split(':');

  const [apiKey, setApiKey] = useState('default_secret_api_key_2026');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSampleBasic, setCopiedSampleBasic] = useState(false);
  const [copiedSampleDetail, setCopiedSampleDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'detail'>('basic');
  const [notification, setNotification] = useState<string>('');

  // Test Runner state for Endpoint 1 (Basic Info)
  const [basicLoading, setBasicLoading] = useState(false);
  const [basicResult, setBasicResult] = useState<any>(null);

  // Test Runner state for Endpoint 2 (Full Data)
  const [roadmapIdInput, setRoadmapIdInput] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailResult, setDetailResult] = useState<any>(null);

  // Fetch permanent API Key from MongoDB on component mount
  useEffect(() => {
    userApi.getApiKey()
      .then((res) => {
        if (res.data?.apiKey) {
          setApiKey(res.data.apiKey);
        }
      })
      .catch(() => {
        // Fallback if not logged in or error
      });
  }, []);

  const copyToClipboard = (text: string, label: string = 'Key') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setNotification(`Copied ${label} to clipboard!`);
    setTimeout(() => {
      setCopiedKey(false);
      setNotification('');
    }, 2500);
  };

  const copySampleBasicJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_BASIC_OUTPUT, null, 2));
    setCopiedSampleBasic(true);
    setNotification('Copied Basic List Sample JSON Output!');
    setTimeout(() => {
      setCopiedSampleBasic(false);
      setNotification('');
    }, 2500);
  };

  const copySampleDetailJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(SAMPLE_DETAIL_OUTPUT, null, 2));
    setCopiedSampleDetail(true);
    setNotification('Copied Full Roadmap Sample JSON Output!');
    setTimeout(() => {
      setCopiedSampleDetail(false);
      setNotification('');
    }, 2500);
  };

  const handleGenerateNewKey = async () => {
    try {
      setNotification('Saving new permanent API Key to database...');
      const res = await userApi.generateApiKey();
      if (res.data?.apiKey) {
        setApiKey(res.data.apiKey);
        setNotification('✅ Successfully generated and saved permanent API Key to database!');
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (err: any) {
      setNotification(err.response?.data?.message || 'Failed to generate key in database.');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleDownloadPostmanCollection = () => {
    const postmanCollection = {
      info: {
        name: "RoadmapAI External API Collection",
        description: "Official REST API endpoints for accessing RoadmapAI basic list and full detailed dataset.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      item: [
        {
          name: "1. Get Basic Roadmaps (IDs & Names)",
          request: {
            method: "GET",
            header: [{ key: "x-api-key", value: apiKey, type: "text" }],
            url: {
              raw: `${apiBaseUrl}/api/v1/external/roadmaps`,
              protocol: apiProtocol,
              host: [hostname],
              port: portNumber || (apiProtocol === 'https' ? '443' : '80'),
              path: ["api", "v1", "external", "roadmaps"]
            }
          }
        },
        {
          name: "2. Get Full Roadmap Data by ID or Slug",
          request: {
            method: "GET",
            header: [{ key: "x-api-key", value: apiKey, type: "text" }],
            url: {
              raw: `${apiBaseUrl}/api/v1/external/roadmaps/:id`,
              protocol: apiProtocol,
              host: [hostname],
              port: portNumber || (apiProtocol === 'https' ? '443' : '80'),
              path: ["api", "v1", "external", "roadmaps", ":id"]
            }
          }
        }
      ]
    };

    const blob = new Blob([JSON.stringify(postmanCollection, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RoadmapAI_API_Postman_Collection.json';
    a.click();
    URL.revokeObjectURL(url);
    setNotification('Downloaded Postman Collection JSON file!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleRunBasicTest = async () => {
    setBasicLoading(true);
    setBasicResult(null);
    try {
      const res = await axios.get(`${apiBaseUrl}/api/v1/external/roadmaps`, {
        headers: { 'x-api-key': apiKey },
      });
      setBasicResult(res.data);
    } catch (err: any) {
      setBasicResult(err.response?.data || { success: false, message: err.message });
    } finally {
      setBasicLoading(false);
    }
  };

  const handleRunDetailTest = async () => {
    if (!roadmapIdInput.trim()) return;
    setDetailLoading(true);
    setDetailResult(null);
    try {
      const res = await axios.get(`${apiBaseUrl}/api/v1/external/roadmaps/${encodeURIComponent(roadmapIdInput.trim())}`, {
        headers: { 'x-api-key': apiKey },
      });
      setDetailResult(res.data);
    } catch (err: any) {
      setDetailResult(err.response?.data || { success: false, message: err.message });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Admin Navigation Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/30">
              Admin Control Panel
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> REST API v1.0 Enabled
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Server className="h-8 w-8 text-indigo-400" />
            Developer API & Endpoint Control Center
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage API Key credentials, test live endpoints, view sample output JSON & export integration specs.
          </p>
        </div>

        {/* Sub Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white"
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <Link
            to="/admin/domains"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white"
          >
            <Database className="h-3.5 w-3.5" /> Domains
          </Link>
          <Link
            to="/admin/generation"
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white"
          >
            <Cpu className="h-3.5 w-3.5" /> Agent Pipeline
          </Link>
          <button
            onClick={handleDownloadPostmanCollection}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 shadow-md transition"
          >
            <Download className="h-3.5 w-3.5" /> Export Postman Collection
          </button>
        </div>
      </div>

      {notification && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 flex items-center justify-between shadow-lg">
          <span>{notification}</span>
          <button onClick={() => setNotification('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Stats Cards Section for API Infrastructure */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Total API Routes</span>
            <Globe className="h-5 w-5 text-indigo-400" />
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-white">2 Routes</p>
          <span className="text-[10px] text-slate-500">Basic Info & Full ID Detail</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Authentication</span>
            <Key className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-amber-300">API Key Required</p>
          <span className="text-[10px] text-slate-500">Header / Bearer / Query</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Server Rate Limit</span>
            <Zap className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-emerald-300">60 RPM</p>
          <span className="text-[10px] text-slate-500">Configured in .env</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400">Data Format</span>
            <Code2 className="h-5 w-5 text-purple-400" />
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-purple-300">JSON API</p>
          <span className="text-[10px] text-slate-500">Standard REST output</span>
        </div>
      </div>

      {/* API Key Credentials Management Banner */}
      <div className="mt-8 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400">
              <Key className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Active Roadmap API Secret Key</h2>
              <p className="text-xs text-slate-400">Use this secret key to authenticate all incoming request headers or query strings</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">
              <span className="font-mono text-sm text-indigo-300">
                {showKey ? apiKey : '••••••••••••••••••••••••••••••••'}
              </span>
              <button
                onClick={() => setShowKey(!showKey)}
                className="ml-3 text-slate-400 hover:text-white transition"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              onClick={() => copyToClipboard(apiKey, 'API Secret Key')}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-md transition"
            >
              {copiedKey ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
              {copiedKey ? 'Copied!' : 'Copy Key'}
            </button>

            <button
              onClick={handleGenerateNewKey}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition"
              title="Generate new permanent key and save to database"
            >
              <RefreshCw className="h-3.5 w-3.5 text-amber-400" /> Generate Permanent Key
            </button>
          </div>
        </div>

        {/* Authentication Methods Options */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-800/80 pt-4 text-xs">
          <div
            onClick={() => copyToClipboard(`x-api-key: ${apiKey}`, 'Header Method')}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-indigo-500/50 transition"
          >
            <div className="flex items-center justify-between text-indigo-400 font-semibold mb-1">
              <span>Method 1: Header</span>
              <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <code className="text-amber-300 font-mono text-[11px]">x-api-key: {apiKey}</code>
          </div>

          <div
            onClick={() => copyToClipboard(`Authorization: Bearer ${apiKey}`, 'Bearer Token Method')}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-indigo-500/50 transition"
          >
            <div className="flex items-center justify-between text-indigo-400 font-semibold mb-1">
              <span>Method 2: Bearer Token</span>
              <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <code className="text-amber-300 font-mono text-[11px]">Authorization: Bearer {apiKey}</code>
          </div>

          <div
            onClick={() => copyToClipboard(`${apiBaseUrl}/api/v1/external/roadmaps?apiKey=${apiKey}`, 'Query URL')}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-indigo-500/50 transition"
          >
            <div className="flex items-center justify-between text-indigo-400 font-semibold mb-1">
              <span>Method 3: Query Parameter</span>
              <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <code className="text-amber-300 font-mono text-[11px]">?apiKey={apiKey}</code>
          </div>
        </div>
      </div>

      {/* Tabs Selection */}
      <div className="mt-10 flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'basic'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="h-4 w-4" /> Endpoint 1: Basic Info List (`GET /api/v1/external/roadmaps`)
        </button>
        <button
          onClick={() => setActiveTab('detail')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'detail'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="h-4 w-4" /> Endpoint 2: Full Data by ID (`GET /api/v1/external/roadmaps/:id`)
        </button>
      </div>

      {/* Tab 1 Content: Basic Info Endpoint */}
      {activeTab === 'basic' && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  GET
                </span>
                <code className="text-base font-bold text-white">/api/v1/external/roadmaps</code>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunBasicTest}
                  disabled={basicLoading}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {basicLoading ? 'Fetching...' : 'Test Endpoint Live'}
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Retrieves lightweight summary metadata (IDs, names/slugs, status, version, overview parameters, node counts) for all roadmaps. Ideal for populating selection dropdowns, cards, or directories without transferring heavy node details.
            </p>

            {/* Code Snippets */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  <span>cURL Command</span>
                  <button
                    onClick={() => copyToClipboard(`curl -X GET "${apiBaseUrl}/api/v1/external/roadmaps" -H "x-api-key: ${apiKey}"`, 'cURL Command')}
                    className="flex items-center gap-1 text-indigo-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" /> Copy cURL
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <code className="font-mono text-xs text-amber-300">
                    curl -X GET "{apiBaseUrl}/api/v1/external/roadmaps" -H "x-api-key: {apiKey}"
                  </code>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  <span>JavaScript (Fetch)</span>
                  <button
                    onClick={() => copyToClipboard(`const response = await fetch("${apiBaseUrl}/api/v1/external/roadmaps", {\n  headers: { "x-api-key": "${apiKey}" }\n});\nconst data = await response.json();`, 'JavaScript Code')}
                    className="flex items-center gap-1 text-indigo-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" /> Copy JS Code
                  </button>
                </div>
                <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-indigo-300 overflow-x-auto">
{`const response = await fetch("${apiBaseUrl}/api/v1/external/roadmaps", {
  headers: {
    "x-api-key": "${apiKey}"
  }
});
const data = await response.json();
console.log(data.roadmaps);`}
                </pre>
              </div>
            </div>

            {/* Live Test Output Display */}
            {basicResult && (
              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5" /> Live Response Output (HTTP {basicResult.success ? '200 OK' : 'Error'})
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(basicResult, null, 2), 'Live Response')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" /> Copy Output JSON
                  </button>
                </div>
                <pre className="font-mono text-xs text-slate-200 max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {JSON.stringify(basicResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Official Standard Sample Response Output Block */}
            <div className="mt-8 rounded-2xl border border-indigo-500/30 bg-slate-950 p-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    Standard Sample JSON Response Output (Basic Info Endpoint)
                  </h3>
                  <p className="text-[11px] text-slate-400">Complete JSON response structure for Endpoint 1</p>
                </div>

                <button
                  onClick={copySampleBasicJSON}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition"
                >
                  {copiedSampleBasic ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedSampleBasic ? 'Copied Sample JSON!' : 'Copy Sample Output JSON'}
                </button>
              </div>

              <pre className="font-mono text-xs text-slate-200 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-800/80 bg-slate-900/90 p-4">
                {JSON.stringify(SAMPLE_BASIC_OUTPUT, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 Content: Full Roadmap Data by ID Endpoint */}
      {activeTab === 'detail' && (
        <div className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  GET
                </span>
                <code className="text-base font-bold text-white">/api/v1/external/roadmaps/:id</code>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter ID or slug (e.g. full-stack-web-developer)"
                  value={roadmapIdInput}
                  onChange={(e) => setRoadmapIdInput(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none w-72"
                />
                <button
                  onClick={handleRunDetailTest}
                  disabled={detailLoading || !roadmapIdInput.trim()}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {detailLoading ? 'Fetching...' : 'Test Live'}
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Fetches the complete roadmap document structure including all node steps, prerequisite edges, specialization pathways, resources, projects, checkpoints, and interview questions for a specific roadmap ID or slug.
            </p>

            {/* Code Snippets */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  <span>cURL Command</span>
                  <button
                    onClick={() => copyToClipboard(`curl -X GET "${apiBaseUrl}/api/v1/external/roadmaps/${roadmapIdInput || ':id'}" -H "x-api-key: ${apiKey}"`, 'cURL Command')}
                    className="flex items-center gap-1 text-indigo-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" /> Copy cURL
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <code className="font-mono text-xs text-amber-300">
                    curl -X GET "{apiBaseUrl}/api/v1/external/roadmaps/{roadmapIdInput || ':id'}" -H "x-api-key: {apiKey}"
                  </code>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Python (requests)</span>
                  <button
                    onClick={() => copyToClipboard(`import requests\nurl = "${apiBaseUrl}/api/v1/external/roadmaps/${roadmapIdInput || 'ID'}"\nheaders = {"x-api-key": "${apiKey}"}\nres = requests.get(url, headers=headers)`, 'Python Code')}
                    className="flex items-center gap-1 text-indigo-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" /> Copy Python Code
                  </button>
                </div>
                <pre className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-indigo-300 overflow-x-auto">
{`import requests

url = "${apiBaseUrl}/api/v1/external/roadmaps/${roadmapIdInput || 'YOUR_ROADMAP_ID'}"
headers = {"x-api-key": "${apiKey}"}

response = requests.get(url, headers=headers)
roadmap_data = response.json()`}
                </pre>
              </div>
            </div>

            {/* Live Test Output Display */}
            {detailResult && (
              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5" /> Live Response Output (HTTP {detailResult.success ? '200 OK' : 'Error'})
                  </span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(detailResult, null, 2), 'Live Response')}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" /> Copy Output JSON
                  </button>
                </div>
                <pre className="font-mono text-xs text-slate-200 max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {JSON.stringify(detailResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Official Standard Sample Response Output Block */}
            <div className="mt-8 rounded-2xl border border-indigo-500/30 bg-slate-950 p-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    Standard Sample JSON Response Output (Full Roadmap Detail Endpoint)
                  </h3>
                  <p className="text-[11px] text-slate-400">Complete detailed JSON response structure for Endpoint 2</p>
                </div>

                <button
                  onClick={copySampleDetailJSON}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition"
                >
                  {copiedSampleDetail ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedSampleDetail ? 'Copied Sample JSON!' : 'Copy Sample Output JSON'}
                </button>
              </div>

              <pre className="font-mono text-xs text-slate-200 max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-800/80 bg-slate-900/90 p-4">
                {JSON.stringify(SAMPLE_DETAIL_OUTPUT, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
