import { Effect, Schema } from "effect";
import { RiotApi } from "../domain/port/riot-api";
import { RiotPlayerGetChampionsMasteriesResponse } from "../domain/model/schemas/player/get-champion-masteries";
import { RiotPlayerGetDataResponse } from "../domain/model/schemas/player/get-data";
import type { RiotApiPlayer } from "../domain/model/player";

export const RiotPlayerImpl = (puuid: string) =>
  Effect.succeed<RiotApiPlayer>({

    getChampionsMasteries: () => Effect.gen(function* () {
      const riotApi = yield* RiotApi;

      const endpoint = `lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`;

      return yield* riotApi.makeRequest(endpoint, RiotPlayerGetChampionsMasteriesResponse)
    }),

    getData: () => Effect.gen(function* () {
      const riotApi = yield* RiotApi;

      const endpoint = `lol/challenges/v1/player-data/${puuid}`;

      return yield* riotApi.makeRequest(endpoint, RiotPlayerGetDataResponse)
    }),

    getMatches: () => Effect.gen(function* () {
      const riotApi = yield* RiotApi;

      const endpoint = `lol/match/v5/matches/by-puuid/${puuid}/ids`;
      const matchIds = yield* riotApi.makeRequest(endpoint, Schema.Array(Schema.String));

      return yield* Effect.forEach(matchIds, riotApi.Match);
    }),

  })
