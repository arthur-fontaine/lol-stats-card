import { Queue } from "../domain/port/queue"
import Redis from "ioredis"
import { Layer, Effect, Stream } from "effect"

interface RedisQueueParams {
  queuePrefix: string
}

export const RedisQueueImpl = (params: RedisQueueParams) => {
  const client = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  })

  return Queue.of({
    enqueue: (key, item) => Effect.sync(() =>
      client.lpush(`${params.queuePrefix}:${key}`, JSON.stringify(item))),

    stream: (key) =>
      Stream.repeatEffect(
        Effect.async((resume) => {
          client.brpop(`${params.queuePrefix}:${key}`, 0, (err, result) => {
            if (err || !result) return resume(Effect.succeed(null))
            const [, value] = result
            resume(Effect.succeed(JSON.parse(value)))
          })
        })
      ),
  })
}