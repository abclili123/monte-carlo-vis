import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const TreeViewer = ({ treeData, selectedNode, selectedNodeId, onSelectNode }) => {
  const svgRef = useRef();
  const gRef = useRef();
  const zoomRef = useRef();
  const [tooltip, setTooltip] = useState(null);
  const initialTransformRef = useRef(null);

  // Helper to autoscale tree into view
  const autoscale = (root) => {
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    const nodes = root.descendants();

    const minX = d3.min(nodes, d => d.x);
    const maxX = d3.max(nodes, d => d.x);
    const minY = d3.min(nodes, d => d.y);
    const maxY = d3.max(nodes, d => d.y);

    const treeWidth = maxX - minX;
    const treeHeight = maxY - minY;

    const svgWidth = 700;
    const svgHeight = 400;

    const scale = Math.min(
      svgWidth / (treeWidth + 100),
      svgHeight / (treeHeight + 100)
    );

    const translateX = (svgWidth - treeWidth * scale) / 2 - minX * scale;
    const translateY = (svgHeight - treeHeight * scale) / 2 - minY * scale;

    const transform = d3.zoomIdentity
      .translate(translateX, translateY)
      .scale(scale);
    
    initialTransformRef.current = transform;

    g.attr("transform", `translate(${translateX},${translateY}) scale(${scale})`);
    svg.call(zoomRef.current.transform, transform);
  };

  useEffect(() => {
    if (!treeData) return;

    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);

    g.selectAll("*").remove();

    const width = 700;
    const height = 400;

    const root = d3.hierarchy(treeData, d => d.children);
    const treeLayout = d3.tree()
      .nodeSize([50, 75]);
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

        d3.select(gRef.current)
          .selectAll("circle")
          .attr("fill", n => {
            if (n.data && n.data.id === d.data.id) return "gold"; // clicked one
            if (selectedNodeId && n.data && n.data.id === selectedNodeId) return "lightgreen"; // previously best move
            return getColorForDepth(n.depth);
        });

        const svgWidth = 700;
        const svgHeight = 400;
        const zoomScale = 2;

        const translateX = svgWidth / 2 - d.x * zoomScale;
        const translateY = svgHeight / 2 - d.y * zoomScale;

        const transform = d3.zoomIdentity
          .translate(translateX, translateY)
          .scale(zoomScale);

        d3.select(svgRef.current)
          .transition()
          .duration(750)
          .call(zoomRef.current.transform, transform);

      });

    nodeGroup.append("circle")
      .attr("r", 20)
      .attr("fill", d => {
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
    
    setTimeout(() => {
      autoscale(root);
    }, 0);      

  }, [treeData]);

  useEffect(() => {
    if (!selectedNode) {
      setTooltip(null);
      resetZoom();
    }
  }, [selectedNode, treeData]);

  const resetZoom = () => {
    if (!initialTransformRef.current) return;
  
    d3.select(svgRef.current)
      .transition()
      .duration(750)
      .call(zoomRef.current.transform, initialTransformRef.current);
  };    

  return (
    <div style={{ position: 'relative' }}>
      <svg ref={svgRef} width={700} height={400}>
        <g ref={gRef} transform="translate(0,0)" />
        <foreignObject x={610} y={10} width={90} height={35}>
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
