import { Box } from "@chakra-ui/react";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  KEY_SHOW_TILES_BACKGROUND,
  DEFAULT_SHOW_TILES_BACKGROUND,
  GLASSWARE_SVG_VIEWBOX_SIZE,
  GLASSWARE_SVG_PATHS,
  BEER_COLOR,
  FOAM_COLOR,
  OUTLINE_COLOR,
} from "../../lib/constants.js";

const TILE_SIZE = 500;
const PATTERN_SIZE = TILE_SIZE * 2;
const OPACITY = 0.03;

export default function BackgroundTiles({ glass }) {
  const [showTilesBackground] = useLocalStorage(KEY_SHOW_TILES_BACKGROUND, DEFAULT_SHOW_TILES_BACKGROUND);

  const { beer: beerPath, foam: foamPath, outline: outlinePath } = GLASSWARE_SVG_PATHS[glass];

  const renderGlass = (x, y, rotation = "") => (
    <svg
      x={x}
      y={y}
      width={TILE_SIZE}
      height={TILE_SIZE}
      viewBox={`0 0 ${GLASSWARE_SVG_VIEWBOX_SIZE} ${GLASSWARE_SVG_VIEWBOX_SIZE}`}
      transform={rotation}
    >
      <path d={beerPath} fill={BEER_COLOR} />
      <path d={foamPath} fill={FOAM_COLOR} />
      <path d={outlinePath} fill={OUTLINE_COLOR} />
    </svg>
  );

  return (
    <Box position="fixed" inset="0" overflow="hidden" bg="gray.50" pointerEvents="none" userSelect="none">
      {showTilesBackground && (
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="beer-tiles"
              width={PATTERN_SIZE}
              height={PATTERN_SIZE}
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              {renderGlass(0, 0)}
              {renderGlass(TILE_SIZE, 0, `rotate(270 ${TILE_SIZE + TILE_SIZE / 2} ${TILE_SIZE / 2})`)}
              {renderGlass(0, TILE_SIZE, `rotate(270 ${TILE_SIZE / 2} ${TILE_SIZE + TILE_SIZE / 2})`)}
              {renderGlass(TILE_SIZE, TILE_SIZE)}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#beer-tiles)" opacity={OPACITY} />
        </svg>
      )}
    </Box>
  );
}
