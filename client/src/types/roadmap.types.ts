export type NodeType =
  | 'FOUNDATION'
  | 'SKILL'
  | 'TOOL'
  | 'SPECIALIZATION'
  | 'PROJECT'
  | 'CHECKPOINT'
  | 'CAREER'
  | 'INTERVIEW';

export type NodeLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface RoadmapNode {
  id: string;
  type: NodeType;
  title: string;
  category: string;
  level: NodeLevel;
  description: string;
  whyLearn: string;
  topics: string[];
  estimatedHours: number;
  importance: number;
  prerequisites: string[];
  resources: string[];
  projects: string[];
  checkpoint?: string | null;
  optional: boolean;
  specializationId?: string | null;
}

export interface RoadmapEdge {
  id: string;
  source: string;
  target: string;
  relationship: 'PREREQUISITE' | 'RECOMMENDED' | 'OPTIONAL' | 'ALTERNATIVE' | 'SPECIALIZATION' | 'ADVANCED' | 'RELATED';
  strength: 'STRONG' | 'MEDIUM' | 'WEAK';
  reason: string;
}

export interface Specialization {
  id: string;
  name: string;
  recommended: boolean;
  description: string;
  commonFoundation: string[];
  specializationNodes: string[];
  careerRoles: string[];
  estimatedMonths: number;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  provider: string;
  type: 'OFFICIAL_DOCS' | 'VIDEO' | 'COURSE' | 'BOOK' | 'ARTICLE' | 'GITHUB' | 'PRACTICE' | 'CERTIFICATION' | 'TUTORIAL';
  skillId: string;
  free: boolean;
  official: boolean;
  language: string;
  difficulty: string;
  qualityScore: number;
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'CAPSTONE';
  skills: string[];
  estimatedHours: number;
  learningOutcomes: string[];
  requirements: string[];
  realWorld: boolean;
}

export interface Roadmap {
  _id: string;
  domainId: string;
  slug: string;
  version: number;
  status: 'DRAFT' | 'VALIDATED' | 'PUBLISHED';
  overview: {
    difficulty: string;
    estimatedMonths: number;
    hoursPerWeek: number;
    prerequisites: string[];
    outcomes: string[];
  };
  foundation: string[];
  nodes: RoadmapNode[];
  edges: RoadmapEdge[];
  specializations: Specialization[];
  paths: any[];
  resources: Resource[];
  projects: Project[];
  practice: any[];
  checkpoints: any[];
  interview: any;
  jobReadiness: any;
  validation: any;
  updatedAt: string;
}

export interface Domain {
  _id: string;
  name: string;
  slug: string;
  category: string;
  status: 'IMPORTED' | 'ANALYZING' | 'GENERATING' | 'VALIDATING' | 'NEEDS_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'FAILED';
  version: number;
  validationScore: number;
  nodeCount: number;
  edgeCount: number;
  projectCount: number;
  lastGeneratedAt?: string;
  publishedAt?: string;
  failureReason?: string;
}
