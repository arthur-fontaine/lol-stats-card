import type { RiotMatchGetDetailsResponse } from "../../riot-api/domain/model/schemas/match/get-match-details";

export function getCSPerMinute(
  matchDetails: typeof RiotMatchGetDetailsResponse.Type,
  participantId: number,
): number {
  const participantDetails = matchDetails.info.participants.find(p => p.participantId === participantId);
  if (!participantDetails) throw new Error(`Participant not found for participantId: ${participantId}`);

  const totalCS = participantDetails.totalMinionsKilled + participantDetails.neutralMinionsKilled;
  const gameDurationInMinutes = matchDetails.info.gameDuration / 60;
  
  return totalCS / gameDurationInMinutes;
}
