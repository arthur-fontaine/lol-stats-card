import type { RiotMatchGetDetailsResponse } from "../../riot-api/domain/model/schemas/match/get-match-details";
import type { RiotMatchGetTimelineResponse } from "../../riot-api/domain/model/schemas/match/get-timeline";

export function getKillParticipationAt14(
  matchDetails: typeof RiotMatchGetDetailsResponse.Type,
  frames: typeof RiotMatchGetTimelineResponse.Type['info']['frames'],
  participantId: number,
): number {
  const participantDetails = matchDetails.info.participants.find(p => p.participantId === participantId);
  if (!participantDetails) throw new Error(`Participant not found for participantId: ${participantId}`);

  const teamId = participantDetails.teamId
  const teammates = matchDetails.info.participants.filter(p => p.teamId === teamId && p.participantId !== participantId);

  let killsAt14 = 0;
  let assistsAt14 = 0;
  let teamKillsAt14 = 0;

  for (const [i, frame] of Object.entries(frames)) {
    if (i === "15") break; // Stop at the 15th frame (14 minutes)
    for (const event of frame.events) {
      if (!('type' in event) || event.type !== "CHAMPION_KILL") continue;
      if (event.killerId === participantId) {
        killsAt14++;
        teamKillsAt14++;
      } else if (event.assistingParticipantIds?.includes(participantId)) {
        assistsAt14++;
        teamKillsAt14++;
      } else if (teammates.some(teammate => event.killerId === teammate.participantId)) {
        teamKillsAt14++;
      }
    }
  }

  return (killsAt14 + assistsAt14) / teamKillsAt14;
}
