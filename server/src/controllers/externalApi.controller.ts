import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Roadmap } from '../models/Roadmap.model';

/**
 * GET /api/v1/external/roadmaps
 * Retrieves basic information (IDs, names, metadata summary) for all roadmaps.
 */
export async function getExternalRoadmapsBasic(req: Request, res: Response): Promise<void> {
  try {
    const roadmaps = await Roadmap.find()
      .populate('domainId', 'name category slug')
      .select('domainId slug version status overview nodes edges specializations createdAt updatedAt');

    const basicRoadmaps = roadmaps.map((r: any) => ({
      id: r._id,
      slug: r.slug,
      name: r.domainId?.name || r.slug,
      category: r.domainId?.category || 'Uncategorized',
      status: r.status,
      version: r.version,
      overview: r.overview,
      nodeCount: Array.isArray(r.nodes) ? r.nodes.length : 0,
      edgeCount: Array.isArray(r.edges) ? r.edges.length : 0,
      specializationCount: Array.isArray(r.specializations) ? r.specializations.length : 0,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));

    res.json({
      success: true,
      count: basicRoadmaps.length,
      roadmaps: basicRoadmaps,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}

/**
 * GET /api/v1/external/roadmaps/:id
 * Retrieves full detailed data of a roadmap by its ID (or slug).
 */
export async function getExternalRoadmapById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    let query: any;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      query = { slug: id };
    }

    const roadmap = await Roadmap.findOne(query).populate('domainId', 'name category slug status');

    if (!roadmap) {
      res.status(404).json({
        success: false,
        message: `Roadmap not found for identifier: ${id}`,
      });
      return;
    }

    res.json({
      success: true,
      roadmap,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
