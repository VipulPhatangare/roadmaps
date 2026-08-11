import { BaseAgent } from './BaseAgent';

export interface InterviewPreparationInput {
  domain: string;
  domainType: string;
  careerRoles: any[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'CONCEPTUAL' | 'PRACTICAL' | 'SCENARIO' | 'CODING' | 'CASE_STUDY';
  answerHint: string;
}

export interface InterviewSection {
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  questions: InterviewQuestion[];
}

export interface InterviewPreparationOutput {
  interview: {
    domain: string;
    sections: InterviewSection[];
    commonMistakes: string[];
    machineCodingTasks: string[];
    portfolioAdvice: string;
  };
}

export class InterviewPreparationAgent extends BaseAgent<InterviewPreparationInput, InterviewPreparationOutput> {
  name = 'InterviewPreparationAgent';
  systemPrompt = `You are a technical interview & career assessment designer.
Generate domain-specific interview prep content covering beginner, intermediate, and advanced questions, practical scenario tasks, common mistakes, and portfolio advice.
Return JSON with key 'interview'.`;

  formatUserPrompt(input: InterviewPreparationInput): string {
    return JSON.stringify({
      domain: input.domain,
      domain_type: input.domainType,
      career_roles: input.careerRoles.map((r) => r.name),
    });
  }

  validateOutput(output: any): InterviewPreparationOutput {
    const raw = output.interview || {};
    return {
      interview: {
        domain: String(raw.domain || inputDomainDefault(output)),
        sections: Array.isArray(raw.sections)
          ? raw.sections.map((s: any) => ({
              level: s.level || 'BEGINNER',
              questions: Array.isArray(s.questions)
                ? s.questions.map((q: any, idx: number) => ({
                    id: String(q.id || `iq_${idx + 1}`),
                    question: String(q.question || ''),
                    type: q.type || 'CONCEPTUAL',
                    answerHint: String(q.answerHint || q.answer_hint || ''),
                  }))
                : [],
            }))
          : [],
        commonMistakes: Array.isArray(raw.commonMistakes || raw.common_mistakes)
          ? raw.commonMistakes || raw.common_mistakes
          : [],
        machineCodingTasks: Array.isArray(raw.machineCodingTasks || raw.machine_coding_tasks)
          ? raw.machineCodingTasks || raw.machine_coding_tasks
          : [],
        portfolioAdvice: String(raw.portfolioAdvice || raw.portfolio_advice || ''),
      },
    };
  }
}

function inputDomainDefault(out: any): string {
  return String(out?.domain || 'General');
}
