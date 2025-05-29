import { Effect, Ref } from "effect";
import { StatisticsParamsState } from "../../statistics-params";
import { Skip } from "../../skip";
import { getGoldDifference } from "../../utils/get-gold-difference";
import { TopPositionalStatistics } from "./top-positional-statistics";

export const topPositionalPipeline = () => Effect.gen(function* () {
  const state = yield* StatisticsParamsState;
  const { match, account } = yield* Ref.get(state);
  
  const matchDetails = yield* match.getDetails();

  const playerInMatch = matchDetails.info.participants.find(p => p.puuid === account.puuid);
  if (!playerInMatch) {
    return yield* Effect.fail(new Error('Player not found in match details'));
  }

  if (playerInMatch.individualPosition !== 'TOP') {
    return yield* Effect.fail(new Skip());
  }

  const matchTimeline = yield* match.getTimeline();
  const frameAt14 = matchTimeline.info.frames[14];
  if (!frameAt14) {
    return yield* Effect.fail(new Error('Frame at 14 minutes not found in match timeline'));
  }

  const goldDifference = yield* Effect.try(() =>
    getGoldDifference(matchDetails, frameAt14, playerInMatch.participantId));
  
  // Calculate CS per minute
  const csm = (playerInMatch.totalMinionsKilled + playerInMatch.neutralMinionsKilled) / (matchDetails.info.gameDuration / 60);
  
  // Calculate XP difference at 14 (placeholder for now)
  const xpAt14 = 0; // Would need XP data from timeline
  
  const isWin = yield* Effect.try(() =>
    matchDetails.info.participants.some(p => p.puuid === account.puuid && p.win))

  return new TopPositionalStatistics({
    csm,
    soloKills: playerInMatch.challenges.soloKills,
    "g@14": goldDifference,
    "xp@14": xpAt14,
    kda: playerInMatch.challenges.kda,
    win: isWin ? 1 : 0,
    loss: isWin ? 0 : 1,
    championName: playerInMatch.championName,
  })
})
