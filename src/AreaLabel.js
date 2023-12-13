import React from "react";
import { Text } from "@visx/text";
import { getTooltipContent } from "./tree_utils";

const AreaLabel = ({ x, y, width, height, text, i, hierarchy, mouseEnter, mouseLeave, node, unitType }) => {
  return (
    <>
        <defs>
        <clipPath id={`clip-${i}-2`}>
          <rect x={x} y={y-5} width={width - 10} height={height} />
        </clipPath>
      </defs>
      {/* <rect
        x={x}
        y={y}
        width={width - 10}
        height={height+30}
        fill="rgba(256, 256, 256, 0.5)"
        pointerEvents="none"
        clipPath={`url(#clip-${i}-2)`}
      /> */}
      <Text
        x={6}
        y={y + 5 + height / 20}
        width={width + 20}
        fontSize={12}
        fontFamily="Arial"
        textAnchor="start"
        fill="#000"
        clipPath={`url(#clip-${i}-2)`}
        verticalAnchor="start"
        data-tooltip-id="map-tooltip"
        data-tooltip-content={getTooltipContent(node, hierarchy, unitType)}
        data-tooltip-place="mouse"
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        style={{ outline: "none"}}
      >
        {text}
      </Text>
    </>
  );
};

export default AreaLabel;