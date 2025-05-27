import { Effect, Ref } from "effect";
import { riftPipeline } from "./statistics/game-mode/rift-pipeline";
import { middlePositionPipeline } from "./statistics/position/middle";
import { RiotApiImpl } from "./riot-api/adapter/riot-api";
import { RiotApi } from "./riot-api/domain/port/riot-api";
import { StatisticsParamsState } from "./statistics/statistics-params";
import { meanObject } from "./statistics/operations/mean-object";
import { generateImgForPositionMiddle } from "./image-generator/generate-img-for-position-middle";
import { getPaletteColor, paletteColors } from "./image-generator/palette-colors";

const pipelines = {
  'game-mode/rift': riftPipeline,
  'position/middle': middlePositionPipeline,
} as const;

const operations = {
  'mean': meanObject,
} as const;

interface GetStatsForAccountParams {
  name: string;
  tag: string;
  pipelines: (keyof typeof pipelines)[];
  operations: (keyof typeof operations)[];
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
  Effect.andThen((results) =>
    params.operations.includes('mean') ? operations['mean'](results, ['dmg', 'g@14', 'kda', 'kp', 'soloKills']) : results),
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
    operations: ['mean'],
    paletteColor: 0,
  }

  const results = {
    "kp": 0.601648,
    "dmg": 0.269532,
    "soloKills": 1.333333,
    "g@14": -179.166667,
    "kda": 3.636742,
    "__tag": "MiddlePositionalStatistics" as const,
  }

  if ('__tag' in results) {
    let statsFilePromise: Promise<Buffer>;
    const style = {
      colors: getPaletteColor(params.paletteColor)
    };
    switch (results.__tag) {
      case 'MiddlePositionalStatistics': {
        statsFilePromise = generateImgForPositionMiddle(results, style);
        break;
      }
    }

    const statsFile = await statsFilePromise;
    await Bun.write("middle-stats.png", statsFile);
  }
}

main();
