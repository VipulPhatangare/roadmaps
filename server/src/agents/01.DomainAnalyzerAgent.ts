import { generateContentWithRetry } from '../config/aiClient';
import { log } from '../utils/logger';

export interface MainTopicItem {
  title: string;
  category: 'FOUNDATION' | 'CORE' | 'SPECIALIZATION' | 'TOOL' | 'ADVANCED';
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
}

export interface DomainExplorerOutput {
  domain: string;
  category: string;
  estimatedMonths: number;
  mainTopics: MainTopicItem[];
}

export class DomainExplorerAgent {
  async execute(domainName: string): Promise<DomainExplorerOutput> {
    log('INFO', 'DomainExplorerAgent', `[Agent 1] Discovering topics and assigning categories for '${domainName}'...`);

    const prompt = `You are a Senior Industry Curriculum Architect.
Analyze the domain "${domainName}" and list all essential main topics/technologies required from beginner to senior professional level.

For EVERY main topic, assign its explicit category:
- FOUNDATION (Essential background theory & building blocks)
- CORE (Primary technical skills & syntax)
- SPECIALIZATION (Frameworks, libraries & specialized tracks)
- TOOL (Utilities, version control, platforms & CLI tools)
- ADVANCED (Performance, security, architecture & high-scale systems)

Return ONLY a raw JSON object with NO markdown formatting, NO code blocks, matching this exact structure:
{
  "domain": "${domainName}",
  "category": "Software Development",
  "estimatedMonths": 6,
  "mainTopics": [
    { "title": "HTML5 & Semantic Markup", "category": "FOUNDATION", "level": "BEGINNER" },
    { "title": "CSS3 Layouts, Flexbox & Grid", "category": "FOUNDATION", "level": "BEGINNER" },
    { "title": "JavaScript ES6+ Syntax", "category": "CORE", "level": "BEGINNER" },
    { "title": "Asynchronous JS & Fetch API", "category": "CORE", "level": "INTERMEDIATE" },
    { "title": "DOM Manipulation & Browser APIs", "category": "CORE", "level": "INTERMEDIATE" },
    { "title": "Git & GitHub Version Control", "category": "TOOL", "level": "BEGINNER" },
    { "title": "TypeScript Static Typing", "category": "CORE", "level": "INTERMEDIATE" },
    { "title": "React 18 Component Architecture", "category": "SPECIALIZATION", "level": "INTERMEDIATE" },
    { "title": "React State Management & Routing", "category": "SPECIALIZATION", "level": "INTERMEDIATE" },
    { "title": "Next.js 14 App Router", "category": "SPECIALIZATION", "level": "ADVANCED" },
    { "title": "Tailwind CSS Utility Styling", "category": "TOOL", "level": "INTERMEDIATE" },
    { "title": "Frontend Performance & Security", "category": "ADVANCED", "level": "ADVANCED" }
  ]
}

Provide between 8 to 15 comprehensive main topics tailored to ${domainName}.`;

    try {
      const text = await generateContentWithRetry(prompt);
      const cleanJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const mainTopics: MainTopicItem[] = (parsed.mainTopics || []).map((item: any) => ({
        title: typeof item === 'string' ? item : item.title,
        category: typeof item === 'object' && item.category ? item.category : 'CORE',
        level: typeof item === 'object' && item.level ? item.level : 'BEGINNER',
      }));

      return {
        domain: parsed.domain || domainName,
        category: parsed.category || 'Software Development',
        estimatedMonths: parsed.estimatedMonths || 6,
        mainTopics,
      };
    } catch (err: any) {
      log('ERROR', 'DomainExplorerAgent', `Failed to explore domain '${domainName}': ${err.message}`);
      throw err;
    }
  }
}
