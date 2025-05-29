import { Schema } from "effect";
import { paletteColors, pipelines } from "../../options";

export const TreatAccountParams = Schema.Struct({
  player: Schema.Struct({
    name: Schema.String,
    tag: Schema.String,
    imageUrl: Schema.String,
  }),
  paletteColor: Schema.Literal(...Object.keys(paletteColors) as (keyof typeof paletteColors)[]),
  pipelines: Schema.Array(Schema.Literal(...Object.keys(pipelines) as (keyof typeof pipelines)[])),
})
