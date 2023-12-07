import React, { useState, useEffect } from 'react';
import { Tooltip }  from 'react-tooltip';
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

import market_hierarchy from './market_hierarchy.json';
import AreaLabel from "./AreaLabel";


const healthcare_heirarchy = [
    { "id": "HealthCare", "parent": null, "size": null },
    { "id": "Therapeutics", "parent": "HealthCare", "size": null },
        { "id": "Cancer", "parent": "Therapeutics", "size": null },
            { "id": "Lung cancer", "parent": "Cancer", "size": 300 },
            { "id": "Breast cancer", "parent": "Cancer", "size": 500 },

        { "id": "Autoimmune", "parent": "Therapeutics", "size": null },
            { "id": "Rheumatoid arthritis", "parent": "Autoimmune", "size": 300 },
            { "id": "Other Autoimmune", "parent": "Autoimmune", "size": 400 },

        { "id": "Rare disease", "parent": "Therapeutics", "size": null },
            { "id": "Genetic disorders", "parent": "Rare disease", "size": 300 },
            { "id": "Other Rare disease", "parent": "Rare disease", "size": 200 },

    { "id": "Diagnostics", "parent": "HealthCare", "size": null },
        { "id": "Genetic sequencing screen", "parent": "Diagnostics", "size": 600 },
        { "id": "Imaging", "parent": "Diagnostics", "size": null },
            { "id": "MRI", "parent": "Imaging", "size": 500 },
            { "id": "Other Imaging", "parent": "Imaging", "size": 200 },
        { "id": "Other Diagnostics", "parent": "Diagnostics", "size": 200 },

    { "id": "Drug development", "parent": "HealthCare", "size": null },
        { "id": "Equipment", "parent": "Drug development", "size": 400 },
        { "id": "Materials", "parent": "Drug development", "size": 300 },
        { "id": "CRO type stuff", "parent": "Drug development", "size": null },
            { "id": "Vivariums", "parent": "CRO type stuff", "size": 100 },
            { "id": "Other CRO type stuff", "parent": "CRO type stuff", "size": 100 },
        
        { "id": "Clinical Trials", "parent": "Drug development", "size": null },
            { "id": "Phase I", "parent": "Clinical Trials", "size": 50 },
            { "id": "Phase II", "parent": "Clinical Trials", "size": 50 },
    
        { "id": "Second Clinical Trials", "parent": "Drug development", "size": null },
            { "id": "Phase B", "parent": "Second Clinical Trials", "size": 70 },
            { "id": "Phase C", "parent": "Second Clinical Trials", "size": 50 },

    { "id": "Health Tech", "parent": "HealthCare", "size": null },
        { "id": "Telemedicine", "parent": "Health Tech", "size": 300 },
        { "id": "EHR Systems", "parent": "Health Tech", "size": 200 },
]

const color = ['rgba(23, 190, 207, 0.8)', 'rgba(31, 119, 180, 0.8)', 'rgba(44, 160, 44, 0.8)', 'rgba(214, 39, 40, 0.8)'];

export const color1 = '#f3e9d2';
const color2 = '#4281a4';
export const background = '#555';

const colorScale = scaleLinear({
  domain: [0, Math.max(...shakespeare.map((d) => d.size ?? 0))],
  range: [color2, color1],
});

const data = stratify()
  .id((d) => d.id)
  .parentId((d) => d.parent)(market_hierarchy)
  .sum((d) => d.size ?? 0);

const tileMethods = {
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapResquarify,
  treemapSlice,
  treemapSliceDice,
};

const defaultMargin = { top: 10, left: 10, right: 10, bottom: 10 };

export default function TreemapDemo({ width, height, margin = defaultMargin }) {
    const [hoveredNode, setHoveredNode] = useState(null);

  const [tileMethod, setTileMethod] = useState('treemapSquarify');
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const root = hierarchy(data).sort((a, b) => (b.value || 0) - (a.value || 0));

  const setHoveredNodeAndLog = function(newHoveredNode){
    console.log(newHoveredNode)
    setHoveredNode(newHoveredNode)
    console.log(newHoveredNode)
  }

    const getTooltipContent = function(node){
        // Find the node with the specific id
        let target_node = healthcare_heirarchy.find(item => item.id === node.data.id);
        if (!node) return null; // Return null if node not found
    
        // Find children of the node
        let children = healthcare_heirarchy.filter(item => item.parent === node.data.id);
    
        // Sum children sizes
        // debugger
        // console.log(node.data.data.size)
        let sum = node.data.data.size || 0;
        for (let child of children) {
            if (child.size) {
                sum += child.size;
            }
        }
    
        return node.parent.data.id + " > " + node.data.id + ": " + sum;
    }

    const getFontSize = function(node, nodeWidth) {
      const maxFontSize = node.depth === 1 ? 16 : 14; // max font size in pixels
      const minFontSize = node.depth === 1 ? 12 : 7;  // min font size in pixels
  
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

    const getLabelY = function(node) {
      if (node.parent.y0 === node.y0) {
        return 28;
      } else {
        return 2;
      }
    }
  

    const getStyles = function(node){
      let styles = { pointerEvents: "none", zIndex: 9999 }
      if (node.depth === 1) {
        styles.backgroundColor = "#fff"
        return styles
      } else {
        return styles
      }
    }

  return width < 10 ? null : (
    <div>
      <label>tile method</label>{' '}
      <select
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setTileMethod(e.target.value)}
        value={tileMethod}
      >
        {Object.keys(tileMethods).map((tile) => (
          <option key={tile} value={tile}>
            {tile}
          </option>
        ))}
      </select>
      <div>
        <svg width={width} height={height}>
          <Treemap
            top={margin.top}
            root={root}
            size={[xMax, yMax]}
            tile={tileMethods[tileMethod]}
            paddingTop={30}
            round
          >
            {(treemap) => (
              <Group>
              {treemap
                .descendants()
                .reverse()
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
                          fill="transparent"  
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
                        //   data-tooltip-id="map-tooltip"
                        //     data-tooltip-content={getTooltipContent(node)}
                        //     data-tooltip-place="mouse"
                        //   onMouseEnter={() => setHoveredNodeAndLog(node)}
                        //   onMouseLeave={() => setHoveredNode(null)} 
                        />
                      )}
                      {node.depth > 2 && (
                        <rect
                          width={nodeWidth}
                          height={nodeHeight}
                          stroke={background}
                          strokeWidth={1}
                          fill={colorScale(node.value || 0)}
                          // data-tooltip-id="map-tooltip"
                            // data-tooltip-content={getTooltipContent(node)}
                            // data-tooltip-place="mouse"
                          // onMouseEnter={() => setHoveredNodeAndLog(node)}
                          // onMouseLeave={() => setHoveredNode(null)}
                        />
                      )}
                        <defs>
                            <clipPath id={`clip-${i}`}>
                            <rect x={0} y={0} width={nodeWidth - 8} height={100} />
                            </clipPath>
                        </defs>
                        {node.depth === 1 && (
                          <>
                          { node.descendants().length > 40 && (
                            <rect
                              x={4}
                              y={3}
                              width={nodeWidth - 8}
                              height={25}
                              stroke={background}
                              strokeWidth={.5}
                              fill="white"  
                              pointerEvents="none"/>
                          )}
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
                          >
                            {node.data.id}
                          </text>
                          </>
                        )}
                        {/* Consider breaking this out into "subLabel" */}
                        {node.depth === 2 && (
                          <>
                            { node.descendants().length > 1 && (
                              <rect
                                x={0}
                                y={0}
                                width={nodeWidth}
                                height={30}
                                stroke={background}
                                strokeWidth={.5}
                                fill="#fff"  
                                pointerEvents="none"/>
                            )}
                            <text
                              x={7}
                              y={20}
                              // dy={2 * node.depth - 1.5 + "em"}
                              width={250}
                              fontSize={getFontSize(node, nodeWidth)}
                              fontFamily="Arial"
                              textAnchor="start"
                              style={getStyles(node)}
                              fill={'#000'}
                              clipPath={`url(#clip-${i})`}
                            >  
                              {node.data.id}
                            </text>
                          </>
                        )}
                        {node.depth >= 3 && (
                          <AreaLabel
                            x={4.5}
                            y={nodeHeight / 2 - 12}
                            width={nodeWidth}
                            height={20}
                            text={node.data.id}
                            i={i}
                          />
                        )}
                    </Group>
                  );
                })}
            </Group>
            )}
          </Treemap>
        </svg>
        {/* <Tooltip id="map-tooltip" noArrow="true">
            <div>Example</div>
        </Tooltip> */}
      </div>
    </div>
  );
}

