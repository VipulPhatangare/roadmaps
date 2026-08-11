import { domainToSlug } from './slugify';

export interface GeneratedSeedRoadmap {
  slug: string;
  domainName: string;
  category: string;
  overview: {
    difficulty: string;
    estimatedMonths: number;
    hoursPerWeek: number;
    prerequisites: string[];
    outcomes: string[];
  };
  foundation: string[];
  nodes: any[];
  edges: any[];
  specializations: any[];
  paths: any[];
  projects: any[];
  practice: any[];
  checkpoints: any[];
  interview: any;
  jobReadiness: any;
  validation: any;
}

export function generateSeedRoadmapForDomain(domainName: string): GeneratedSeedRoadmap {
  const slug = domainToSlug(domainName);
  const lower = domainName.toLowerCase();

  let category = 'Software Development';
  if (lower.includes('data') || lower.includes('ai') || lower.includes('power bi')) {
    category = 'Data & AI';
  } else if (lower.includes('devops') || lower.includes('devsecops')) {
    category = 'Cloud & Infrastructure';
  } else if (lower.includes('design')) {
    category = 'Design & UX';
  }

  const { foundation, nodes, edges, specializations, paths } = buildExhaustiveDeepNodes(domainName, slug);

  return {
    slug,
    domainName,
    category,
    overview: {
      difficulty: 'BEGINNER_TO_ADVANCED',
      estimatedMonths: 6,
      hoursPerWeek: 12,
      prerequisites: [],
      outcomes: [
        `Complete mastery of all main topics and sub-topics in ${domainName}`,
        `Comprehensive practical coverage with interactive topic checklists`,
        `Full readiness for senior industry roles and technical assessments`,
      ],
    },
    foundation,
    nodes,
    edges,
    specializations,
    paths,
    projects: [],
    practice: [],
    checkpoints: [],
    interview: {},
    jobReadiness: {
      requiredSkills: nodes.slice(0, 5).map((n) => n.id),
      requiredProjectsCompleted: 0,
      portfolioRequired: false,
      githubProfileRequired: false,
    },
    validation: { valid: true, score: 100, errors: [], warnings: [], publishable: true },
  };
}

function buildExhaustiveDeepNodes(domainName: string, slug: string) {
  let nodes: any[] = [];
  let specializations: any[] = [];

  // =========================================================================
  // 1. FRONTEND DEVELOPMENT (Exhaustive Deep Sub-Topic Trees)
  // =========================================================================
  if (slug.includes('frontend')) {
    nodes = [
      {
        id: 'html5-deep',
        type: 'FOUNDATION',
        title: 'HTML5 Complete Specifications & Accessibility (WAI-ARIA)',
        category: 'FOUNDATION',
        level: 'BEGINNER',
        description: 'Exhaustive breakdown of HTML5 syntax, semantic elements, modern form controls, accessibility standards, metadata, and web graphics.',
        topics: [
          'HTML5 Specifications, DOCTYPE Declaration, UTF-8 Encoding & Document Lifecycle',
          'Semantic Document Layout (<header>, <nav>, <main>, <article>, <section>, <aside>, <footer>)',
          'Text Semantics (<mark>, <time>, <code>, <kbd>, <samp>, <var>, <blockquote>, <cite>, <address>)',
          'Advanced Form Controls (input types: email, url, tel, search, number, range, date, time, color, file)',
          'Form Attributes & Constraints (required, pattern, min/max, minlength/maxlength, autofocus, novalidate)',
          'Form Customization: <datalist>, <select>, <optgroup>, <textarea>, <progress>, <meter>, <output>',
          'Web Accessibility Fundamentals & WCAG 2.1 Guidelines (Perceivable, Operable, Understandable, Robust)',
          'WAI-ARIA Landmark Roles (banner, main, navigation, search, contentinfo, complementary)',
          'WAI-ARIA Widget Roles (dialog, tab, tabpanel, menu, menuitem, tooltip, switch, combobox)',
          'WAI-ARIA Attributes (aria-label, aria-labelledby, aria-describedby, aria-hidden, aria-expanded, aria-live)',
          'Keyboard Navigation Management, Focus Trapping & TabIndex Control (-1, 0, >0)',
          'Screen Reader Optimization (NVDA, JAWS, VoiceOver testing & Voice announcements)',
          'Responsive & Modern Media (<picture>, srcset, sizes, <video>, <audio>, <track> captions/subtitles)',
          'Embedded Vector Graphics: Inline <svg>, <path>, <g>, viewBox, and <canvas> 2D Context Basics',
          'SEO & Social Sharing Metadata (<title>, meta description, viewport, Open Graph, Twitter Cards)',
          'Search Engine Microdata: Schema.org, JSON-LD Structured Data & Canonical Link Tags',
          'Custom Data Attributes (data-*), <template>, <slot>, and Web Components Shadow DOM Basics',
        ],
        estimatedHours: 25,
      },
      {
        id: 'css3-deep',
        type: 'FOUNDATION',
        title: 'CSS3 Complete Styling, Box Model, Flexbox & Grid',
        category: 'FOUNDATION',
        level: 'BEGINNER',
        description: 'Comprehensive CSS properties, box model mechanics, 1D Flexbox, 2D Grid layouts, typography, and stacking contexts.',
        topics: [
          'CSS Cascade, Specificity Weight Calculation (Inline > ID > Class > Element) & !important Rules',
          'CSS Selectors: Basic, Combinators (space, >, +, ~), Attribute Selectors ([type="text"])',
          'Pseudo-classes (:hover, :focus, :active, :nth-child, :not, :has, :is, :where, :focus-visible)',
          'Pseudo-elements (::before, ::after, ::first-letter, ::selection, ::placeholder)',
          'Box Model Mechanics: Content, Inner Padding, Outer Margin, Border, & box-sizing: border-box',
          'CSS Flexbox Container Properties (display: flex, flex-direction, flex-wrap, justify-content, align-items, align-content)',
          'CSS Flexbox Item Properties (flex-grow, flex-shrink, flex-basis, order, align-self, flex shorthand)',
          'CSS Grid Container Properties (display: grid, grid-template-columns/rows, grid-template-areas, gap)',
          'CSS Grid Advanced Placement (grid-column / grid-row start-end, auto-fit vs auto-fill, minmax(), fr unit)',
          'CSS Positioning Modes: Static, Relative, Absolute, Fixed, Sticky & Top/Left/Right/Bottom Constraints',
          'Z-Index Stacking Contexts & Isolation (isolation: isolate, opacity, transform stacking triggers)',
          'CSS Custom Properties (CSS Variables), Scope (--main-color), Fallbacks & calc() Math Functions',
          'Typography & Web Fonts: @font-face, font-family, font-weight, line-height, letter-spacing, font-display: swap',
          'CSS Backgrounds & Gradients: background-size (cover/contain), background-position, linear/radial gradients',
        ],
        estimatedHours: 35,
      },
      {
        id: 'responsive-css-deep',
        type: 'FOUNDATION',
        title: 'Responsive Web Design, Media Queries & Animations',
        category: 'FOUNDATION',
        level: 'BEGINNER',
        description: 'Mobile-first design principles, media queries, fluid sizing, CSS transitions, keyframe animations, and modern CSS units.',
        topics: [
          'Mobile-First CSS Strategy vs Desktop-Down Degradation',
          'Media Queries (@media min-width, max-width, orientation, prefers-color-scheme, prefers-reduced-motion)',
          'Fluid Typography & Sizing Functions: rem, em, %, vw, vh, clamp(), min(), max()',
          'CSS Transitions: transition-property, duration, timing-function (cubic-bezier), delay',
          'CSS Keyframe Animations (@keyframes, animation-name, fill-mode, iteration-count, direction)',
          'CSS 2D & 3D Transforms: translate, scale, rotate, skew, transform-origin, perspective',
          'Responsive Images: aspect-ratio property, object-fit (cover/contain), object-position',
          'Modern CSS Features: Container Queries (@container), CSS Layers (@layer), Subgrid',
        ],
        estimatedHours: 20,
      },
      {
        id: 'javascript-fundamentals-deep',
        type: 'CORE',
        title: 'Modern JavaScript (ES6+) Complete Language Engine',
        category: 'CORE',
        level: 'BEGINNER',
        description: 'Exhaustive JavaScript fundamentals, scoping, variables, data types, functions, object-oriented concepts, and ES6+ features.',
        topics: [
          'Variable Declarations & Scoping: var (function scope) vs let / const (block scope), Hoisting & Temporal Dead Zone (TDZ)',
          'Primitive Data Types (String, Number, BigInt, Boolean, Undefined, Null, Symbol) vs Reference Types (Object, Array, Function)',
          'Type Coercion & Comparison: Loose Equality (==) vs Strict Equality (===), Object.is()',
          'Control Flow: if/else, switch case, ternary operator, short-circuit evaluation (&&, ||, ??)',
          'Loops & Iteration: for, while, do...while, for...of (iterables), for...in (object keys)',
          'Functions: Function Declarations, Function Expressions, Arrow Functions, Lexical "this" Binding',
          'Default Parameters, Rest Parameters (...args), Spread Syntax for Arrays & Objects',
          'Array Methods Deep Dive: map, filter, reduce, reduceRight, find, findIndex, flat, flatMap, some, every, sort',
          'Object Manipulation: Object.keys(), Object.values(), Object.entries(), Object.assign(), Object.freeze(), Object.seal()',
          'Destructuring Assignment: Array destructuring, Object destructuring, Nested destructuring, Default values',
          'Optional Chaining (?.) & Nullish Coalescing Operator (??)',
          'Shallow Copying vs Deep Copying: Spread operator, Object.assign(), structuredClone(), JSON.parse(JSON.stringify())',
        ],
        estimatedHours: 40,
      },
      {
        id: 'javascript-async-engine',
        type: 'CORE',
        title: 'Asynchronous JavaScript, Event Loop & Fetch API',
        category: 'CORE',
        level: 'INTERMEDIATE',
        description: 'Deep dive into asynchronous JavaScript, Event Loop internals, Promises, Async/Await, and Web Network APIs.',
        topics: [
          'JavaScript Single-Threaded Concurrency Model & Memory Heap vs Call Stack',
          'Browser Web APIs: setTimeout, setInterval, requestAnimationFrame, Fetch',
          'Event Loop Internals: Call Stack, Macrotask Queue (Task Queue) vs Microtask Queue (Promises / MutationObserver)',
          'Asynchronous Callbacks & Callback Hell Patterns',
          'Promise Architecture: Pending, Fulfilled, Rejected States & Executor Function',
          'Promise Chaining, Error Propagation & .then(), .catch(), .finally() Handlers',
          'Promise Concurrency Methods: Promise.all(), Promise.allSettled(), Promise.race(), Promise.any()',
          'Async / Await Syntax, Refactoring Promises & Handling Rejections with try...catch',
          'Fetch API: Request Headers, Response Object Methods (.json(), .text(), .blob()), HTTP Status Codes',
          'Handling CORS Errors, Credentials (cookies/headers), AbortController for Request Cancellation',
        ],
        estimatedHours: 35,
      },
      {
        id: 'dom-events-browser-apis',
        type: 'CORE',
        title: 'DOM Manipulation, Event Architecture & Browser APIs',
        category: 'CORE',
        level: 'INTERMEDIATE',
        description: 'Complete DOM tree manipulation, event propagation phases, browser storage, and modern web browser APIs.',
        topics: [
          'DOM Tree Architecture: Node vs Element, Document, Window Object Hierarchy',
          'DOM Selection: getElementById, getElementsByClassName, querySelector, querySelectorAll',
          'DOM Modification: createElement, appendChild, insertBefore, removeChild, replaceWith, textContent, innerHTML',
          'Attribute & Class Management: setAttribute, getAttribute, dataset (data-*), classList (add, remove, toggle, contains)',
          'Event Flow & Propagation: Capturing Phase (Event Capture), Target Phase, Bubbling Phase',
          'Event Delegation Pattern, Event Object (e.target, e.currentTarget, e.preventDefault(), e.stopPropagation())',
          'DOM Events: Click, Input, Change, Submit, Keydown/Keyup, Focus/Blur, Mousemove, Touch Events',
          'Browser Client-Side Storage: LocalStorage, SessionStorage, Cookies (HttpOnly, Secure, SameSite), IndexedDB',
          'Intersection Observer API (Lazy Image Loading, Infinite Scroll, Scroll Trigger Animations)',
          'ResizeObserver API, MutationObserver API, Geolocation API, Clipboard API',
        ],
        estimatedHours: 30,
      },
      {
        id: 'git-github-complete',
        type: 'TOOL',
        title: 'Git Version Control & GitHub Enterprise Workflow',
        category: 'TOOL',
        level: 'BEGINNER',
        description: 'Exhaustive Git CLI commands, branching models, rebasing, conflict resolution, and GitHub collaboration tools.',
        topics: [
          'Git Architecture: Working Directory, Staging Area (Index), Local Repository, Remote Repository',
          'Essential Git Commands: git init, clone, status, add, commit, log, diff, show',
          'Branching Strategies: git branch, checkout -b, switch, merge (Fast-Forward vs 3-Way Merge)',
          'Git Rebase vs Git Merge, Interactive Rebase (git rebase -i) for Squashing Commits',
          'Resolving Complex Merge Conflicts & Git Cherry-Pick',
          'Stashing Uncommitted Work: git stash, stash pop, stash apply, stash drop',
          'Undoing Changes: git checkout --, git restore, git reset (--soft, --mixed, --hard), git revert',
          'GitHub Workflow: Forking Repositories, Upstream Sync, Pull Requests (PRs), Code Reviews',
          'Git Hooks (Husky, lint-staged), .gitignore Conventions, SSH Keys & Signed Commits',
        ],
        estimatedHours: 20,
      },
      {
        id: 'typescript-complete',
        type: 'CORE',
        title: 'TypeScript Static Type System & Advanced Types',
        category: 'CORE',
        level: 'INTERMEDIATE',
        description: 'Exhaustive static typing, interfaces, type aliases, generics, utility types, and compiler configuration.',
        topics: [
          'Type Annotations, Primitive Types (string, number, boolean, bigint, symbol, null, undefined)',
          'Special Types: any, unknown, never, void, object, tuple types',
          'Interfaces vs Type Aliases: Declaration Merging, Extending, Implements Pattern',
          'Function Types: Parameter Annotations, Return Types, Optional Parameters, Rest Parameters, Function Overloads',
          'Union Types & Intersection Types (&), Discriminated Unions with Literal Types',
          'Type Guards & Type Narrowing: typeof, instanceof, in operator, Custom User-Defined Type Guards (is)',
          'Generics: Generic Functions, Generic Interfaces, Generic Constraints (extends), Default Generic Types',
          'TypeScript Built-in Utility Types: Partial<T>, Required<T>, Readonly<T>, Record<K,T>, Pick<T,K>, Omit<T,K>, ReturnType<T>',
          'Mapped Types, Conditional Types (T extends U ? X : Y), infer Keyword',
          'TypeScript Compiler Configuration (tsconfig.json): strictMode, target, module, moduleResolution, path aliases',
        ],
        estimatedHours: 35,
      },
      {
        id: 'react18-deep',
        type: 'SPECIALIZATION',
        title: 'React 18 Component Architecture & Hooks Deep Dive',
        category: 'SPECIALIZATION',
        level: 'INTERMEDIATE',
        description: 'JSX, Virtual DOM diffing, component lifecycle, useState, useEffect, useReducer, custom hooks, and React 18 Concurrent features.',
        topics: [
          'JSX Syntax, Transpilation (Babel/SWC), Virtual DOM Reconciliation & Fiber Architecture',
          'Functional Components, Component Composition & Props Pattern',
          'Component State Management: useState Hook, State Batching, Functional State Updates',
          'Complex Local State: useReducer Hook, Dispatch Actions & Reducer Functions',
          'Side Effects Management: useEffect Hook, Dependencies Array Rules, Cleanup Functions',
          'Ref Management: useRef Hook for DOM References & Mutable Values without Re-rendering',
          'Performance Optimization Hooks: useMemo (Memoized Values) & useCallback (Memoized Functions)',
          'React.memo Higher-Order Component & Preventing Unnecessary Child Re-renders',
          'React 18 Concurrent Features: Automatic Batching, useTransition, useDeferredValue',
          'Custom Hooks Engineering: Extracting & Sharing Reusable Stateful Logic',
        ],
        estimatedHours: 50,
      },
      {
        id: 'react-state-routing-deep',
        type: 'SPECIALIZATION',
        title: 'React Global State Management & Client Routing',
        category: 'SPECIALIZATION',
        level: 'INTERMEDIATE',
        description: 'Context API, Zustand, Redux Toolkit, RTK Query, and React Router v7 client navigation.',
        topics: [
          'Prop Drilling Problem & React Context API (createContext, useContext, Provider Pattern)',
          'Context Performance Issues & Context Splitting Strategies',
          'Zustand Lightweight State Store: Actions, Selectors, Middleware (persist, devtools)',
          'Redux Toolkit Architecture: configureStore, createSlice, useSelector, useDispatch',
          'Redux Async Flow: createAsyncThunk, Extra Reducers, Loading / Error State Handling',
          'RTK Query Data Fetching: Endpoint Definitions, Auto-caching, Polling & Invalidating Tags',
          'React Router v7: BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams, useSearchParams',
          'Nested Routes, Layout Outlets (<Outlet />), Dynamic Route Matching & 404 Catch-All',
          'Protected Routes Architecture & Authentication Route Guards',
        ],
        estimatedHours: 40,
      },
      {
        id: 'nextjs14-app-router-deep',
        type: 'SPECIALIZATION',
        title: 'Next.js 14 App Router, Server Components & Full-Stack React',
        category: 'SPECIALIZATION',
        level: 'ADVANCED',
        description: 'Next.js 14 App Router architecture, Server Components, SSR/SSG, Server Actions, and production optimization.',
        topics: [
          'Next.js 14 App Router Directory Conventions (layout.tsx, page.tsx, loading.tsx, error.tsx, not-found.tsx, route.ts)',
          'React Server Components (RSC) Architecture vs Client Components ("use client" Directive)',
          'Rendering Strategies: Server-Side Rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR)',
          'Next.js Data Fetching: Extended fetch API, Automatic Request Deduplication, Revalidation (revalidatePath, revalidateTag)',
          'Next.js Caching Architecture: Request Memoization, Data Cache, Full Route Cache, Router Cache',
          'Server Actions: Form Submissions, Optimistic UI Updates (useOptimistic), Form Status (useFormStatus)',
          'Built-in Optimizations: next/image (loader, responsive sizing), next/font (Google fonts self-hosting), next/script',
          'Next.js Dynamic Routes, Route Groups (folder), Parallel Routes (@folder), Intercepting Routes ((.))',
          'Middleware File (middleware.ts): Request Inspection, Authentication Redirects & Header Modifications',
        ],
        estimatedHours: 45,
      },
      {
        id: 'tailwind-css-deep',
        type: 'TOOL',
        title: 'Tailwind CSS Modern Utility Styling',
        category: 'TOOL',
        level: 'INTERMEDIATE',
        description: 'Utility-first CSS, responsive modifiers, dark mode strategies, custom plugins, and design token integration.',
        topics: [
          'Utility-First CSS Methodology vs Traditional BEM / CSS Modules',
          'Responsive Design Modifiers: sm: (640px), md: (768px), lg: (1024px), xl: (1280px), 2xl: (1536px)',
          'Pseudo-class Variants: hover:, focus:, active:, group-hover:, peer-checked:, focus-within:, disabled:',
          'Dark Mode Implementation: Class Strategy (dark:) vs System Color Scheme',
          'Customizing Tailwind (tailwind.config.ts): Theme Extension, Custom Colors, Fonts, Keyframes, Plugins',
          '@apply Directive Usage, Custom Component Classes & Dynamic Utility Construction (clsx / tailwind-merge)',
        ],
        estimatedHours: 20,
      },
      {
        id: 'frontend-perf-sec-deep',
        type: 'ADVANCED',
        title: 'Frontend Performance Tuning & Web Application Security',
        category: 'ADVANCED',
        level: 'ADVANCED',
        description: 'Core Web Vitals optimization, bundle analysis, code splitting, XSS/CSRF security, and CSP headers.',
        topics: [
          'Core Web Vitals Deep Dive: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift)',
          'Lighthouse Audit Diagnostics, Chrome DevTools Performance Profiler & Memory Leak Debugging',
          'Code Splitting Techniques: Route-based splitting, Component lazy loading (React.lazy + Suspense), Dynamic Imports',
          'Asset Optimization: Image Compression, Modern Formats (WebP, AVIF), Font Subsetting, SVG Minification',
          'JavaScript Bundle Optimization: Tree Shaking, Dead Code Elimination, Webpack / Vite Bundle Analyzers',
          'Cross-Site Scripting (XSS) Vulnerabilities: Stored XSS, Reflected XSS, DOM XSS & DOMPurify Sanitization',
          'Cross-Site Request Forgery (CSRF): CSRF Tokens, SameSite Cookies (Strict, Lax, None)',
          'Content Security Policy (CSP): Directive Definitions (default-src, script-src, style-src, img-src) & Nonce Setup',
          'HTTPS & Transport Security: SSL/TLS Certificates, HSTS Headers, Secure & HttpOnly Cookie Flags',
        ],
        estimatedHours: 35,
      },
    ];

    specializations = [
      {
        id: 'react-developer',
        name: 'React Developer Path',
        recommended: true,
        description: 'Complete path for React 18, TypeScript, Zustand, and Next.js App Router.',
        commonFoundation: ['html5-semantic', 'css3-layouts', 'javascript-fundamentals-deep'],
        specializationNodes: ['javascript-async-engine', 'typescript-complete', 'react18-deep', 'react-state-routing-deep', 'nextjs14-app-router-deep'],
        careerRoles: ['React Developer', 'Frontend Engineer'],
        estimatedMonths: 6,
      },
    ];
  }

  // =========================================================================
  // 2. BACKEND DEVELOPMENT (Exhaustive Deep Topics)
  // =========================================================================
  else if (slug.includes('backend')) {
    nodes = [
      {
        id: 'nodejs-runtime-deep',
        type: 'FOUNDATION',
        title: 'Node.js Runtime Engine & Event Loop Architecture',
        category: 'FOUNDATION',
        level: 'BEGINNER',
        description: 'Exhaustive Node.js internal architecture, V8 engine, Libuv C++ library, thread pool, event loop phases, and modules.',
        topics: [
          'Node.js Architecture: Google V8 Engine, Libuv Library, C++ Bindings & Thread Pool (UV_THREADPOOL_SIZE)',
          'Non-Blocking Asynchronous I/O vs Synchronous Multi-Threaded Execution Models',
          'Event Loop 6 Phases: Timers, Pending Callbacks, Idle/Prepare, Poll, Check (setImmediate), Close Callbacks',
          'Microtask Execution: process.nextTick() Queue vs Promise Microtask Queue',
          'Module Systems: CommonJS (require, module.exports) vs ES Modules (import, export, package.json "type": "module")',
          'Node.js Core Modules: fs (File System), path, http, https, events (EventEmitter), stream, buffer, crypto',
          'Streams & Buffers: Readable, Writable, Duplex, Transform Streams & Backpressure Handling',
          'TypeScript Setup for Node.js: ts-node-dev, tsc compilation, tsconfig.json configuration, @types packages',
        ],
        estimatedHours: 30,
      },
      {
        id: 'express-api-architecture-deep',
        type: 'CORE',
        title: 'Express.js Framework & RESTful API Architecture',
        category: 'CORE',
        level: 'BEGINNER',
        description: 'Complete Express server setup, request processing, middleware chains, error handling, and REST API conventions.',
        topics: [
          'Express Server Instantiation, Application Settings & Environment Config (dotenv)',
          'Routing: Route Parameters (req.params), Query Strings (req.query), Request Body (req.body), Headers (req.headers)',
          'Express Router Modularization & Nested Route Controllers',
          'Middleware Pipeline: Built-in (express.json, express.urlencoded), Third-party (cors, morgan), Custom Middleware',
          'Global Centralized Error Handling Middleware (err, req, res, next) & Custom Error Classes',
          'RESTful API Best Practices: Resource Naming Conventions, Plural Nouns, Correct HTTP Status Codes (200, 201, 204, 400, 401, 403, 404, 500)',
          'Request Body Validation & Sanitization with Zod Schemas or Joi Middleware',
        ],
        estimatedHours: 35,
      },
      {
        id: 'postgresql-sql-deep',
        type: 'CORE',
        title: 'PostgreSQL Relational Database & Advanced SQL',
        category: 'CORE',
        level: 'INTERMEDIATE',
        description: 'Relational database design, 3NF normalization, SQL queries, complex joins, indexing, and ACID transactions.',
        topics: [
          'Relational Database Concepts, Primary Keys, Foreign Keys, Unique & Check Constraints',
          'Database Normalization: First Normal Form (1NF), Second Normal Form (2NF), Third Normal Form (3NF), BCNF',
          'Data Types: INT, VARCHAR, TEXT, BOOLEAN, TIMESTAMP, JSONB, UUID, ENUM',
          'SQL Data Manipulation (DML): SELECT, INSERT, UPDATE, DELETE, UPSERT (ON CONFLICT)',
          'SQL Filtering & Aggregations: WHERE, GROUP BY, HAVING, ORDER BY, LIMIT / OFFSET',
          'SQL Joins Deep Dive: INNER JOIN, LEFT OUTER JOIN, RIGHT JOIN, FULL OUTER JOIN, CROSS JOIN, Self-Joins',
          'Advanced SQL: Subqueries, Common Table Expressions (CTEs - WITH clause), Window Functions (ROW_NUMBER, RANK)',
          'PostgreSQL Indexing: B-Tree Indexes, Hash Indexes, Composite Indexes, Partial Indexes, EXPLAIN ANALYZE Query Profiling',
          'ACID Transactions: Atomicity, Consistency, Isolation (Read Committed, Repeatable Read, Serializable), Durability & BEGIN/COMMIT/ROLLBACK',
        ],
        estimatedHours: 45,
      },
      {
        id: 'orm-prisma-mongoose-deep',
        type: 'TOOL',
        title: 'ORMs & ODMs (Prisma & Mongoose)',
        category: 'TOOL',
        level: 'INTERMEDIATE',
        description: 'Type-safe database interaction with Prisma ORM for SQL and Mongoose ODM for MongoDB.',
        topics: [
          'Prisma Schema Modeling: Models, Fields, Attributes (@id, @unique, @default, @updatedAt, @relation)',
          'Prisma Client Queries: findUnique, findFirst, findMany, create, update, delete, upsert',
          'Prisma Database Migrations: prisma migrate dev, prisma migrate deploy, prisma studio',
          'Mongoose Schemas & Models: Schema Types, Validations, Default Values, Timestamps',
          'Mongoose Query Methods, Population (populating references), Virtuals, Pre/Post Hooks Middleware',
          'Database Connection Management, Connection Pooling & Seeding Test Data',
        ],
        estimatedHours: 25,
      },
      {
        id: 'mongodb-redis-deep',
        type: 'CORE',
        title: 'NoSQL MongoDB & Redis In-Memory Caching',
        category: 'CORE',
        level: 'INTERMEDIATE',
        description: 'Document database modeling with MongoDB, aggregation pipelines, and high-speed caching with Redis.',
        topics: [
          'NoSQL Document Database Paradigms vs Relational Databases',
          'MongoDB Architecture: Databases, Collections, Documents, BSON Data Format',
          'MongoDB CRUD Operations & Indexing Strategies (Single, Compound, TTL Indexes)',
          'MongoDB Aggregation Pipeline: $match, $group, $project, $lookup (joins), $unwind, $sort, $limit',
          'Redis Data Structures: Strings, Hashes, Lists, Sets, Sorted Sets (ZSET)',
          'Caching Strategies: Cache-Aside Pattern, Write-Through, Write-Behind, Time-To-Live (TTL) Expiration',
          'Redis Use Cases: API Caching, Rate Limiting, Session Management, Pub/Sub Messaging',
        ],
        estimatedHours: 35,
      },
      {
        id: 'backend-auth-security-deep',
        type: 'ADVANCED',
        title: 'Authentication, OAuth 2.0 & API Security',
        category: 'ADVANCED',
        level: 'ADVANCED',
        description: 'Password security, JWT authentication, OAuth 2.0, RBAC authorization, and API hardening.',
        topics: [
          'Password Storage Security: Hashing Algorithms (Bcrypt, Argon2), Salting, Work Factors',
          'JSON Web Tokens (JWT): Header, Payload, Signature, Access Token vs Refresh Token Rotation',
          'OAuth 2.0 Authorization Protocol: Authorization Code Grant, Access Tokens, Social Login (Google / GitHub)',
          'Role-Based Access Control (RBAC) & Attribute-Based Access Control (ABAC) Middleware',
          'API Security Hardening: CORS Rules, Helmet Security Headers, Express Rate Limiting (express-rate-limit)',
          'Vulnerability Mitigation: SQL Injection Prevention (Parameterized Queries), NoSQL Injection, XSS, CSRF Protection',
        ],
        estimatedHours: 40,
      },
      {
        id: 'docker-microservices-deep',
        type: 'ADVANCED',
        title: 'Docker Containerization & Microservices Architecture',
        category: 'ADVANCED',
        level: 'ADVANCED',
        description: 'Docker containerization, Docker Compose, event-driven messaging, and microservices architecture.',
        topics: [
          'Docker Core Concepts: Images, Containers, Registries (Docker Hub), Daemon Architecture',
          'Writing Production Dockerfiles: Base Images, Layer Caching, Multi-Stage Builds, Non-Root Users',
          'Docker Compose: Service Definitions, Port Mapping, Volume Mounting, Environment Variables, Networks',
          'Message Brokers & Event-Driven Architecture: RabbitMQ / Apache Kafka (Producers, Consumers, Queues, Topics)',
          'gRPC & Protocol Buffers: Service Contracts, Binary Serialization, High-Performance RPC vs REST',
        ],
        estimatedHours: 45,
      },
    ];

    specializations = [
      {
        id: 'nodejs-backend',
        name: 'Node.js Backend Specialist Path',
        recommended: true,
        description: 'Complete backend mastery using Node.js, Express, PostgreSQL, Redis, and Docker.',
        commonFoundation: ['nodejs-runtime-deep', 'express-api-architecture-deep'],
        specializationNodes: ['postgresql-sql-deep', 'mongodb-redis-deep', 'backend-auth-security-deep', 'docker-microservices-deep'],
        careerRoles: ['Backend Engineer', 'API Developer'],
        estimatedMonths: 6,
      },
    ];
  }

  // =========================================================================
  // 3. AI ENGINEER (Exhaustive Deep Topics)
  // =========================================================================
  else if (slug.includes('ai') || slug.includes('data-scientist')) {
    nodes = [
      {
        id: 'python-ai-deep',
        type: 'FOUNDATION',
        title: 'Python Programming Engine for Artificial Intelligence',
        category: 'FOUNDATION',
        level: 'BEGINNER',
        description: 'Core Python, data structures, object-oriented programming, and package environments for AI.',
        topics: [
          'Python Language Fundamentals: Syntax, Control Flow, Data Types (Lists, Tuples, Dicts, Sets)',
          'Functions, Lambda Functions, List Comprehensions, Generator Functions & Iterators',
          'Object-Oriented Programming: Classes, Methods, Inheritance, Polymorphism, Encapsulation',
          'Python Package Management (pip, conda, poetry) & Virtual Environments (venv, conda env)',
          'File I/O Processing (CSV, JSON, Parquet) & Exception Handling (try...except...finally)',
          'Python Standard Libraries for Math & System: math, os, sys, datetime, collections, itertools',
        ],
        estimatedHours: 30,
      },
      {
        id: 'math-stats-ai-deep',
        type: 'FOUNDATION',
        title: 'Mathematics & Statistics for Machine Learning',
        category: 'FOUNDATION',
        level: 'BEGINNER',
        description: 'Linear algebra, matrix operations, multivariate calculus, probability distributions, and hypothesis testing.',
        topics: [
          'Linear Algebra: Vectors, Matrices, Matrix Multiplication, Determinants, Inverse Matrices',
          'Vector Spaces, Basis, Eigenvalues, Eigenvectors & Singular Value Decomposition (SVD)',
          'Calculus: Derivatives, Partial Derivatives, Directional Gradients & Gradient Descent Optimization',
          'Probability Theory: Bayes Theorem, Conditional Probability, Independence, Random Variables',
          'Probability Distributions: Gaussian (Normal), Binomial, Poisson, Uniform, Exponential',
          'Inferential Statistics: Central Limit Theorem, Hypothesis Testing (t-test, z-test, p-value, Chi-Square)',
        ],
        estimatedHours: 40,
      },
      {
        id: 'numpy-pandas-eda-deep',
        type: 'CORE',
        title: 'Data Processing with NumPy, Pandas & Exploratory Data Analysis',
        category: 'CORE',
        level: 'INTERMEDIATE',
        description: 'Vectorized computations, data wrangling with Pandas, missing value imputation, and exploratory data analysis.',
        topics: [
          'NumPy N-Dimensional Arrays (ndarray), Array Creation, Indexing, Slicing & Reshaping',
          'Vectorized Computations, Array Broadcasting Rules & Mathematical Functions',
          'Pandas DataFrames & Series: Creation, Indexing (loc, iloc), Filtering & Selecting',
          'Pandas Data Wrangling: Merging, Joining, Concatenating, GroupBy & Pivot Tables',
          'Data Cleaning: Handling Missing Data (Imputation), Outlier Detection & Categorical Encoding (One-Hot, Label)',
          'Feature Scaling: Standard Scaling (Z-Score), Min-Max Normalization, Robust Scaling',
          'Exploratory Data Analysis (EDA): Correlation Analysis, Heatmaps, Distribution Plots (Matplotlib / Seaborn)',
        ],
        estimatedHours: 35,
      },
      {
        id: 'supervised-ml-deep',
        type: 'CORE',
        title: 'Supervised Machine Learning Algorithms (Scikit-Learn)',
        category: 'CORE',
        level: 'INTERMEDIATE',
        description: 'Linear regression, logistic regression, decision trees, random forests, SVM, and evaluation metrics.',
        topics: [
          'Linear Regression, Multiple Linear Regression & Regularization (L1 Lasso / L2 Ridge / ElasticNet)',
          'Logistic Regression for Binary & Multi-Class Classification (Softmax)',
          'Decision Trees, Entropy, Gini Impurity, Pruning & Tree Overfitting',
          'Ensemble Learning: Bagging (Random Forests) & Boosting (AdaBoost, Gradient Boosting, XGBoost, LightGBM)',
          'Support Vector Machines (SVM): Hyperplanes, Margins, Kernel Trick (RBF, Polynomial)',
          'Evaluation Metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC Curve, Confusion Matrix',
          'Model Validation Strategies: Train-Test Split, K-Fold Cross-Validation, Stratified K-Fold, Grid Search CV',
        ],
        estimatedHours: 45,
      },
      {
        id: 'deep-learning-pytorch-deep',
        type: 'SPECIALIZATION',
        title: 'Deep Learning & PyTorch Framework Architecture',
        category: 'SPECIALIZATION',
        level: 'ADVANCED',
        description: 'Neural networks, activation functions, backpropagation, and deep learning with PyTorch.',
        topics: [
          'Artificial Neural Networks (ANN), Perceptrons & Multi-Layer Perceptron (MLP) Architectures',
          'Activation Functions: ReLU, Leaky ReLU, Sigmoid, Tanh, GELU, Softmax',
          'Forward Propagation, Loss Functions (MSE, Cross-Entropy) & Backpropagation Algorithm',
          'PyTorch Tensors, Autograd Automatic Differentiation Engine & Computational Graphs',
          'PyTorch nn.Module Building Blocks: Linear layers, Conv2D, Dropout, BatchNorm',
          'Optimization Algorithms: Stochastic Gradient Descent (SGD), Momentum, Adam, AdamW',
          'Training Loops: Epochs, Batches, DataLoader, Training / Validation Loss Tracking, Early Stopping',
        ],
        estimatedHours: 50,
      },
      {
        id: 'nlp-llm-transformers-deep',
        type: 'SPECIALIZATION',
        title: 'NLP, Transformers & LLM Engineering Architecture',
        category: 'SPECIALIZATION',
        level: 'ADVANCED',
        description: 'Text tokenization, Self-Attention mechanism, Transformer architectures (BERT, GPT), and LLM fine-tuning.',
        topics: [
          'NLP Text Preprocessing: Tokenization, Stemming, Lemmatization, Stopwords, N-grams',
          'Word Representation: Word2Vec, GloVe, FastText & Contextual Embeddings',
          'Self-Attention Mechanism, Scaled Dot-Product Attention & Multi-Head Attention',
          'Transformer Architecture: Encoder-Decoder Blocks, Positional Encoding, Feed-Forward Networks',
          'HuggingFace Transformers Library & Model Fine-Tuning (BERT, RoBERTa, Llama 3, Mistral)',
          'Parameter-Efficient Fine-Tuning (PEFT): LoRA (Low-Rank Adaptation), QLoRA, Quantization (4-bit / 8-bit)',
          'Retrieval-Augmented Generation (RAG): Document Loading, Chunking, Vector Embeddings & Vector DBs (Pinecone / FAISS / Qdrant)',
          'LangChain & LlamaIndex Frameworks for LLM Application Development',
        ],
        estimatedHours: 60,
      },
      {
        id: 'mlops-deployment-deep',
        type: 'ADVANCED',
        title: 'MLOps & Production AI Model Deployment',
        category: 'ADVANCED',
        level: 'ADVANCED',
        description: 'Deploying AI models via REST APIs (FastAPI), Docker containerization, model monitoring, and MLflow.',
        topics: [
          'Model Serialization: Joblib, ONNX, PyTorch TorchScript, TensorRT',
          'FastAPI High-Performance Async REST API Model Serving & Pydantic Validation',
          'Docker Containerization for AI Model Serving Microservices',
          'MLflow Experiment Tracking, Model Registry & Artifact Management',
          'Model Performance Monitoring: Data Drift, Concept Drift, Performance Metrics Alerts',
        ],
        estimatedHours: 35,
      },
    ];

    specializations = [
      {
        id: 'ai-engineer-track',
        name: 'AI & LLM Engineer Path',
        recommended: true,
        description: 'Specialization in Machine Learning, Deep Learning PyTorch, and LLM RAG engineering.',
        commonFoundation: ['python-ai-deep', 'math-stats-ai-deep'],
        specializationNodes: ['numpy-pandas-eda-deep', 'supervised-ml-deep', 'deep-learning-pytorch-deep', 'nlp-llm-transformers-deep', 'mlops-deployment-deep'],
        careerRoles: ['AI Engineer', 'Machine Learning Engineer'],
        estimatedMonths: 6,
      },
    ];
  }

  // =========================================================================
  // 4. GENERAL FALLBACK FOR OTHER DOMAINS (Data Analyst, Power BI, DevOps, etc.)
  // =========================================================================
  else {
    nodes = [
      {
        id: `${slug}-fundamentals-deep`,
        type: 'FOUNDATION',
        title: `${domainName} Foundational Core`,
        category: 'FOUNDATION',
        level: 'BEGINNER',
        description: `Core foundational concepts, standard principles, and basic tools in ${domainName}.`,
        topics: [
          `Introduction to Foundational Theory & Core Principles of ${domainName}`,
          `Standard Industry Terminology, Notations & Conventions`,
          `Initial Workspace, Software Setup & Environment Configuration`,
          `Basic Operational Workflows & Execution Standards`,
          `Quality Control, Safety Guidelines & Industry Specifications`,
        ],
        estimatedHours: 25,
      },
      {
        id: `${slug}-intermediate-deep`,
        type: 'CORE',
        title: `${domainName} Operational Execution & Analysis`,
        category: 'CORE',
        level: 'INTERMEDIATE',
        description: `Primary practical techniques and operational skills used by professionals in ${domainName}.`,
        topics: [
          `Primary Task Execution & Analytical Workflow`,
          `Data Input, Processing, Transformation & Verification`,
          `Core Diagnostic Methods & Performance Testing`,
          `Process Optimization & Efficiency Enhancements`,
          `Standard Operating Procedures (SOP) Compliance`,
        ],
        estimatedHours: 45,
      },
      {
        id: `${slug}-tools-deep`,
        type: 'TOOL',
        title: `${domainName} Industry Platforms & Tools`,
        category: 'TOOL',
        level: 'INTERMEDIATE',
        description: `Standard software packages, utilities, and platforms used in ${domainName}.`,
        topics: [
          `Primary Platform Interface Navigation & Environment Setup`,
          `Automation Scripts & Workflow Streamlining`,
          `Data Exporting, Visualization & Custom Reporting`,
          `Collaborative File Management & Integration Pipelines`,
          `System Troubleshooting & Maintenance Protocols`,
        ],
        estimatedHours: 30,
      },
      {
        id: `${slug}-advanced-deep`,
        type: 'ADVANCED',
        title: `Advanced ${domainName} Architecture & Systems`,
        category: 'ADVANCED',
        level: 'ADVANCED',
        description: `Advanced system design, complex problem solving, and leadership execution in ${domainName}.`,
        topics: [
          `High-Level System Modeling & Complex Simulation`,
          `Strategic Risk Mitigation & Compliance Auditing`,
          `Enterprise-Scale Process Engineering & Optimization`,
          `Performance Metrics Measurement & Executive Reporting`,
          `Continuous Quality Improvement & Innovation Architecture`,
        ],
        estimatedHours: 50,
      },
    ];

    specializations = [
      {
        id: `${slug}-specialist-path`,
        name: `${domainName} Professional Path`,
        recommended: true,
        description: `Primary professional career path for ${domainName}.`,
        commonFoundation: [`${slug}-fundamentals-deep`],
        specializationNodes: [`${slug}-intermediate-deep`, `${slug}-tools-deep`, `${slug}-advanced-deep`],
        careerRoles: [`${domainName} Specialist`],
        estimatedMonths: 6,
      },
    ];
  }

  // Edges connecting nodes logically
  const edges = nodes.map((n, idx) => {
    if (idx === 0) return null;
    return {
      id: `e_${nodes[idx - 1].id}_to_${n.id}`,
      source: nodes[idx - 1].id,
      target: n.id,
      relationship: 'PREREQUISITE',
      strength: 'STRONG',
    };
  }).filter(Boolean);

  const paths = [
    {
      id: specializations[0]?.id || 'default-path',
      name: specializations[0]?.name || 'Primary Path',
      ordered_nodes: nodes.map((n) => n.id),
      common_nodes: [nodes[0].id],
      specialization_nodes: nodes.map((n) => n.id),
      total_hours: nodes.reduce((acc, n) => acc + (n.estimatedHours || 20), 0),
      total_months: 6,
    },
  ];

  return {
    foundation: [nodes[0].id],
    nodes,
    edges,
    specializations,
    paths,
  };
}
