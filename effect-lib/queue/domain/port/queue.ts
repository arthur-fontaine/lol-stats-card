import { Effect, Context, type Stream } from "effect"

export class Queue extends Context.Tag("Queue")<
  Queue,
  {
    enqueue: (queueName: string, item: unknown) => Effect.Effect<void, never, never>
    stream: (queueName: string) => Stream.Stream<unknown | null, never, never>
  }
>() { }
