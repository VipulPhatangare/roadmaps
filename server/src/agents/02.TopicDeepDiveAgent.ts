import { generateContentWithRetry } from '../config/aiClient';
import { log } from '../utils/logger';
import { MainTopicItem } from './01.DomainAnalyzerAgent';

export interface TopicDeepDiveOutput {
  topicTitle: string;
  category: 'FOUNDATION' | 'CORE' | 'SPECIALIZATION' | 'TOOL' | 'ADVANCED';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  whyLearn: string;
  estimatedHours: number;
  subTopics: string[];
}

export class TopicDeepDiveAgent {
  async execute(domainName: string, topicItem: MainTopicItem): Promise<TopicDeepDiveOutput> {
    log('INFO', 'TopicDeepDiveAgent', `[Parallel Agent 2] Deep diving into topic: '${topicItem.title}' (${topicItem.category})`);

    const prompt = `You are a Principal Tech Educator & Expert Engineer.
Your task is to provide an EXHAUSTIVE, UNCOMPROMISED sub-topic breakdown for ONE SPECIFIC TOPIC within the "${domainName}" domain.

Target Topic: "${topicItem.title}"
Assigned Category: "${topicItem.category}"
Assigned Level: "${topicItem.level}"

Generate between 15 to 30+ highly specific, granular sub-topics to cover for "${topicItem.title}".
Do NOT summarize, do NOT use generic placeholders. Cover every syntax rule, API method, architectural pattern, specification, edge case, and industry best practice.

Return ONLY a raw JSON object with NO markdown formatting, NO code blocks, matching this exact structure:
{
  "topicTitle": "${topicItem.title}",
  "category": "${topicItem.category}",
  "level": "${topicItem.level}",
  "description": "Comprehensive explanation of what this topic covers.",
  "whyLearn": "Why mastering this specific topic is crucial for ${domainName}.",
  "estimatedHours": 25,
  "subTopics": [
    "Sub-topic 1: Specific concept / API / syntax rule",
    "Sub-topic 2: Specific concept / API / syntax rule",
    "Sub-topic 3: Specific concept / API / syntax rule"
  ]
}`;

    try {
      const text = await generateContentWithRetry(prompt);
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        topicTitle: parsed.topicTitle || topicItem.title,
        category: topicItem.category,
        level: topicItem.level,
        description: parsed.description || `Deep dive into ${topicItem.title}`,
        whyLearn: parsed.whyLearn || `Crucial skill for ${domainName}`,
        estimatedHours: parsed.estimatedHours || 20,
        subTopics: parsed.subTopics || [],
      };
    } catch (err: any) {
      log('ERROR', 'TopicDeepDiveAgent', `Failed to deep dive topic '${topicItem.title}': ${err.message}`);
      return {
        topicTitle: topicItem.title,
        category: topicItem.category,
        level: topicItem.level,
        description: `Comprehensive module covering ${topicItem.title}`,
        whyLearn: `Essential competency in ${domainName}`,
        estimatedHours: 20,
        subTopics: [
          `${topicItem.title} Fundamentals & Core Syntax`,
          `${topicItem.title} Advanced Patterns & Execution`,
          `${topicItem.title} Best Practices & Real-World Use`,
        ],
      };
    }
  }
}
