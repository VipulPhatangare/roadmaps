import { Domain } from '../models/Domain.model';
import { Roadmap } from '../models/Roadmap.model';
import { log } from '../utils/logger';
import { DomainExplorerOutput } from './01.DomainAnalyzerAgent';
import { TopicDeepDiveOutput } from './02.TopicDeepDiveAgent';

export class PublishPersistAgent {
  async execute(domainId: string, domainContext: DomainExplorerOutput, topicResults: TopicDeepDiveOutput[]): Promise<any> {
    log('INFO', 'PublishPersistAgent', `[Agent 3] Formatting & persisting roadmap for '${domainContext.domain}' into MongoDB...`);

    const domainDoc = await Domain.findById(domainId);
    if (!domainDoc) throw new Error(`Domain not found for ID: ${domainId}`);

    // Build Roadmap Nodes
    const nodes = topicResults.map((topic, index) => {
      const nodeId = `node_${index + 1}`;
      return {
        id: nodeId,
        type: topic.category,
        title: topic.topicTitle,
        category: topic.category,
        level: topic.level,
        description: topic.description,
        whyLearn: topic.whyLearn,
        topics: topic.subTopics,
        estimatedHours: topic.estimatedHours,
        importance: 10,
        prerequisites: index > 0 ? [`node_${index}`] : [],
        resources: [],
        projects: [],
        checkpoint: null,
        optional: false,
      };
    });

    // Build Linear Prerequisite Edges
    const edges = nodes.map((n, idx) => {
      if (idx === 0) return null;
      return {
        id: `edge_${idx}`,
        source: nodes[idx - 1].id,
        target: n.id,
        relationship: 'PREREQUISITE',
        strength: 'STRONG',
      };
    }).filter(Boolean);

    // Primary Path
    const path = {
      id: 'primary-path',
      name: `${domainContext.domain} Mastery Path`,
      ordered_nodes: nodes.map((n) => n.id),
      common_nodes: [nodes[0].id],
      specialization_nodes: nodes.map((n) => n.id),
      total_hours: nodes.reduce((sum, n) => sum + n.estimatedHours, 0),
      total_months: domainContext.estimatedMonths,
    };

    // Remove existing roadmap for this domain if present
    await Roadmap.deleteMany({ domainId: domainDoc._id });

    // Save Roadmap Document
    const roadmapDoc = await Roadmap.create({
      domainId: domainDoc._id,
      slug: domainDoc.slug,
      version: 1,
      status: 'PUBLISHED',
      overview: {
        difficulty: 'BEGINNER_TO_ADVANCED',
        estimatedMonths: domainContext.estimatedMonths,
        hoursPerWeek: 12,
        prerequisites: [],
        outcomes: [
          `Master all ${nodes.length} core skill modules in ${domainContext.domain}`,
          `Complete deep interactive topic checklists`,
          `Achieve full job readiness for senior roles`,
        ],
      },
      foundation: [nodes[0]?.id || 'node_1'],
      nodes,
      edges,
      specializations: [],
      paths: [path],
      resources: [],
      projects: [],
      practice: [],
      checkpoints: [],
      interview: {},
      jobReadiness: {
        requiredSkills: nodes.slice(0, 5).map((n) => n.id),
        requiredProjectsCompleted: 0,
        portfolioRequired: false,
      },
      validation: { valid: true, score: 100, publishable: true },
    });

    // Update Domain status to PUBLISHED
    domainDoc.status = 'PUBLISHED';
    domainDoc.version = 1;
    domainDoc.nodeCount = nodes.length;
    domainDoc.edgeCount = edges.length;
    domainDoc.publishedAt = new Date();
    await domainDoc.save();

    log('INFO', 'PublishPersistAgent', `✅ Roadmap successfully PUBLISHED for '${domainDoc.name}' (${nodes.length} nodes, ${edges.length} edges)!`);
    return roadmapDoc;
  }
}
