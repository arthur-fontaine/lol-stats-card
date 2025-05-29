import { Data } from "effect";

export class TopPositionalStatistics extends Data.TaggedClass("TopPositionalStatistics")<{
  csm: number;
  soloKills: number;
  "g@14": number;
  "xp@14": number;
  kda: number;
  win: number;
  loss: number;
  championName: string;
}> {
};
