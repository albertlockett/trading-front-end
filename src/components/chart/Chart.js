import React, { Component } from 'react';
import * as d3 from 'd3';
import './chart.css'
import data from './data'

class Chart extends Component {

  constructor(props, context) {
    super(props, context)
    this.data = data;
    this.formatDateTick = this.formatDateTick.bind(this);
    // this.filterXAxis = this.filterXAxis.bind(this);
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

  colorTimeGrid(d, i) {
    const date = new Date(d.date.startTimestamp)
    return date.getMonth() % 2 === 1 ? "white" : "lightgray"
  }

  formatVolume(d) {
    if (d > 1e6) {
      return `${d/1e6}M`
    } else {
      return `${d/1e3}K`
    }
  }


  formatDateTick(d, i) {
    const date = new Date(d)
    return `${date.getFullYear()}-${d3.format('02i')(date.getMonth() + 1)}-${d3.format('02i')(date.getDate())}`
  }

  drawChart() {

    const height = 500;
    const width = 1500;
    const volumePart = 0.2;
    const margin = { top: 5, bottom: 30, right: 0, left: 40 }

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
      .domain([minPrice, maxPrice + margin.top])
      .range([(height - height * volumePart) - 25, 0])

    const volumeScale = d3.scaleLinear()
      .domain([0, maxVolume])
      .range([(height * volumePart) - margin.bottom, 0])

    const dateScale = d3.scaleBand()
      .domain(this.data.map(d => d.date.startTimestamp))
      .range([margin.left, width - margin.right]);

    // create axes
    const yTicksSpacing = 20; //px

    const priceAxis = d3.axisLeft(yScale)
      .ticks(Math.floor((height - height * volumePart) / yTicksSpacing))
      .tickPadding(4)
      .tickSize(0)
    
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
      .tickSize(0)
      .tickPadding(4)
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


    const xTickSpacing = 100;
    const dateAxis = d3.axisBottom(dateScale)
      .tickValues(dateScale.domain().filter((d, i) => i % Math.floor((width - margin.left) / xTickSpacing) === 0))
      .tickFormat(this.formatDateTick)

    // append date axis
    svg.append("g")
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(dateAxis)
      .call(g => g.select(".domain").remove())
      
    const barContainerWidth = width / this.data.length;

    // append rects for even/modd month
    svg.selectAll("rect.time-grid")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("x", d => dateScale(d.date.startTimestamp))
      .attr("y", 0)
      .attr("width", barContainerWidth)
      .attr("height", height - margin.bottom)
      .attr("fill", this.colorTimeGrid)
      .attr("class", "time-grid")

    // append open close prices
    svg.selectAll("rect.price")
      .data(this.data)
      .enter()
      .append("rect")
        // .attr("x", (d, i) => dateScale(i))
        .attr("x", (d) => dateScale(d.date.startTimestamp) + 1)
        .attr("y", d => yScale(Math.max(d.open, d.close)))
        .attr("width", barContainerWidth - 2)
        .attr("height", (d, i) => Math.abs(yScale(d.open) - yScale(d.close)))
        .attr("fill", (d, i) => this.color(d, i))
        .attr("class", "price")
    
    // append volume
    svg.selectAll("rect.volume")
      .data(this.data)
      .enter()    
      .append("rect")
      .attr("x", (d) => dateScale(d.date.startTimestamp) + 1)
        .attr("y", d => height - height * volumePart + volumeScale(d.volume))
        .attr("width", barContainerWidth - 2)
        .attr("height", (d, i) => volumeScale(0) - volumeScale(d.volume))
        .attr("fill", (d, i) => this.color(d, i))
        .attr("class", "volume")
    
    // append high/low lines
    svg.selectAll("line")
      .data(this.data)
      .enter()
      .append("line")
        .attr("x1", (d, i) => dateScale(d.date.startTimestamp) + barContainerWidth / 2)
        .attr("x2", (d, i) => dateScale(d.date.startTimestamp) + barContainerWidth / 2)
        .attr("y1", d => yScale(d.high))
        .attr("y2", d => yScale(d.low))
        .attr("stroke", (d, i) => this.color(d, i))
        .attr("strokeWidth", 5)
    

    var tooltip = d3.select("body")
      .append('div')
      .attr('class', 'tooltip');
  
    tooltip.append('div').attr('class', 'date');
    tooltip.html(`
      <div class="date"></div>
      <table>
        <tr><td>open</td><td class="open"></td></tr>
        <tr><td>close</td><td class="close"></td></tr>
        <tr><td>high</td><td class="high"></td></tr>
        <tr><td>low</td><td class="low"></td></tr>
        <tr><td>vol</td><td class="volume"></td></tr>
      </table>
    `)

    svg.selectAll("rect.time-grid, rect.price, rect.volume")
      .on('mouseover', d => {
        tooltip.style('display', 'block');
        tooltip.style('opacity', 2);
        tooltip.select('.date').html('<b>' + this.formatDateTick(d.date.startTimestamp) + '</b>')
        tooltip.select('.open').html(d.open)
        tooltip.select('.close').html(d.close)
        tooltip.select('.high').html(d.high)
        tooltip.select('.low').html(d.low)
        tooltip.select('.volume').html(d3.format(",")(d.volume))
      })
      .on('mousemove', d => {
        tooltip
          .style('top', (d3.event.layerY + 2) + 'px')
          .style('left', (d3.event.layerX + 2) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none')
        tooltip.style('opacity',0)
      })
  }

  render() {
    return (
      <h1>Chart</h1>
    )
  }
}

export default Chart;