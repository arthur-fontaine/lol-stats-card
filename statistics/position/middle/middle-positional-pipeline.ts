import { Effect, Ref } from "effect";
import { StatisticsParamsState } from "../../statistics-params";
import { Skip } from "../../skip";
import { getGoldDifference } from "../../utils/get-gold-difference";
import { MiddlePositionalStatistics } from "./middle-positional-statistics";

export const middlePositionalPipeline = () => Effect.gen(function* () {
  const state = yield* StatisticsParamsState;
  const { match, account } = yield* Ref.get(state);
  
  const matchDetails = yield* match.getDetails();

  const playerInMatch = matchDetails.info.participants.find(p => p.puuid === account.puuid);
  if (!playerInMatch) {
    return yield* Effect.fail(new Error('Player not found in match details'));
  }

  if (playerInMatch.individualPosition !== 'MIDDLE') {
    return yield* Effect.fail(new Skip());
  }

  const matchTimeline = yield* match.getTimeline();
  const frameAt14 = matchTimeline.info.frames[14];
  if (!frameAt14) {
    return yield* Effect.fail(new Error('Frame at 14 minutes not found in match timeline'));
  }

  const goldDifference = yield* Effect.try(() =>
    getGoldDifference(matchDetails, frameAt14, playerInMatch.participantId));
  
  const isWin = yield* Effect.try(() =>
    matchDetails.info.participants.some(p => p.puuid === account.puuid && p.win))

  return new MiddlePositionalStatistics({
    kp: playerInMatch.challenges.killParticipation,
    dmg: playerInMatch.challenges.teamDamagePercentage,
    soloKills: playerInMatch.challenges.soloKills,
    "g@14": goldDifference,
    kda: playerInMatch.challenges.kda,
    win: isWin ? 1 : 0,
    loss: isWin ? 0 : 1,
    championName: playerInMatch.championName,
  })
})
