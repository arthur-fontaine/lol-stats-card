import type { Style } from "../style/style-state";

interface WinDistributionProps {
  wins: number;
  losses: number;
  style: Style;
}

export const WinDistribution = (props: WinDistributionProps) =>
  <div style={{
    display: 'flex',
    flex: 1,
    fontSize: '200px',
    fontWeight: 'bold',
  }}>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props.style.palette.specifics.win,
      color: 'white',
      flex: props.wins
    }}>
      {props.wins > 0 && <span>{props.wins}</span>}
    </div>

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: props.style.palette.specifics.loss,
      color: 'white',
      flex: props.losses
    }}>
      {props.losses > 0 && <span>{props.losses}</span>}
    </div>
  </div>
