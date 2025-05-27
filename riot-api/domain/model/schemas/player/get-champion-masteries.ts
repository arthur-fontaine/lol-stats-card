import { Schema } from 'effect';

export const RiotPlayerGetChampionsMasteriesResponse = Schema.Array(Schema.Struct({
  championId: Schema.Number,
  championLevel: Schema.Number,
  championPoints: Schema.Number,
}));
