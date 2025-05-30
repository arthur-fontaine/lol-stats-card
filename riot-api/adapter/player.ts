import { Chunk, Effect, Option, Schema, Stream } from "effect";
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

    getMatches: (params = {}) => Effect.gen(function* () {
      const riotApi = yield* RiotApi;
      
      const queryParams = new URLSearchParams();
      if (params.startTime) queryParams.append("startTime", params.startTime.toString());
      if (params.endTime) queryParams.append("endTime", params.endTime.toString());
      if (params.start) queryParams.append("start", params.start.toString());
      if (params.count) queryParams.append("count", params.count.toString());

      const endpoint = `lol/match/v5/matches/by-puuid/${puuid}/ids?${queryParams.toString()}`;
      const matchIds = yield* riotApi.makeRequest(endpoint, Schema.Array(Schema.String));

      return yield* Effect.forEach(matchIds, riotApi.Match);
    }),

    iterateMatches: (params = {}) => Stream.asyncEffect(emit => Effect.gen(function* () {
      const riotApi = yield* RiotApi;
      const player = yield* riotApi.Player(puuid);

      let count = 0;
      let hasMore = true;
      while (hasMore) {
        const matches = yield* player.getMatches({
          startTime: params.startTime,
          endTime: params.endTime,
          start: count,
          count: 100,
        });
        if (matches.length === 0) {
          hasMore = false;
        }
        count += matches.length;
        emit(Effect.succeed(Chunk.fromIterable(matches)));
      }

      emit(Effect.fail(Option.none()));
    })),

  })
