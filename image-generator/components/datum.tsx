import type { Style } from "../style/style-state";

interface DatumProps {
  keyName: string;
  value: string;
  style: Style;
}

export const Datum = (props: DatumProps) =>
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
    <span>{props.value}</span>
    <span style={{ textTransform: 'uppercase', fontWeight: 'bold', color: props.style.palette.accentColor }}>
      {props.keyName.toUpperCase()}
    </span>
  </div>
