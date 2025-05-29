import { Effect, type Stream } from "effect"
import type { RiotPlayerGetDataResponse } from "./schemas/player/get-data"
import type { RiotPlayerGetChampionsMasteriesResponse } from "./schemas/player/get-champion-masteries"
import type { RiotApiMatch } from "./match"
import type { UnknownException } from "effect/Cause"
import type { ParseError } from "effect/ParseResult"
import type { RiotApi } from "../port/riot-api"

export interface RiotApiPlayer {
  getData(): Effect.Effect<typeof RiotPlayerGetDataResponse.Type, UnknownException | ParseError, RiotApi>
  getChampionsMasteries(): Effect.Effect<typeof RiotPlayerGetChampionsMasteriesResponse.Type, UnknownException | ParseError, RiotApi>
  getMatches(params?: {
    startTime?: number
    endTime?: number
    start?: number
    count?: number
  }): Effect.Effect<RiotApiMatch[], UnknownException | ParseError, RiotApi>
  iterateMatches(params?: {
    startTime?: number
    endTime?: number
  }): Stream.Stream<RiotApiMatch, UnknownException | ParseError, RiotApi>
}
