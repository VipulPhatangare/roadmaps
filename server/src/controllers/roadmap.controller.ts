import { Request, Response } from 'express';
import { Roadmap } from '../models/Roadmap.model';

export async function getRoadmaps(req: Request, res: Response): Promise<void> {
  try {
    const roadmaps = await Roadmap.find({ status: { $in: ['PUBLISHED', 'VALIDATED', 'DRAFT'] } }).select(
      'slug version overview status foundation nodes specializations projects validation updatedAt'
    );
    res.json({ success: true, count: roadmaps.length, roadmaps });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getRoadmapBySlug(req: Request, res: Response): Promise<void> {
  try {
    const roadmap = await Roadmap.findOne({ slug: req.params.slug });
    if (!roadmap) {
      res.status(404).json({ success: false, message: 'Roadmap not found' });
      return;
    }
    res.json({ success: true, roadmap });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

export async function getNodeDetail(req: Request, res: Response): Promise<void> {
  try {
    const { slug, nodeId } = req.params;
    const roadmap = await Roadmap.findOne({ slug });
    if (!roadmap) {
      res.status(404).json({ success: false, message: 'Roadmap not found' });
      return;
    }

    const node = roadmap.nodes.find((n: any) => n.id === nodeId);
    if (!node) {
      res.status(404).json({ success: false, message: 'Node not found' });
      return;
    }

    const resources = roadmap.resources.filter((r: any) => node.resources.includes(r.id));
    const projects = roadmap.projects.filter((p: any) => node.projects.includes(p.id));

    res.json({ success: true, node, resources, projects });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
