import { Schema } from "effect";

export const RiotMatchGetDetailsResponse = Schema.Struct({
  metadata: Schema.Struct({}),
  info: Schema.Struct({
    gameMode: Schema.String,
    participants: Schema.Array(Schema.Struct({
      puuid: Schema.String,
      role: Schema.String,
      assists: Schema.Number,
      deaths: Schema.Number,
      kills: Schema.Number,
      lane: Schema.String,
      individualPosition: Schema.String,
      champLevel: Schema.Number,
      championName: Schema.String,
      championId: Schema.Number,
      participantId: Schema.Number,
      challenges: Schema.Struct({
        killParticipation: Schema.Number,
        kda: Schema.Number,
        soloKills: Schema.Number,
        teamDamagePercentage: Schema.Number,
      }),
    })),
  }),
});
