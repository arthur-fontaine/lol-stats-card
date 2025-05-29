import type { RiotMatchGetDetailsResponse } from "../../riot-api/domain/model/schemas/match/get-match-details";
import type { RiotMatchGetTimelineResponse } from "../../riot-api/domain/model/schemas/match/get-timeline";

export function getXpDifference(
  matchDetails: typeof RiotMatchGetDetailsResponse.Type,
  frame: typeof RiotMatchGetTimelineResponse.Type['info']['frames'][number],
  participantId: number,
): number {
  const participantFrame = frame.participantFrames[participantId];
  if (!participantFrame) throw new Error(`Participant frame not found for participantId: ${participantId}`);

  const participantDetails = matchDetails.info.participants.find(p => p.participantId === participantId);
  if (!participantDetails) throw new Error(`Participant not found for participantId: ${participantId}`);

  const opponentFrame = matchDetails.info.participants.find(p =>
    true
    && p.individualPosition === participantDetails.individualPosition
    && p.participantId !== participantId
  );
  if (!opponentFrame) throw new Error(`Opponent not found for role: ${participantDetails.role}`);

  const opponentParticipantFrame = frame.participantFrames[opponentFrame.participantId];
  if (!opponentParticipantFrame) throw new Error(`Opponent participant frame not found for participantId: ${opponentFrame.participantId}`);

  return participantFrame.xp - opponentParticipantFrame.xp;
}
