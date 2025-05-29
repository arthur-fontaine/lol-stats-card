import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { imageStatsRouter } from './routers/image-stats';

const app = new Hono()
  .use('*', cors())
  .route('/image-stats', imageStatsRouter);

export type AppType = typeof app;

export default app;
