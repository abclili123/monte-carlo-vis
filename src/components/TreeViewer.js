import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreeViewer = ({ treeData, selectedNode, selectedNodeId, onSelectNode }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!treeData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear old tree

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const layoutWidth = width - margin.left - margin.right;
    const layoutHeight = height - margin.top - margin.bottom;

    const root = d3.hierarchy(treeData, d => d.children || []);
    const treeLayout = d3.tree().size([layoutWidth, layoutHeight]);
    treeLayout(root);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw links
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", "black");

    // Node color function based on depth
    const getColorForDepth = (depth) => {
      return depth % 2 === 0 ? 'lightblue' : '#fcbba1'; // player move vs opponent move
    };

    // Draw nodes
    const nodeGroup = g.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .on("click", (event, d) => onSelectNode(d.data)); // important fix for D3 v7

    nodeGroup.append("circle")
      .attr("r", 20)
      .attr("fill", d => {
        if (selectedNode && selectedNode.id === d.data.id) {
          return "gold"; // Manually selected
        }
        if (selectedNodeId && selectedNodeId === d.data.id) {
          return "lightgreen"; // Chosen bot move
        }
        return getColorForDepth(d.depth); // Normal color
      })      
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    nodeGroup.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text(d => `${d.data.wins}/${d.data.visits}`)
      .style("font-size", "12px")
      .style("pointer-events", "none"); // Text doesn't block clicks
  }, [treeData, selectedNode, onSelectNode]);

  return (
    <svg ref={svgRef} width={600} height={400} className="bg-white shadow-md rounded" />
  );
};

export default TreeViewer;
