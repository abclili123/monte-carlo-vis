import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { interpolateRgb } from 'd3-interpolate';

const MoveConfidenceChart = ({ treeData }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!treeData || !treeData.children) return;

    const width = 500;
    const height = 500;
    const margin = { top: 40, right: 20, bottom: 100, left: 50 };
    const miniBoardSize = 30;

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom - miniBoardSize - 40;

    const moves = treeData.children.map(child => ({
      move: child.move,
      visits: child.visits,
      winRate: child.visits > 0 ? child.wins / child.visits : 0,
    }));

    const maxVisits = d3.max(moves, d => d.visits) || 1;

    const xScale = d3.scaleBand()
      .domain(moves.map(d => d.move))
      .range([0, chartWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, maxVisits])
      .range([chartHeight, 0]);

    const colorScale = (t) => {
      if (t < 0.5) {
        return interpolateRgb("red", "lightgray")(t * 2);
      } else {
        return interpolateRgb("lightgray", "green")((t - 0.5) * 2);
      }
    };

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .call(d3.axisLeft(yScale).ticks(5));

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -chartHeight/2)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text("Number of Visits");

    const bars = g.selectAll(".bar")
      .data(moves)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${xScale(d.move)},0)`);

    bars.append("rect")
      .attr("class", "bar")
      .attr("y", d => yScale(d.visits))
      .attr("width", xScale.bandwidth())
      .attr("height", d => chartHeight - yScale(d.visits))
      .attr("fill", d => colorScale(d.winRate))
      .on("mouseover", function(event, d) {
        const svg = d3.select(svgRef.current);
      
        const tooltip = svg.append("g")
          .attr("id", "tooltip")
          .style("pointer-events", "none")
          .style("opacity", 0);
      
        tooltip.append("rect")
          .attr("width", 80)
          .attr("height", 20)
          .attr("fill", "white")
          .attr("stroke", "black")
          .attr("rx", 4)
          .attr("ry", 4);
      
        tooltip.append("text")
          .attr("x", 5)
          .attr("y", 15)
          .attr("font-size", "11px")
          .attr("font-weight", "bold")
          .text(`${(d.winRate * 100).toFixed(1)}% win`);
      
        tooltip.transition()
          .duration(200)
          .style("opacity", 1);
      })
      .on("mousemove", function(event) {
        const [x, y] = d3.pointer(event, svgRef.current);
        const tooltipWidth = 80;
        let transx = x + 10;
        if (x + tooltipWidth > 400) {
          transx = x - tooltipWidth - 10;
        }
        d3.select(svgRef.current).select("#tooltip")
          .attr("transform", `translate(${transx},${y - 20})`);
      })
      .on("mouseout", function() {
        d3.select(svgRef.current).select("#tooltip").remove();
      });
      
    bars.append("g")
      .attr("transform", `translate(${xScale.bandwidth()/2 - miniBoardSize/2},${chartHeight + 10})`)
      .each(function(d) {
        const mini = d3.select(this);
        for (let i = 0; i < 9; i++) {
          mini.append("rect")
            .attr("x", (i % 3) * (miniBoardSize/3))
            .attr("y", Math.floor(i/3) * (miniBoardSize/3))
            .attr("width", miniBoardSize/3)
            .attr("height", miniBoardSize/3)
            .attr("fill", i === d.move ? "black" : "white")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);
        }
      });

    g.append("text")
      .attr("x", chartWidth/2)
      .attr("y", chartHeight + miniBoardSize + 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .text("Explored Moves");

    const legendY = chartHeight + miniBoardSize + 90;
    const legend = svg.append("g")
      .attr("transform", `translate(${width/2 - 100},${legendY})`);

    legend.append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "red" },
        { offset: "50%", color: "lightgray" },
        { offset: "100%", color: "green" }
      ])
      .enter()
      .append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    legend.append("rect")
      .attr("width", 200)
      .attr("height", 10)
      .attr("fill", "url(#legend-gradient)");

    legend.append("text")
      .attr("x", 0)
      .attr("y", 25)
      .attr("font-size", "10px")
      .text("Low Win Rate");

    legend.append("text")
      .attr("x", 200)
      .attr("y", 25)
      .attr("text-anchor", "end")
      .attr("font-size", "10px")
      .text("High Win Rate");

  }, [treeData]);

  return (
    <svg ref={svgRef} width={500} height={500} />
  );
};

export default MoveConfidenceChart;
