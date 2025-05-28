import type { Style } from "../style/style-state";

interface PlayerFrameProps {
  name: string;
  tag: string;
  imageUrl: string;
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

    <span style={{
      backgroundColor: props.style.palette.cardColor,
      color: props.style.palette.textColor,
      padding: '1rem',
      position: 'absolute',
      bottom: '2rem',
      left: '2rem',
      fontSize: '60px',
      textTransform: 'uppercase',
    }}>
      {props.name}
    </span>

  </div>
