import { Effect, Option, pipe, Ref } from "effect";
import { riftPipeline } from "./statistics/game-mode/rift-pipeline";
import { middlePositionalPipeline } from "./statistics/position/middle/middle-positional-pipeline";
import { RiotApiImpl } from "./riot-api/adapter/riot-api";
import { RiotApi } from "./riot-api/domain/port/riot-api";
import { StatisticsParamsState } from "./statistics/statistics-params";
import { meanObject } from "./statistics/operations/mean-object";
import { getPaletteColor } from "./image-generator/style/palette-colors";
import { sumObject } from "./statistics/operations/sum-object";
import { middlePositionalImgGenerator } from "./statistics/position/middle/middle-positional-img-generator";
import { StyleState } from "./image-generator/style/style-state";

const pipelines = {
  'game-mode/rift': riftPipeline,
  'position/middle': middlePositionalPipeline,
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
  paletteColor: Parameters<typeof getPaletteColor>[0];
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
    name: "Nangaim",
    tag: "MGN",
    pipelines: ['game-mode/rift', 'position/middle'],
    operations: {
      mean: ['kp', 'dmg', 'soloKills', 'g@14', 'kda'],
      sum: ['win', 'loss'],
    },
    paletteColor: 'default',
  }

  const player = {
    name: "Nangaim",
    tag: "MGN",
    imageUrl: await Bun.file('Capture d’écran 2025-05-28 à 02.51.08.png').arrayBuffer()
      .then(buffer => Buffer.from(buffer).toString('base64'))
      .then(base64 => `data:image/png;base64,${base64}`),
  }

  const images = await Effect.Do.pipe(
    Effect.andThen(getStatsForAccount(params)),
    Effect.andThen(stats => [
      middlePositionalImgGenerator(stats, player),
    ]),
    Effect.andThen(
      Effect.forEach(imageOption =>
        Effect.succeed(Option.getOrUndefined(imageOption))
      )
    ),
    Effect.andThen(images => images.filter(image => image !== undefined)),
    Effect.andThen(Effect.all),
    Effect.provideServiceEffect(
      StyleState,
      Ref.make({
        palette: getPaletteColor(params.paletteColor),
      })
    ),
    Effect.runPromise,
  )

  for (const image of images) {
    await Bun.write(`output-${params.name}-${params.tag}-${Date.now()}.png`, image);
  }
}

console.log(await main());
