import { BaseAgent } from './BaseAgent';

export interface ResourceResearchInput {
  domain: string;
  skills: any[];
}

export interface ResourceItem {
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
  verificationRequired: boolean;
}

export interface ResourceResearchOutput {
  resources: ResourceItem[];
}

export class ResourceResearchAgent extends BaseAgent<ResourceResearchInput, ResourceResearchOutput> {
  name = 'ResourceResearchAgent';
  systemPrompt = `You are a learning resource researcher.
Find high-quality, authentic learning resources for the major skills in the domain.
Prioritize: 1. Official Documentation, 2. Free Courses/YouTube, 3. Interactive Practice/GitHub.
Rules:
- Never fabricate fake URLs. Use authentic domain URLs (e.g. developer.mozilla.org, docs.python.org, freecodecamp.org, coursera.org, youtube.com).
- If uncertain of an exact URL, use the root official docs URL and set verificationRequired: true.
Return JSON with key 'resources'.`;

  formatUserPrompt(input: ResourceResearchInput): string {
    const skillsList = input.skills.map((s) => ({ id: s.id, name: s.name }));
    return JSON.stringify({ domain: input.domain, skills: skillsList });
  }

  validateOutput(output: any): ResourceResearchOutput {
    const resList = Array.isArray(output.resources) ? output.resources : [];
    return {
      resources: resList.map((r: any, idx: number) => ({
        id: String(r.id || `res_${idx + 1}`),
        title: String(r.title || 'Learning Resource'),
        url: String(r.url || 'https://developer.mozilla.org'),
        provider: String(r.provider || 'Official'),
        type: r.type || 'OFFICIAL_DOCS',
        skillId: String(r.skillId || 'general'),
        free: Boolean(r.free ?? true),
        official: Boolean(r.official ?? false),
        language: String(r.language || 'English'),
        difficulty: r.difficulty || 'BEGINNER',
        verificationRequired: Boolean(r.verificationRequired ?? false),
      })),
    };
  }
}
