import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { env, validateEnv } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import domainRoutes from './routes/domain.routes';
import roadmapRoutes from './routes/roadmap.routes';
import userRoutes from './routes/user.routes';
import externalApiRoutes from './routes/externalApi.routes';
import { ensureAdminCredentials } from './services/adminInitializer';

const app = express();

const allowedOrigins = env.corsOrigin === '*'
  ? true
  : env.corsOrigin.split(',').map((o) => o.trim());

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/user', userRoutes);
app.use('/api/v1/external/roadmaps', externalApiRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), model: env.geminiModel });
});

app.use(errorHandler);

async function bootstrap() {
  validateEnv();
  await connectDB();
  await ensureAdminCredentials();
  const { WorkerPool } = await import('./queues/WorkerPool');

  WorkerPool.resumeQueue();
  app.listen(env.port, () => {
    console.log(`[Server] RoadmapAI API listening on http://localhost:${env.port}`);
  });
}

bootstrap();
