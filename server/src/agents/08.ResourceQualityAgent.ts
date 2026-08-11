import { BaseAgent } from './BaseAgent';
import { ResourceItem } from './07.ResourceResearchAgent';

export interface ResourceQualityInput {
  resources: ResourceItem[];
}

export interface EvaluatedResource extends ResourceItem {
  qualityScore: number;
  verified: boolean;
}

export interface ResourceQualityOutput {
  resources: EvaluatedResource[];
}

export class ResourceQualityAgent extends BaseAgent<ResourceQualityInput, ResourceQualityOutput> {
  name = 'ResourceQualityAgent';
  systemPrompt = `You are a resource quality auditor.
Evaluate the discovered resources for authority, relevance, free availability, and teaching quality.
Assign a qualityScore from 1.0 to 10.0.
Remove any invalid, suspicious, or dead links.
Return JSON with key 'resources'.`;

  formatUserPrompt(input: ResourceQualityInput): string {
    return JSON.stringify({ resources: input.resources });
  }

  validateOutput(output: any): ResourceQualityOutput {
    const resList = Array.isArray(output.resources) ? output.resources : [];
    return {
      resources: resList.map((r: any, idx: number) => ({
        id: String(r.id || `res_${idx + 1}`),
        title: String(r.title || 'Resource'),
        url: String(r.url || ''),
        provider: String(r.provider || 'Official'),
        type: r.type || 'OFFICIAL_DOCS',
        skillId: String(r.skillId || 'general'),
        free: Boolean(r.free ?? true),
        official: Boolean(r.official ?? false),
        language: String(r.language || 'English'),
        difficulty: r.difficulty || 'BEGINNER',
        verificationRequired: Boolean(r.verificationRequired ?? false),
        qualityScore: Number(r.qualityScore || 8.5),
        verified: Boolean(r.verified ?? true),
      })),
    };
  }
}
