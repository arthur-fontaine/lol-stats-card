import { Data } from "effect";

export class JunglePositionalStatistics extends Data.TaggedClass("JunglePositionalStatistics")<{
  kp: number;
  dpm: number;
  dmg: number;
  "g@14": number;
  kda: number;
  win: number;
  loss: number;
  championName: string;
}> {
};
