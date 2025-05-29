import { Schema } from "effect";

export const RiotMatchGetTimelineResponse = Schema.Struct({
  info: Schema.Struct({
    frameInterval: Schema.Number,
    frames: Schema.Array(Schema.Struct({
      participantFrames: Schema.Record({
        key: Schema.String,
        value: Schema.Struct({
          participantId: Schema.Number,
          currentGold: Schema.Number,
          xp: Schema.Number,
        })
      }),
    })),
  }),
  metadata: Schema.Struct({}),
});
