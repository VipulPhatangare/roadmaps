import { Request, Response } from 'express';
import path from 'path';
import { Domain } from '../models/Domain.model';
import { GenerationJob } from '../models/GenerationJob.model';
import { parseCSV } from '../utils/csvParser';
import { WorkerPool } from '../queues/WorkerPool';

export async function importCSV(req: Request, res: Response): Promise<void> {
  try {
    let filePath = path.join(process.cwd(), '..', 'roadmaps.csv');
    if (req.file) {
      filePath = req.file.path;
    }

    const parsedDomains = await parseCSV(filePath);
    let createdCount = 0;

    for (const d of parsedDomains) {
      const exists = await Domain.findOne({ slug: d.slug });
      if (!exists) {
        await Domain.create({
          name: d.name,
          slug: d.slug,
          status: 'IMPORTED',
        });
        createdCount++;
      }
    }

    res.json({
      success: true,
      message: `CSV Imported successfully. Added ${createdCount} new domains (Total: ${parsedDomains.length}).`,
      totalParsed: parsedDomains.length,
      newCreated: createdCount,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getAllDomains(req: Request, res: Response): Promise<void> {
  try {
    const { status, search, page = 1, limit = 100 } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (search) query.name = { $regex: String(search), $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const domains = await Domain.find(query).sort({ name: 1 }).skip(skip).limit(Number(limit));
    const total = await Domain.countDocuments(query);

    res.json({ success: true, count: domains.length, total, domains });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getDomainById(req: Request, res: Response): Promise<void> {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      res.status(404).json({ success: false, message: 'Domain not found' });
      return;
    }
    res.json({ success: true, domain });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function triggerGeneration(req: Request, res: Response): Promise<void> {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      res.status(404).json({ success: false, message: 'Domain not found' });
      return;
    }

    const job = new GenerationJob({
      domainId: domain._id,
      domainName: domain.name,
      status: 'QUEUED',
      phase: 0,
      progress: 0,
    });
    await job.save();
    await Domain.findByIdAndUpdate(domain._id, { currentJobId: job._id, status: 'ANALYZING' });

    res.json({ success: true, message: `Generation triggered for ${domain.name}`, jobId: job._id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getGenerationStatus(req: Request, res: Response): Promise<void> {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain || !domain.currentJobId) {
      res.status(404).json({ success: false, message: 'Generation status not found' });
      return;
    }

    const job = await GenerationJob.findById(domain.currentJobId);
    res.json({ success: true, domainStatus: domain.status, job });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function generateAllBatch(req: Request, res: Response): Promise<void> {
  try {
    const limit = Number(req.body.limit || req.query.limit || 10);
    const result = await WorkerPool.generateAllDomains(limit);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function publishDomain(req: Request, res: Response): Promise<void> {
  try {
    const domain = await Domain.findByIdAndUpdate(
      req.params.id,
      { status: 'PUBLISHED', publishedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, domain });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
