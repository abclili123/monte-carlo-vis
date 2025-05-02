import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const MoveHeatmap = ({ treeData }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!treeData || !treeData.children) return;

    const width = 300;
    const height = 300;
    const cellSize = width / 3;

    const frequencies = Array(9).fill(0);
    treeData.children.forEach(child => {
      if (typeof child.move === 'number') {
        frequencies[child.move] += child.visits;
      }
    });

    const maxVisits = d3.max(frequencies) || 1;

    const colorScale = d3.scaleLinear()
      .domain([0, maxVisits])
      .range(["#ffffff", "#2166ac"]);

    const g = svg.append("g");

    for (let i = 0; i < 9; i++) {
      const x = (i % 3) * cellSize;
      const y = Math.floor(i / 3) * cellSize;

      g.append("rect")
        .attr("x", x)
        .attr("y", y)
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("fill", colorScale(frequencies[i]))
        .attr("stroke", "#333");

      g.append("text")
        .attr("x", x + cellSize / 2)
        .attr("y", y + cellSize / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "#000")
        .text(frequencies[i]);
    }

  }, [treeData]);

  return (
    <svg ref={svgRef} width={300} height={300} />
  );
};

export default MoveHeatmap;
