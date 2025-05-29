import { Effect, pipe, Schema } from 'effect';
import { Hono } from 'hono';
import fsDriver from 'unstorage/drivers/fs';
import { Storage } from '../../../effect-lib/unstorage/domain/port/storage';
import { RedisQueueImpl } from '../../../effect-lib/queue/adapter/redis-queue';
import { Queue } from '../../../effect-lib/queue/domain/port/queue';
import { sValidator } from '@hono/standard-validator';
import { TreatAccountParams } from '../../generator-queue/treat-account-params';
import { UnstorageImpl } from '../../../effect-lib/unstorage/adapter/unstorage';
import { paletteColors, pipelines } from '../../../options';

export const imageStatsRouter = new Hono()
  .post(
    '/jobs',
    sValidator('json', Schema.standardSchemaV1(TreatAccountParams)),
    (c) => pipe(
      Queue,
      Effect.andThen(queue =>
        queue.enqueue("treat-account", c.req.valid('json'))),
      Effect.provideService(
        Queue,
        RedisQueueImpl({ queuePrefix: "queue" }),
      ),
      Effect.runPromise,
    ),
  )
  .get(
    '/jobs/options',
    (c) => c.json({
      paletteColors: paletteColors,
      pipelines: Object.keys(pipelines),
    } as const),
  )
  .get(
    '/',
    sValidator('query', Schema.standardSchemaV1(Schema.Struct({
      name: Schema.String,
      tag: Schema.String,
    }))),
    (c) => pipe(
      Effect.gen(function* () {
        const { name, tag } = c.req.valid('query');

        const storage = yield* Storage;

        const keys = yield* Effect.tryPromise(() => storage.keys(`${name}-${tag}-`));

        return c.json({ images: keys });
      }),
      Effect.provideService(
        Storage,
        UnstorageImpl({ driver: fsDriver({ base: "./.storage" }) }),
      ),
      Effect.runPromise,
    ),
  )
  .get(
    '/:id',
    sValidator('param', Schema.standardSchemaV1(Schema.Struct({
      id: Schema.String,
    }))),
    async (c) => pipe(
      Effect.gen(function* () {
        const { id } = c.req.valid('param');

        const storage = yield* Storage;

        const item = yield* Effect.tryPromise(() => storage.getItem(id));

        if (!item) return c.notFound();
        if (typeof item !== 'string') return c.text('Invalid image format', 500);

        const buffer = Buffer.from(item, 'base64');
        return c.body(buffer)
      }),
      Effect.provideService(
        Storage,
        UnstorageImpl({ driver: fsDriver({ base: "./.storage" }) }),
      ),
      Effect.runPromise,
    ),
  )
