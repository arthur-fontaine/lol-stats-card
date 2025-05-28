import { Effect, Ref } from "effect";
import { riftPipeline } from "./statistics/game-mode/rift-pipeline";
import { middlePositionPipeline } from "./statistics/position/middle";
import { RiotApiImpl } from "./riot-api/adapter/riot-api";
import { RiotApi } from "./riot-api/domain/port/riot-api";
import { StatisticsParamsState } from "./statistics/statistics-params";
import { meanObject } from "./statistics/operations/mean-object";
import { generateImgForPositionMiddle } from "./image-generator/generate-img-for-position-middle";
import { getPaletteColor } from "./image-generator/palette-colors";
import { sumObject } from "./statistics/operations/sum-object";

const pipelines = {
  'game-mode/rift': riftPipeline,
  'position/middle': middlePositionPipeline,
} as const;

const operations = {
  'mean': meanObject,
  'sum': sumObject,
} as const;

interface GetStatsForAccountParams {
  name: string;
  tag: string;
  pipelines: (keyof typeof pipelines)[];
  operations?: {
    [K in keyof typeof operations]?: string[];
  }
  paletteColor: number;
}

const getStatsForAccount = (params: GetStatsForAccountParams) => Effect.Do.pipe(
  Effect.flatMap(() => makeStatisticsParamsStates(params)),
  Effect.andThen((allStatisticsParams) =>
    Effect.forEach(allStatisticsParams, (statisticsParams) => Effect.Do.pipe(
      Effect.andThen(params.pipelines.includes('game-mode/rift') ? pipelines['game-mode/rift']() : Effect.succeed(undefined)),
      Effect.andThen(params.pipelines.includes('position/middle') ? pipelines['position/middle']() : Effect.succeed(undefined)),
      Effect.catchTag("Skip", () => Effect.succeed(undefined)),
      Effect.provideServiceEffect(StatisticsParamsState, Ref.make(statisticsParams))
    ))
  ),
  Effect.andThen((results) => results.filter((result) => result !== undefined)),
  Effect.provideService(RiotApi, RiotApiImpl({
    regions: ["europe", "euw1"],
    apiKey: process.env.RIOT_API_KEY!
  })),
)

const makeStatisticsParamsStates = (params: GetStatsForAccountParams) => Effect.gen(function* () {
  const riotApi = yield* RiotApi;

  const account = yield* riotApi.Account(params.tag, params.name);
  const player = yield* account.getPlayer();
  const matches = yield* player.getMatches();

  return matches.map(match => ({ match, account }));
})

async function main() {
  const params: GetStatsForAccountParams = {
    name: "Capsismyfather",
    tag: "CAPS",
    pipelines: ['game-mode/rift', 'position/middle'],
    operations: {
      mean: ['kp', 'dmg', 'soloKills', 'g@14', 'kda'],
      sum: ['win', 'loss'],
    },
    paletteColor: 0,
  }

  const results = await getStatsForAccount(params).pipe(Effect.runPromise);

  if (!params.operations || Object.keys(params.operations).length === 0) return results;

  const [firstResult] = results;
  if (!firstResult) return results;

  let result = firstResult;
  for (const [operation, keys] of Object.entries(params.operations)) {
    if (keys.length === 0) continue;
    result = {
      ...result,
      ...operations[operation as keyof typeof operations](results, keys as (keyof typeof result)[]),
    }
  }

  // const result = {
  //   kp: 0.5833333333333334,
  //   dmg: 0.27736517588395043,
  //   soloKills: 10,
  //   "g@14": 253,
  //   kda: 3.5,
  //   win: 5,
  //   loss: 7,
  //   __tag: "MiddlePositionalStatistics",
  // } as const;

  const statsFile = await (
    result.__tag === 'MiddlePositionalStatistics' ? generateImgForPositionMiddle(result, { colors: getPaletteColor(params.paletteColor) }) :
      Promise.resolve()
  )

  if (statsFile) {
    await Bun.write("stats.png", statsFile);
  }

  return result;
}

console.log(await main());
