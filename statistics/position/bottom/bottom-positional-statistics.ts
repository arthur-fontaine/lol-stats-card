import { Data } from "effect";

export class BottomPositionalStatistics extends Data.TaggedClass("BottomPositionalStatistics")<{
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
