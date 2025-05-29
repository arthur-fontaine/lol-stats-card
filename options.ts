import { riftPipeline } from "./statistics/game-mode/rift-pipeline";
import { middlePositionalPipeline } from "./statistics/position/middle/middle-positional-pipeline";
import { supportPositionalPipeline } from "./statistics/position/support/support-positional-pipeline";
import { topPositionalPipeline } from "./statistics/position/top/top-positional-pipeline";
import { bottomPositionalPipeline } from "./statistics/position/bottom/bottom-positional-pipeline";
import { junglePositionalPipeline } from "./statistics/position/jungle/jungle-positional-pipeline";

export const pipelines = {
  'game-mode/rift': riftPipeline,
  'position/middle': middlePositionalPipeline,
  'position/support': supportPositionalPipeline,
  'position/top': topPositionalPipeline,
  'position/bottom': bottomPositionalPipeline,
  'position/jungle': junglePositionalPipeline,
} as const;

export { paletteColors } from './image-generator/style/palette-colors'
