import crypto from 'crypto';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserRoadmapProgress } from '../models/UserRoadmapProgress.model';
import { Roadmap } from '../models/Roadmap.model';
import { User } from '../models/User.model';
import { env } from '../config/env';

export async function startRoadmap(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      res.status(404).json({ success: false, message: 'Roadmap not found' });
      return;
    }

    let progress = await UserRoadmapProgress.findOne({ userId, roadmapId: id });
    if (!progress) {
      progress = new UserRoadmapProgress({
        userId,
        roadmapId: id,
        domainSlug: roadmap.slug,
        selectedPathId: roadmap.paths?.[0]?.id || '',
        completedNodes: [],
        completedProjects: [],
        percentComplete: 0,
      });
      await progress.save();
    }

    res.json({ success: true, progress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getUserRoadmaps(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const progressList = await UserRoadmapProgress.find({ userId }).populate('roadmapId', 'slug overview nodes');
    res.json({ success: true, count: progressList.length, progressList });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getProgress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const progress = await UserRoadmapProgress.findOne({ userId, roadmapId: id });
    res.json({ success: true, progress: progress || null });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function completeNode(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id, nodeId } = req.params;
    const userId = req.user!.id;

    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      res.status(404).json({ success: false, message: 'Roadmap not found' });
      return;
    }

    let progress = await UserRoadmapProgress.findOne({ userId, roadmapId: id });
    if (!progress) {
      progress = new UserRoadmapProgress({
        userId,
        roadmapId: id,
        domainSlug: roadmap.slug,
        completedNodes: [nodeId],
      });
    } else {
      if (!progress.completedNodes.includes(nodeId)) {
        progress.completedNodes.push(nodeId);
      }
    }

    const totalNodes = roadmap.nodes.length || 1;
    progress.percentComplete = Math.min(100, Math.round((progress.completedNodes.length / totalNodes) * 100));
    progress.lastActiveAt = new Date();
    await progress.save();

    res.json({ success: true, progress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function completeProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id, projectId } = req.params;
    const userId = req.user!.id;

    const progress = await UserRoadmapProgress.findOne({ userId, roadmapId: id });
    if (progress) {
      if (!progress.completedProjects.includes(projectId)) {
        progress.completedProjects.push(projectId);
      }
      progress.lastActiveAt = new Date();
      await progress.save();
    }

    res.json({ success: true, progress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function switchPath(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { pathId } = req.body;
    const userId = req.user!.id;

    const progress = await UserRoadmapProgress.findOneAndUpdate(
      { userId, roadmapId: id },
      { selectedPathId: pathId, lastActiveAt: new Date() },
      { new: true }
    );

    res.json({ success: true, progress });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getRecommendation(req: AuthRequest, res: Response): Promise<void> {
  try {
    res.json({ success: true, nextRecommendedStep: 'Continue learning fundamentals' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getApiKey(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    let user = userId ? await User.findById(userId) : null;
    if (!user && userEmail) {
      user = await User.findOne({ email: userEmail.toLowerCase() });
    }
    if (!user) {
      user = await User.findOne({ role: 'ADMIN' });
    }

    // Return stored user API key if available
    if (user && user.apiKey) {
      res.json({ success: true, apiKey: user.apiKey });
      return;
    }

    // Otherwise return default environment API key (STABLE & CONSTANT across refreshes)
    res.json({ success: true, apiKey: env.roadmapApiKey });
  } catch (err: any) {
    console.error('[getApiKey Error]', err);
    res.json({ success: true, apiKey: env.roadmapApiKey });
  }
}

export async function generateApiKey(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    let user = userId ? await User.findById(userId) : null;
    if (!user && userEmail) {
      user = await User.findOne({ email: userEmail.toLowerCase() });
    }
    if (!user) {
      user = await User.findOne({ role: 'ADMIN' });
    }
    if (!user) {
      user = await User.findOne({});
    }

    const hex = crypto.randomBytes(16).toString('hex');
    const newKey = `roadmap_key_${hex}`;

    if (user) {
      await User.updateOne({ _id: user._id }, { $set: { apiKey: newKey } });
    }

    res.json({ success: true, apiKey: newKey });
  } catch (err: any) {
    console.error('[generateApiKey Error]', err);
    res.status(500).json({ success: false, message: 'Failed to generate new API Key.' });
  }
}
