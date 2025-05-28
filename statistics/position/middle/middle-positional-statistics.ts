import { Data } from "effect";

export class MiddlePositionalStatistics extends Data.TaggedClass("MiddlePositionalStatistics")<{
  kp: number;
  dmg: number;
  soloKills: number;
  "g@14": number;
  kda: number;
  win: number;
  loss: number;
  championName: string;
}> {
};
