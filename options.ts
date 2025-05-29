import { riftPipeline } from "./statistics/game-mode/rift-pipeline";
import { middlePositionalPipeline } from "./statistics/position/middle/middle-positional-pipeline";

export const pipelines = {
  'game-mode/rift': riftPipeline,
  'position/middle': middlePositionalPipeline,
} as const;

export { paletteColors } from './image-generator/style/palette-colors'
