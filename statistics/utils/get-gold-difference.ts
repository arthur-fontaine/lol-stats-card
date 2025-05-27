import type { RiotApi } from "../../riot-api/riot-api";

type MatchDetails = Awaited<ReturnType<InstanceType<typeof RiotApi['Match']>['getDetails']>>;
type Frame = Awaited<ReturnType<InstanceType<typeof RiotApi['Match']>['getTimeline']>>['info']['frames'][number];
export function getGoldDifference(matchDetails: MatchDetails, frame: Frame, participantId: number): number {
  const participantFrame = frame.participantFrames[participantId];
  if (!participantFrame) throw new Error(`Participant frame not found for participantId: ${participantId}`);

  const participantDetails = matchDetails.info.participants.find(p => p.participantId === participantId);
  if (!participantDetails) throw new Error(`Participant not found for participantId: ${participantId}`);

  const role = participantDetails.role;

  const opponentFrame = matchDetails.info.participants.find(p =>
    true
    && p.individualPosition === participantDetails.individualPosition
    && p.participantId !== participantId
  );
  if (!opponentFrame) throw new Error(`Opponent not found for role: ${role}`);

  const opponentParticipantFrame = frame.participantFrames[opponentFrame.participantId];
  if (!opponentParticipantFrame) throw new Error(`Opponent participant frame not found for participantId: ${opponentFrame.participantId}`);

  return participantFrame.currentGold - opponentParticipantFrame.currentGold;
}
