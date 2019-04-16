import React, { Component } from 'react';
import * as d3 from 'd3';
import './chart.css'
import data from './data'

class Chart extends Component {

  constructor(props, context) {
    super(props, context)
    this.data = data;
  }

  componentDidMount() {
    this.drawChart();
  }

  /**
   * Color green or red depending on price move for period
   */
  color(d, i) {
    if (d.open < d.close) {
      return "green"
    } else {
      return "red"
    }
  }

  drawChart() {
    console.log("IT RAN!");
    
    const height = 300;
    const width = 1500;
    const volumePart = 0.2;

    const maxPrice = d3.max(this.data, d => Math.max(d.open, d.close))
    const minPrice = d3.min(this.data, d => Math.min(d.open, d.close))
    const maxVolume = d3.max(this.data, d => d.volume)

    console.log({ minPrice, maxPrice, diff: maxPrice - minPrice})

    const yScale = d3.scaleLinear()
      .domain([minPrice, maxPrice])
      .range([height - height * volumePart, 0]);

    const volumeScale = d3.scaleLinear()
      .domain([0, maxVolume])
      .range([height * volumePart, 0])

    const barContainerWidth = width / this.data.length;
    
    const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart-container");
                  
    svg.selectAll("rect.price")
      .data(this.data)
      .enter()
      .append("rect")
        .attr("x", (d, i) => i * barContainerWidth)
        .attr("y", d => yScale(Math.max(d.open, d.close)))
        .attr("width", barContainerWidth - 2)
        .attr("height", (d, i) => Math.abs(yScale(d.open) - yScale(d.close)))
        .attr("fill", (d, i) => this.color(d, i))
    
    svg.selectAll("rect.volume")
      .data(this.data)
      .enter()    
      .append("rect")
        .attr("x", (d, i) => i * barContainerWidth)
        .attr("y", d => height - height * volumePart + volumeScale(d.volume))
        .attr("width", barContainerWidth - 2)
        .attr("height", (d, i) => volumeScale(0) - volumeScale(d.volume))
        .attr("fill", (d, i) => this.color(d, i))
    
    svg.selectAll("line")
      .data(this.data)
      .enter()
      .append("line")
      .attr("x1", (d, i) => i * barContainerWidth + barContainerWidth / 2 - 1)
      .attr("x2", (d, i) => i * barContainerWidth + barContainerWidth / 2 - 1)
      .attr("y1", d => yScale(d.high))
      .attr("y2", d => yScale(d.low))
      .attr("stroke", (d, i) => this.color(d, i))
      .attr("strokeWidth", 5)
  }

  render() {
    return (
      <h1>Chart</h1>
    )
  }
}

export default Chart;