import { Context, type Ref } from "effect";
import type { PaletteColor } from "./palette-colors";

export interface Style {
  palette: PaletteColor;
}

export class StyleState extends Context.Tag("StyleState")<
  StyleState,
  Ref.Ref<Style>
>() { }
