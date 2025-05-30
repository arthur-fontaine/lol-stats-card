import type { Style } from "../style/style-state";
import type { IPosition } from "../types/position";
import fs from 'node:fs';
import path from "node:path";

interface PlayerNameProps {
  name: string;
  tag: string;
  position: IPosition;
  style: Style;
}

export const PlayerName = (props: PlayerNameProps) => {
  const positionIconBuffer = fs.readFileSync(
    path.resolve(__dirname, `../assets/icons/${props.position}.png`)
  );

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: '2rem',
      left: '2rem',
      backgroundColor: props.style.palette.cardColor,
      padding: '1rem',
    }}>
      <img
        src={`data:image/png;base64,${positionIconBuffer.toString('base64')}`}
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'contain',
          marginRight: '1rem',
        }}
      />
      <span style={{
        color: props.style.palette.textColor,
        fontSize: '60px',
        textTransform: 'uppercase',
      }}>
        {props.name}
      </span>
    </div>
  );
};
