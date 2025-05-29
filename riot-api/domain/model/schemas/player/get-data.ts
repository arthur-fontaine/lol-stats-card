import { Schema } from "effect";

export const RiotPlayerGetDataResponse = Schema.Struct({
  challenges: Schema.Array(Schema.Struct({
    challengeId: Schema.Number,
    percentile: Schema.Number,
    level: Schema.String,
    value: Schema.Number,
    achievedTime: Schema.UndefinedOr(Schema.Number),
  })),
  totalPoints: Schema.Struct({
    level: Schema.String,
    current: Schema.Number,
    max: Schema.Number,
    percentile: Schema.Number,
  }),
})
