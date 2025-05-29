import { Effect, pipe, Schema } from 'effect';
import { Hono } from 'hono';
import fsDriver from 'unstorage/drivers/fs';
import { Storage } from '../../../effect-lib/unstorage/domain/port/storage';
import { RedisQueueImpl } from '../../../effect-lib/queue/adapter/redis-queue';
import { Queue } from '../../../effect-lib/queue/domain/port/queue';
import { sValidator } from '@hono/standard-validator';
import { TreatAccountParams } from '../../generator-queue/main';
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
        const results = yield* Effect.tryPromise(() => storage.getItems(keys));

        return c.json(results.map((item) => item.value));
      }),
      Effect.provideService(
        Storage,
        UnstorageImpl({ driver: fsDriver({ base: "./.storage" }) }),
      ),
      Effect.runPromise,
    ),
  )
