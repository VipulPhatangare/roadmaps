import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserRoadmapProgress } from '../models/UserRoadmapProgress.model';
import { Roadmap } from '../models/Roadmap.model';

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
    const { User } = await import('../models/User.model');
    const { env } = await import('../config/env');
    const crypto = await import('crypto');

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
      res.json({ success: true, apiKey: env.roadmapApiKey });
      return;
    }

    if (!user.apiKey) {
      const hex = crypto.randomBytes(16).toString('hex');
      user.apiKey = `roadmap_key_${hex}`;
      await user.save();
    }

    res.json({ success: true, apiKey: user.apiKey });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function generateApiKey(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { User } = await import('../models/User.model');
    const crypto = await import('crypto');

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

    if (!user) {
      res.status(404).json({ success: false, message: 'No user account found.' });
      return;
    }

    const hex = crypto.randomBytes(16).toString('hex');
    user.apiKey = `roadmap_key_${hex}`;
    await user.save();

    res.json({ success: true, apiKey: user.apiKey });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
