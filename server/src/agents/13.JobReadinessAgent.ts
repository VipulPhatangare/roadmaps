import { BaseAgent } from './BaseAgent';

export interface JobReadinessInput {
  domain: string;
  careerRoles: any[];
  projects: any[];
}

export interface JobReadinessOutput {
  jobReadiness: {
    requiredSkills: string[];
    requiredProjectsCompleted: number;
    portfolioRequired: boolean;
    githubProfileRequired: boolean;
    resumeRequirements: string[];
    interviewRequirements: string[];
    recommendedExperience: string[];
    certificationsOptional: string[];
    estimatedJobReadyMonths: number;
  };
}

export class JobReadinessAgent extends BaseAgent<JobReadinessInput, JobReadinessOutput> {
  name = 'JobReadinessAgent';
  systemPrompt = `You are an industry employment readiness evaluator.
Formulate clear criteria a learner must fulfill to become hiring-ready in this domain.
Return JSON with key 'jobReadiness'.`;

  formatUserPrompt(input: JobReadinessInput): string {
    return JSON.stringify({
      domain: input.domain,
      career_roles: input.careerRoles.map((r) => r.name),
      projects_count: input.projects.length,
    });
  }

  validateOutput(output: any): JobReadinessOutput {
    const raw = output.jobReadiness || output.job_readiness || {};
    return {
      jobReadiness: {
        requiredSkills: Array.isArray(raw.requiredSkills || raw.required_skills)
          ? raw.requiredSkills || raw.required_skills
          : [],
        requiredProjectsCompleted: Number(raw.requiredProjectsCompleted || raw.required_projects || 3),
        portfolioRequired: Boolean(raw.portfolioRequired ?? raw.portfolio_required ?? true),
        githubProfileRequired: Boolean(raw.githubProfileRequired ?? raw.github_required ?? false),
        resumeRequirements: Array.isArray(raw.resumeRequirements || raw.resume_requirements)
          ? raw.resumeRequirements || raw.resume_requirements
          : [],
        interviewRequirements: Array.isArray(raw.interviewRequirements || raw.interview_requirements)
          ? raw.interviewRequirements || raw.interview_requirements
          : [],
        recommendedExperience: Array.isArray(raw.recommendedExperience || raw.recommended_experience)
          ? raw.recommendedExperience || raw.recommended_experience
          : [],
        certificationsOptional: Array.isArray(raw.certificationsOptional || raw.certifications_optional)
          ? raw.certificationsOptional || raw.certifications_optional
          : [],
        estimatedJobReadyMonths: Number(raw.estimatedJobReadyMonths || raw.estimated_months || 6),
      },
    };
  }
}
