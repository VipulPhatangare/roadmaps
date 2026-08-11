import { Domain } from '../models/Domain.model';
import { GenerationJob } from '../models/GenerationJob.model';
import { RoadmapOrchestrator } from '../services/RoadmapOrchestrator';
import { env } from '../config/env';
import { log } from '../utils/logger';

export class WorkerPool {
  private static activeCount = 0;
  private static isPaused = false;
  private static maxConcurrency = env.workerConcurrency || 5;

  static async generateAllDomains(limit: number = 10): Promise<{ message: string; enqueuedCount: number }> {
    let query = Domain.find({ status: { $in: ['IMPORTED', 'FAILED', 'NEEDS_REVIEW'] } }).sort({ createdAt: 1 });
    if (limit > 0) {
      query = query.limit(limit);
    }
    const domains = await query;
    log('INFO', 'WorkerPool', `Enqueueing ${domains.length} domains for batch processing (Limit: ${limit || 'ALL'})...`);

    let enqueued = 0;
    for (const domain of domains) {
      const job = new GenerationJob({
        domainId: domain._id,
        domainName: domain.name,
        status: 'QUEUED',
        phase: 0,
        progress: 0,
      });
      await job.save();
      await Domain.findByIdAndUpdate(domain._id, { currentJobId: job._id, status: 'ANALYZING' });
      enqueued++;
    }

    // Start background processing loop asynchronously
    this.processQueue();

    return {
      message: `Enqueued ${enqueued} domains for parallel processing (Concurrency: ${this.maxConcurrency})`,
      enqueuedCount: enqueued,
    };
  }

  static pauseQueue(): void {
    this.isPaused = true;
    log('INFO', 'WorkerPool', 'Worker pool paused');
  }

  static resumeQueue(): void {
    this.isPaused = false;
    log('INFO', 'WorkerPool', 'Worker pool resumed');
    this.processQueue();
  }

  private static async processQueue(): Promise<void> {
    if (this.isPaused) return;

    while (this.activeCount < this.maxConcurrency) {
      const job = await GenerationJob.findOne({ status: 'QUEUED' }).sort({ createdAt: 1 });
      if (!job) break;

      this.activeCount++;
      job.status = 'RUNNING';
      await job.save();

      // Fire async job without awaiting here so loop can spawn up to maxConcurrency jobs
      this.runJob(job).finally(() => {
        this.activeCount--;
        this.processQueue();
      });
    }
  }

  private static async runJob(job: any): Promise<void> {
    try {
      const orchestrator = new RoadmapOrchestrator();
      await orchestrator.runPipeline(job.domainId.toString(), job._id.toString());
    } catch (err: any) {
      log('ERROR', 'WorkerPool', `Job ${job._id} failed for domain ${job.domainName}: ${err.message}`);
    }
  }
}
