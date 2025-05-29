import { Data } from "effect";

export class SupportPositionalStatistics extends Data.TaggedClass("SupportPositionalStatistics")<{
  kp: number;
  vspm: number;
  kp14: number;
  "g@14": number;
  kda: number;
  win: number;
  loss: number;
  championName: string;
}> {
};
