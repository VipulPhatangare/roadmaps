import { Domain } from '../models/Domain.model';
import { GenerationJob } from '../models/GenerationJob.model';
import { DomainExplorerAgent } from '../agents/01.DomainAnalyzerAgent';
import { TopicDeepDiveAgent, TopicDeepDiveOutput } from '../agents/02.TopicDeepDiveAgent';
import { PublishPersistAgent } from '../agents/03.PublishPersistAgent';
import { log } from '../utils/logger';

export class RoadmapOrchestrator {
  private domainExplorerAgent: DomainExplorerAgent;
  private topicDeepDiveAgent: TopicDeepDiveAgent;
  private publishPersistAgent: PublishPersistAgent;

  constructor() {
    this.domainExplorerAgent = new DomainExplorerAgent();
    this.topicDeepDiveAgent = new TopicDeepDiveAgent();
    this.publishPersistAgent = new PublishPersistAgent();
  }

  async runPipeline(domainId: string, jobId: string): Promise<void> {
    const domainDoc = await Domain.findById(domainId);
    if (!domainDoc) throw new Error(`Domain not found: ${domainId}`);

    const job = await GenerationJob.findById(jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);

    log('INFO', 'RoadmapOrchestrator', `🚀 Starting 3-Agent Parallel (5-Batch) Pipeline for '${domainDoc.name}'...`);

    try {
      // Step 1: Agent 1 - Domain Explorer (Discovers main topics & assigns categories upfront)
      job.status = 'RUNNING';
      job.currentAgent = 'DomainExplorerAgent';
      job.progress = 20;
      await job.save();

      const domainContext = await this.domainExplorerAgent.execute(domainDoc.name);
      log('INFO', 'RoadmapOrchestrator', `Agent 1 found ${domainContext.mainTopics.length} main topics with categories for '${domainDoc.name}'`);

      // Step 2: Agent 2 - Topic Deep Dive in 5 consecutive parallel batches (Promise.all)
      job.currentAgent = 'TopicDeepDiveAgent (5 Parallel)';
      job.progress = 60;
      await job.save();

      const topicResults: TopicDeepDiveOutput[] = [];
      const batchSize = 5; // 5 consecutive parallel topics

      for (let i = 0; i < domainContext.mainTopics.length; i += batchSize) {
        const batch = domainContext.mainTopics.slice(i, i + batchSize);
        log('INFO', 'RoadmapOrchestrator', `Launching 5 parallel Agent 2 instances (Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(domainContext.mainTopics.length / batchSize)}) for '${domainDoc.name}'...`);
        
        const batchPromises = batch.map((topicItem) =>
          this.topicDeepDiveAgent.execute(domainDoc.name, topicItem)
        );

        const batchOutputs = await Promise.all(batchPromises);
        topicResults.push(...batchOutputs);

        // Small delay between 5-batch calls
        if (i + batchSize < domainContext.mainTopics.length) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }

      log('INFO', 'RoadmapOrchestrator', `All ${topicResults.length} parallel Agent 2 topic deep dives completed!`);

      // Step 3: Agent 3 - Save & Publish Agent (Formats, Validates & Saves to MongoDB)
      job.currentAgent = 'PublishPersistAgent';
      job.progress = 90;
      await job.save();

      await this.publishPersistAgent.execute(domainId, domainContext, topicResults);

      // Complete Job
      job.status = 'COMPLETED';
      job.progress = 100;
      job.completedAt = new Date();
      await job.save();

      log('INFO', 'RoadmapOrchestrator', `🎉 3-Agent AI Pipeline COMPLETED for '${domainDoc.name}'!`);
    } catch (err: any) {
      log('ERROR', 'RoadmapOrchestrator', `Pipeline failed for '${domainDoc.name}': ${err.message}`);
      job.status = 'FAILED';
      await job.save();

      domainDoc.status = 'FAILED';
      domainDoc.failureReason = err.message;
      await domainDoc.save();

      throw err;
    }
  }
}
