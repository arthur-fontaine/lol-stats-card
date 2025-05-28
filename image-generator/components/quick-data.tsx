import type { Style } from "../style/style-state";
import { Datum } from "./datum";

interface QuickDataProps {
  quickData: { keyName: string; value: string }[];
  style: Style;
}

export const QuickData = (props: QuickDataProps) =>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 1,
    backgroundColor: props.style.palette.cardColor,
    padding: '2rem',
  }}>
    {
      props.quickData.map((data) =>
        <Datum {...data} style={props.style} />)
    }
  </div>
