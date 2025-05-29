import { Hono } from 'hono';
import { imageStatsRouter } from './routers/image-stats';

const app = new Hono()
  .route('/image-stats', imageStatsRouter);

export type AppType = typeof app;
