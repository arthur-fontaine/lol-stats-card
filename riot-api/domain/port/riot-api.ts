import { Effect, Context, Schema } from "effect"
import type { UnknownException } from "effect/Cause";
import type { ParseError } from "effect/ParseResult";
import type { RiotApiAccount } from "../model/account";
import type { RiotApiPlayer } from "../model/player";
import type { RiotApiMatch } from "../model/match";
import type { RiotApiRoot } from "../model/root";

export class RiotApi extends Context.Tag("RiotApi")<
  RiotApi,
  {
    makeRequest<T>(endpoint: string, schema: Schema.Schema<T>): Effect.Effect<T, UnknownException | ParseError>,

    Account: (tag: string, name: string) => Effect.Effect<RiotApiAccount, UnknownException | ParseError, RiotApi>,
    Player: (puuid: string) => Effect.Effect<RiotApiPlayer>,
    Match: (matchId: string) => Effect.Effect<RiotApiMatch>,
  }
>() { }
