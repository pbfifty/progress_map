import React from "react";
import { Text } from "@visx/text";
import { wrap } from "@visx/text";

const AreaLabel = ({ x, y, width, height, text, i }) => { 
  return (
    <>
        <defs>
        <clipPath id={`clip-${i}-2`}>
          <rect x={x} y={y-5} width={width - 10} height={height+8} />
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
        y={y + height / 2 - 6}
        width={width + 40}
        fontSize={10}
        fontFamily="Arial"
        textAnchor="start"
        fill="#000"
        clipPath={`url(#clip-${i}-2)`}
        verticalAnchor="start"
      >
        {text}
      </Text>
    </>
  );
};

export default AreaLabel;