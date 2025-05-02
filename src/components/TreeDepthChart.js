import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TreeDepthChart = ({ treeData }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!treeData) return;

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const root = d3.hierarchy(treeData, d => d.children);
    const nodes = root.descendants();

    const depthCounts = d3.rollup(
      nodes,
      v => v.length,
      d => d.depth
    );

    const data = Array.from(depthCounts, ([depth, count]) => ({ depth, count }));

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.depth))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([height - margin.bottom, margin.top]);

    const g = svg.append("g");

    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.depth))
      .attr("y", d => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.count))
      .attr("fill", "#3182bd");

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Depth");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -30)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Number of Nodes");

  }, [treeData]);

  return (
    <svg ref={svgRef} width={400} height={300} />
  );
};

export default TreeDepthChart;
