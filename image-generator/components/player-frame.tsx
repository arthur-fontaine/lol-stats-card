import type { Style } from "../style/style-state";
import type { IPosition } from "../types/position";
import { PlayerName } from "./player-name";

interface PlayerFrameProps {
  name: string;
  tag: string;
  imageUrl: string;
  position: IPosition;
  style: Style;
}

export const PlayerFrame = (props: PlayerFrameProps) =>
  <div style={{
    display: 'flex',
    flex: 1,
  }}>

    <img src={props.imageUrl} style={{
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
    }} />

    <PlayerName {...props} />

  </div>
