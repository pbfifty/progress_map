import React, { useState, useEffect } from 'react';
import { Tooltip }  from 'react-tooltip';
import { Text } from "@visx/text";
import { Group } from '@visx/group';
import 'react-tooltip/dist/react-tooltip.css'
import {
  Treemap,
  hierarchy,
  stratify,
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
} from '@visx/hierarchy';
import shakespeare from '@visx/mock-data/lib/mocks/shakespeare';
import { scaleLinear } from '@visx/scale';

import AreaLabel from "./AreaLabel";
import { getTooltipContent } from "./tree_utils";

const color = ['rgba(23, 190, 207, 0.8)', 'rgba(31, 119, 180, 0.8)', 'rgba(44, 160, 44, 0.8)', 'rgba(214, 39, 40, 0.8)'];

const sectorColors = { "Finance, insurance, real estate, rental, and leasing": "#A8DBFF", "Manufacturing": "#C9E4FC", "Professional and business services": "#D8ECFD", "Educational services, health care, and social assistance": "#E8F4FE", "Wholesale trade": "#F7FBFF", "Retail trade": "#FBF7FF", "Construction": "#F4E6FF", "Transportation and warehousing": "#EDD4FF", "Information": "#E5C3FF", "Utilities": "#C9E4FC", "Mining": "#F7FBFF", "Arts, entertainment, recreation, accommodation, and food services": "#FFF","Other services, except government":"#FFF","Agriculture, forestry, fishing, and hunting":"#FFF"}

export const color1 = '#f3e9d2';
const color2 = '#4281a4';
export const background = '#555';

const colorScale = scaleLinear({
  domain: [0, Math.max(...shakespeare.map((d) => d.size ?? 0))],
  range: [color2, color1],
});

const tileMethods = {
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
};

const defaultMargin = { top: 0, left: 10, right: 10, bottom: 0 };

export default function CustomTreemap({ width, height, margin = defaultMargin, hierarchyData, unitType }) {
  const [hoveredNode, setHoveredNode] = useState(null);

  const data = stratify()
  .id((d) => d.id)
  .parentId((d) => d.parent)(hierarchyData)
  .sum((d) => d.size ?? 0);

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const root = hierarchy(data).sort((a, b) => (b.value || 0) - (a.value || 0));

  const setHoveredNodeAndLog = function(newHoveredNode){
    console.log(newHoveredNode)
    setHoveredNode(newHoveredNode)
    console.log(newHoveredNode)
  }

    const getFontSize = function(node, nodeWidth) {
      const maxFontSize = node.depth === 1 ? 16 : 14; // max font size in pixels
      const minFontSize = node.depth === 1 ? 12 : 8;  // min font size in pixels
  
      // if (!node.descendants) {
        // debugger
      // }

      // Approximate width of a character in pixels - this is a rough estimate
      const charWidth = node.depth === 1 ? 8 : 6;
  
      // Calculate the width of the text
      const textWidth = node.data.id.length * charWidth;
  
      // Calculate the font size
      let fontSize = maxFontSize;
      if (textWidth > nodeWidth) {
          // Scale down font size if text is too long
          fontSize = Math.max(minFontSize, (nodeWidth / textWidth) * maxFontSize);
      }
  
      return fontSize + 'px';
    };

    const getStyles = function(node){
      let styles = { zIndex: 9999, outline: 'none' }
      if (node.depth === 1) {
        styles.backgroundColor = "#fff"
        return styles
      } else {
        return styles
      }
    }

  return width < 10 ? null : (
    <div>
      <div>
        <svg width={width} height={height}>
          <Treemap
            top={margin.top}
            root={root}
            size={[xMax, yMax]}
            tile={tileMethods["treemapBinary"]}
            paddingTop={30}
            round
          >
            {(treemap) => (
              <Group>
              {treemap
                .descendants()
                // .reverse()
                .map((node, i) => {
                  const nodeWidth = node.x1 - node.x0;
                  const nodeHeight = node.y1 - node.y0;
                  const labelPadding = 4;
                  return (
                    <Group
                      key={`node-${i}`}
                      top={node.y0 + margin.top}
                      left={node.x0 + margin.left}
                    >
                      {node.depth === 1 && (
                        <rect
                          width={nodeWidth}
                          height={nodeHeight}
                          stroke={background}
                          strokeWidth={4} // main padding stroke
                          fill={sectorColors[node.data.id]}  
                          pointerEvents="none"/>
                      )}
                      {node.depth === 2 && (
                        <rect
                          width={nodeWidth}
                          height={nodeHeight}
                          stroke={background}
                          strokeWidth={1}
                          fill="transparent"  
                          pointerEvents="none"                      
                        />
                      )}
                      {node.depth > 2 && (
                        <rect
                          width={nodeWidth}
                          height={nodeHeight}
                          stroke={background}
                          strokeWidth={1}
                          fill="transparent"
                          pointerEvents="none"
                        />
                      )}
                        <defs>
                            <clipPath id={`clip-${i}`}>
                            <rect x={0} y={0} width={nodeWidth - 8} height={100} />
                            </clipPath>
                        </defs>
                        {node.depth === 1 && (
                          <>
                            <text
                              x={7}
                              y={15}
                              // width={nodeWidth - 8}
                              dy={2*(node.depth) - 1.5 + "em"}
                              fontSize={getFontSize(node, nodeWidth)}
                              fontFamily="Arial"
                              textAnchor="start"
                              fontWeight={"bold"}
                              style={getStyles(node)}
                              fill={node.depth === 1 ? "#111" : '#333'}
                              clipPath={`url(#clip-${i})`}
                              data-tooltip-id="map-tooltip"
                              data-tooltip-content={getTooltipContent(node, hierarchyData, unitType)}
                              data-tooltip-place="mouse"
                              onMouseEnter={() => setHoveredNodeAndLog(node)}
                              onMouseLeave={() => setHoveredNode(null)}
                            >
                              {node.data.id}
                            </text>
                          </>
                        )}
                        {/* Consider breaking this out into "subLabel" */}
                        {node.depth === 2 && (
                          <>
                            <Text
                              x={7}
                              y={8 - node.depth*1.5}
                              // dy={2 * node.depth - 1.5 + "em"}
                              width={250}
                              fontSize={12}
                              fontFamily="Arial"
                              textAnchor="start"
                              style={getStyles(node)}
                              fill={'#000'}
                              clipPath={`url(#clip-${i})`}
                              verticalAnchor='start'
                              data-tooltip-id="map-tooltip"
                              data-tooltip-content={getTooltipContent(node, hierarchyData, unitType)}
                              data-tooltip-place="mouse"
                              onMouseEnter={() => setHoveredNodeAndLog(node)}
                              onMouseLeave={() => setHoveredNode(null)}
                            >  
                              {node.data.id}
                            </Text>
                          </>
                        )}
                        {node.depth >= 3 && (
                          <AreaLabel
                            x={4.5}
                            y={0}
                            width={nodeWidth}
                            height={nodeHeight}
                            text={node.data.id}
                            i={i+node.depth}
                            hierarchy={hierarchyData}
                            mouseEnter={() => setHoveredNodeAndLog(node)}
                            mouseLeave={() => setHoveredNode(null)}
                            node={node}
                            unitType={unitType}
                          />
                        )}                        
                    </Group>
                  );
                })}
            </Group>
            )}
          </Treemap>
        </svg>
        <Tooltip id="map-tooltip" noArrow="true">
            <div></div>
        </Tooltip>
      </div>
    </div>
  );
}

