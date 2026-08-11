export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function domainToSlug(domainName: string): string {
  const overrides: Record<string, string> = {
    'frontend': 'frontend-development',
    'backend': 'backend-development',
    'full stack': 'full-stack-development',
    'ai engineer': 'ai-engineer',
    'data analyst': 'data-analyst',
    'devops': 'devops-engineering',
    'devsecops': 'devsecops-engineering',
    'android': 'android-development',
    'ios': 'ios-development',
    'ml': 'machine-learning',
  };
  const lower = domainName.toLowerCase().trim();
  return overrides[lower] || slugify(domainName);
}
