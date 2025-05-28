import type { Style, StyleState } from "../style/style-state";
import { ChampionDistribution } from "./champion-distribution";
import { Datum } from "./datum";
import { PlayerFrame } from "./player-frame";
import { QuickData } from "./quick-data";
import { WinDistribution } from "./win-distribution";

interface StatisticsPageProps {
  quickData: { keyName: string; value: string }[];
  highlightedDatum: { keyName: string; value: string };
  player: Omit<Parameters<typeof PlayerFrame>[0], 'style'>;
  wins: number;
  losses: number;
  champions: { name: string; imageUrl: string; count: number }[];
  style: Style;
}

export const StatisticsPage = (props: StatisticsPageProps) =>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    backgroundColor: props.style.palette.backgroundColor,
    color: props.style.palette.textColor,
    fontSize: '110px',
    padding: '2rem',
    letterSpacing: '-0.02em',
  }}>

    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
      <QuickData {...props} />
      <PlayerFrame {...props.player} style={props.style} />
    </div>

    <div style={{ display: 'flex', justifyContent: 'center', fontSize: '300px', fontWeight: 'bold' }}>
      <Datum {...props.highlightedDatum} style={props.style} />
    </div>

    <div style={{
      display: 'flex',
      gap: '1rem',
      backgroundColor: props.style.palette.cardColor,
      flex: 1,
    }}>
      <WinDistribution {...props} />
      <ChampionDistribution {...props} />
    </div>

  </div>
