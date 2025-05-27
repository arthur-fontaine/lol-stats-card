import { Effect, pipe, Ref } from "effect";
import { StatisticsParamsState } from "../statistics-params";
import { Skip } from "../skip";

export const riftPipeline = () => StatisticsParamsState.pipe(
  Effect.andThen(Ref.get),
  Effect.andThen((state) => state.match.getDetails()),
  Effect.andThen(({ info: { gameMode } }) =>
    gameMode === 'CLASSIC' || gameMode === 'SWIFTPLAY'
      ? Effect.void
      : Effect.fail(new Skip())),
)
