import { Schema } from "effect";

export const RiotMatchGetTimelineResponse = Schema.Struct({
  info: Schema.Struct({
    frameInterval: Schema.Number,
    frames: Schema.Array(Schema.Struct({
      events: Schema.Array(Schema.Union(
        Schema.Struct({
          type: Schema.Literal("CHAMPION_KILL"),
          assistingParticipantIds: Schema.optional(Schema.Array(Schema.Number)),
          killerId: Schema.optional(Schema.Number),
        }),
        Schema.Struct({}),
      )),
      participantFrames: Schema.Record({
        key: Schema.String,
        value: Schema.Struct({
          participantId: Schema.Number,
          currentGold: Schema.Number,
          totalGold: Schema.Number,
          xp: Schema.Number,
        })
      }),
    })),
  }),
  metadata: Schema.Struct({}),
});
