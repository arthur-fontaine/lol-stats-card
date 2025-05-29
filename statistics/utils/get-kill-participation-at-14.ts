import type { RiotMatchGetDetailsResponse } from "../../riot-api/domain/model/schemas/match/get-match-details";
import type { RiotMatchGetTimelineResponse } from "../../riot-api/domain/model/schemas/match/get-timeline";

export function getKillParticipationAt14(
  matchDetails: typeof RiotMatchGetDetailsResponse.Type,
  frame: typeof RiotMatchGetTimelineResponse.Type['info']['frames'][number],
  participantId: number,
): number {
  // This would calculate kill participation up to 14 minutes
  // For now, return the overall kill participation as a placeholder
  const participantDetails = matchDetails.info.participants.find(p => p.participantId === participantId);
  if (!participantDetails) throw new Error(`Participant not found for participantId: ${participantId}`);

  return participantDetails.challenges.killParticipation;
}
