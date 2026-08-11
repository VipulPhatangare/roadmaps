import { ProviderFactory } from '../ai/ProviderFactory';
import { AgentExecution } from '../models/AgentExecution.model';
import { GenerationJob } from '../models/GenerationJob.model';
import { hashObject } from '../utils/hashUtils';
import { log } from '../utils/logger';
import mongoose from 'mongoose';

export abstract class BaseAgent<TInput, TOutput> {
  abstract name: string;
  abstract systemPrompt: string;

  abstract formatUserPrompt(input: TInput): string;
  abstract validateOutput(output: any): TOutput;

  async execute(input: TInput, domainName: string, jobId: mongoose.Types.ObjectId): Promise<TOutput> {
    const provider = ProviderFactory.getProvider();
    const userPrompt = this.formatUserPrompt(input);
    const inputHash = hashObject(input);

    let attempt = 1;
    const maxAttempts = 3;
    let lastError: Error | null = null;

    const execDoc = new AgentExecution({
      jobId,
      agentName: this.name,
      domainName,
      status: 'RUNNING',
      attempt: 1,
      inputHash,
      startedAt: new Date(),
    });
    await execDoc.save();

    await GenerationJob.findByIdAndUpdate(jobId, {
      currentAgent: this.name,
      $push: { logs: { timestamp: new Date(), agent: this.name, message: `Starting ${this.name}...`, level: 'INFO' } },
    });

    while (attempt <= maxAttempts) {
      const startTime = Date.now();
      try {
        log('INFO', this.name, `Attempt ${attempt}/${maxAttempts} for ${domainName}...`);

        const rawResult = await provider.generateStructured<any>({
          model: 'fast',
          systemPrompt: this.systemPrompt,
          userPrompt,
        });

        const validatedResult = this.validateOutput(rawResult);
        const durationMs = Date.now() - startTime;
        const outputHash = hashObject(validatedResult);

        execDoc.status = 'SUCCESS';
        execDoc.attempt = attempt;
        execDoc.outputHash = outputHash;
        execDoc.durationMs = durationMs;
        execDoc.completedAt = new Date();
        await execDoc.save();

        await GenerationJob.findByIdAndUpdate(jobId, {
          $push: {
            logs: {
              timestamp: new Date(),
              agent: this.name,
              message: `Completed ${this.name} in ${durationMs}ms`,
              level: 'INFO',
            },
          },
        });

        return validatedResult;
      } catch (err: any) {
        lastError = err;
        log('WARN', this.name, `Attempt ${attempt} failed: ${err.message}`);

        if (attempt < maxAttempts) {
          execDoc.status = 'RETRYING';
          await execDoc.save();
          await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
        }
        attempt++;
      }
    }

    execDoc.status = 'FAILED';
    execDoc.error = lastError?.message || 'Failed after max retries';
    execDoc.completedAt = new Date();
    await execDoc.save();

    await GenerationJob.findByIdAndUpdate(jobId, {
      $push: {
        pipelineErrors: { agent: this.name, message: execDoc.error, attempt: maxAttempts, timestamp: new Date() },
        logs: { timestamp: new Date(), agent: this.name, message: `Failed: ${execDoc.error}`, level: 'ERROR' },
      },
    });

    throw new Error(`Agent ${this.name} failed: ${execDoc.error}`);
  }
}
