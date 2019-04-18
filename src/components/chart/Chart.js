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

  formatVolume(d) {
    if (d > 1e6) {
      return `${d/1e6}M`
    } else {
      return `${d/1e3}K`
    }
  }

  drawChart() {
    console.log("IT RAN!");
    
    const height = 500;
    const width = 1500;
    const volumePart = 0.2;
    const margin = { top: 0, bottom: 30, right: 0, left: 40 }

    const svg = d3.select("body")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "chart-container");

    // calculate range of price and volume (y values)
    const maxPrice = d3.max(this.data, d => Math.max(d.open, d.close))
    const minPrice = d3.min(this.data, d => Math.min(d.open, d.close))
    const maxVolume = d3.max(this.data, d => d.volume)

    // create scales
    const yScale = d3.scaleLinear()
      .domain([minPrice, maxPrice])
      .range([(height - height * volumePart) - 25, 0])

    const volumeScale = d3.scaleLinear()
      .domain([0, maxVolume])
      .range([(height * volumePart) - margin.bottom, 0])

    const dateScale = d3.scaleLinear()
      .domain([0, this.data.length])
      .range([margin.left, width - margin.right]);

    // create axes
    const yTicksSpacing = 20; //px

    
    const priceAxis = d3.axisLeft(yScale)
      .ticks(Math.floor((height - height * volumePart) / yTicksSpacing))
    
    // append price axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(priceAxis)
      .call(g => g.select(".domain").remove())

    const priceAxisGrid = d3.axisRight(yScale)
      .ticks(Math.floor((height - height * volumePart) / yTicksSpacing))
      .tickSize(width - margin.left, 1)
      .tickFormat("")

    // append price gridline
    svg.append("g")
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr('class', 'grid-line')
      .classed('y', true)
      .classed('grid', true)
      .call(priceAxisGrid)
      .call(g => g.select(".domain").remove())

    const volumeAxis = d3.axisLeft(volumeScale)
      .ticks(Math.floor(height * volumePart / yTicksSpacing))
      .tickFormat(this.formatVolume)
    
    // append volume axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},${height - height * volumePart})`)
      .call(volumeAxis)
      .call(g => g.select(".domain").remove())

    const volumeGrid = d3.axisRight(volumeScale)
      .ticks(Math.floor(height * volumePart / yTicksSpacing))
      .tickSize(width - margin.left, 1)
      .tickFormat("")
    
    // append volume grid line
    svg.append("g")
      .attr('transform', `translate(${margin.left}, ${height - height * volumePart})`)
      .attr('class', 'grid-line')
      .classed('y', true)
      .classed('grid', true)
      .call(volumeGrid)
      .call(g => g.select(".domain").remove())



    const barContainerWidth = width / this.data.length;
       
    // append open close prices
    svg.selectAll("rect.price")
      .data(this.data)
      .enter()
      .append("rect")
        .attr("x", (d, i) => dateScale(i))
        .attr("y", d => yScale(Math.max(d.open, d.close)))
        .attr("width", barContainerWidth - 2)
        .attr("height", (d, i) => Math.abs(yScale(d.open) - yScale(d.close)))
        .attr("fill", (d, i) => this.color(d, i))
    
    // append volume
    svg.selectAll("rect.volume")
      .data(this.data)
      .enter()    
      .append("rect")
        .attr("x", (d, i) => dateScale(i))
        .attr("y", d => height - height * volumePart + volumeScale(d.volume))
        .attr("width", barContainerWidth - 2)
        .attr("height", (d, i) => volumeScale(0) - volumeScale(d.volume))
        .attr("fill", (d, i) => this.color(d, i))
    
    // append high/low lines
    svg.selectAll("line")
      .data(this.data)
      .enter()
      .append("line")
        .attr("x1", (d, i) => dateScale(i) + barContainerWidth / 2 - 1)
        .attr("x2", (d, i) => dateScale(i) + barContainerWidth / 2 - 1)
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