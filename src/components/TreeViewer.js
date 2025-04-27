import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const TreeViewer = ({ treeData, selectedNode, selectedNodeId, onSelectNode }) => {
  const svgRef = useRef();
  const gRef = useRef();
  const zoomRef = useRef();
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!treeData) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    g.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const layoutWidth = width - margin.left - margin.right;
    const layoutHeight = height - margin.top - margin.bottom;

    const root = d3.hierarchy(treeData, d => d.children || []);
    const treeLayout = d3.tree().size([layoutWidth, layoutHeight]);
    treeLayout(root);

    const treeG = g.append("g").attr("class", "tree-content");
    const linksG = treeG.append("g").attr("class", "links");
    const nodesG = treeG.append("g").attr("class", "nodes");

    linksG.selectAll(".link")
      .data(root.links())
      .enter()
      .append("line")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    const getColorForDepth = (depth) => (depth % 2 === 0 ? 'lightblue' : '#fcbba1');

    const nodeGroup = nodesG.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        onSelectNode(d.data);
        setTooltip({
          player: d.data.player || 'Unknown',
          wins: d.data.wins,
          visits: d.data.visits
        });

        nodesG.node().appendChild(event.currentTarget);

        const scale = 2;
        const translateX = width / 2 - scale * (d.x);
        const translateY = height / 2 - scale * (d.y);

        svg.transition()
          .duration(750)
          .call(
            zoomRef.current.transform,
            d3.zoomIdentity.translate(translateX, translateY).scale(scale)
          )
      });

    nodeGroup.append("circle")
      .attr("r", 20)
      .attr("fill", d => {
        if (selectedNode && selectedNode.id === d.data.id) return "gold";
        if (selectedNodeId && selectedNodeId === d.data.id) return "lightgreen";
        return getColorForDepth(d.depth);
      })
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    nodeGroup.append("text")
      .attr("dy", 5)
      .attr("text-anchor", "middle")
      .text(d => `${d.data.wins}/${d.data.visits}`)
      .style("font-size", "12px")
      .style("pointer-events", "none");

    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => g.attr("transform", event.transform));

    svg.call(zoomBehavior);
    zoomRef.current = zoomBehavior;

  }, [treeData, selectedNode, selectedNodeId, onSelectNode]);

  const resetZoom = () => {
    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(750)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(40, 40));
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width={600} height={400} className="bg-white shadow-md rounded overflow-hidden">
        <g ref={gRef} transform="translate(40,40)" />
        <foreignObject x={500} y={10} width={90} height={35}>
          <button onClick={resetZoom} style={{ width: '80px', height: '35px', background: 'white', fontSize: '12px', color: 'black', borderRadius: '4px', border: 'black 1px solid' }}>Reset Zoom</button>
        </foreignObject>
      </svg>
      {tooltip && (
        <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white', border: '1px solid black', padding: '8px', borderRadius: '4px', maxWidth: '250px' }}>
          <strong>Node Info:</strong>
          <div>Player: {tooltip.player}</div>
          <div>Win Rate: {tooltip.wins} / {tooltip.visits}</div>
        </div>
      )}
    </div>
  );
};

export default TreeViewer;
