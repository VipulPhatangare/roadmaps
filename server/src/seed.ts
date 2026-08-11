import bcrypt from 'bcryptjs';
import path from 'path';
import { connectDB } from './config/db';
import { User } from './models/User.model';
import { Domain } from './models/Domain.model';
import { Roadmap } from './models/Roadmap.model';
import { GenerationJob } from './models/GenerationJob.model';
import { AgentExecution } from './models/AgentExecution.model';
import { parseCSV } from './utils/csvParser';
import { WorkerPool } from './queues/WorkerPool';

async function seed() {
  await connectDB();

  console.log('[Seed] Clearing all existing database collections...');
  await Domain.deleteMany({});
  await Roadmap.deleteMany({});
  await GenerationJob.deleteMany({});
  await AgentExecution.deleteMany({});

  // 1. Create Admin User
  const existingAdmin = await User.findOne({ email: 'admin@roadmap.ai' });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash('Admin@2026', salt);
    await User.create({
      name: 'System Admin',
      email: 'admin@roadmap.ai',
      passwordHash,
      role: 'ADMIN',
    });
    console.log('[Seed] Admin user created: admin@roadmap.ai / Admin@2026');
  }

  // 2. Parse roadmaps.csv & seed all 293 domains into MongoDB
  const csvPath = path.join(process.cwd(), '..', 'roadmaps.csv');
  const parsedDomains = await parseCSV(csvPath);
  console.log(`[Seed] Found ${parsedDomains.length} domains in roadmaps.csv. Populating domain documents...`);

  for (const d of parsedDomains) {
    await Domain.create({
      name: d.name,
      slug: d.slug,
      category: 'Software Development',
      status: 'IMPORTED',
    });
  }

  console.log(`[Seed] Successfully created ${parsedDomains.length} domain entries!`);

  // 3. Enqueue all 293 domains into the 3-Agent Parallel WorkerPool queue!
  console.log('[Seed] 🚀 Enqueuing all 293 domains into WorkerPool for 3-Agent Parallel AI processing...');
  const result = await WorkerPool.generateAllDomains(0); // 0 means ALL domains
  console.log(`[Seed] ${result.message}`);

  console.log('[Seed] Background worker pool is active and processing domains concurrently in parallel!');
  process.exit(0);
}

seed();
