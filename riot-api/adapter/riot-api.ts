import { fetchEffect } from '../../effect-lib/fetch-effect';
import { RiotApi } from '../domain/port/riot-api';
import { Effect, Schema } from 'effect';
import { RiotPlayerImpl } from './player';
import { RiotApiAccountImpl } from './account';
import { RiotApiMatchImpl } from './match';

interface RiotApiImplParams {
  regions: string[];
  apiKey: string;
}

export const RiotApiImpl = ({ regions, apiKey }: RiotApiImplParams) =>
  RiotApi.of({

    makeRequest: (endpoint, schema) =>
      Effect.firstSuccessOf(regions.map((region) =>
        Effect.gen(function* () {
          const url = `https://${region}.api.riotgames.com/${endpoint}`;
          const headers = {
            'X-Riot-Token': apiKey,
          };

          const response = yield* fetchEffect(url, { headers });
          const data = yield* Effect.tryPromise(() => response.json());

          return yield* Schema.decodeUnknownEither(schema)(data)
        }),
      )),

    Account: RiotApiAccountImpl,
    Match: RiotApiMatchImpl,
    Player: RiotPlayerImpl,

  })
