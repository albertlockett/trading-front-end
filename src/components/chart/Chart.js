import React, { Component } from 'react';
import * as d3 from 'd3';
import './chart.css'
import data from './data'

class Chart extends Component {

  constructor(props, context) {
    super(props, context)

    // this.data = [
    //   { open: 1, close: 2 },
    //   { open: 2, close: 5 },
    //   { open: 5, close: 3 },
    //   { open: 2, close: 1 },
    //   { open: 4, close: 2 },
    //   { open: 2, close: 5 },
    //   { open: 5, close: 10 },
    //   { open: 3, close: 1 },
    //   { open: 1, close: 2 },
    //   { open: 18, close: 20 },
    //   { open: 19, close: 3 },
    //   { open: 3, close: 1 },
    // ]
    this.data = data;
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    console.log("IT RAN!");
    
    const height = 300;
    const width = 1500;

    const maxPrice = d3.max(this.data, d => Math.max(d.open, d.close))
    const minPrice = d3.min(this.data, d => Math.min(d.open, d.close))

    console.log({ minPrice, maxPrice, diff: maxPrice - minPrice})

    const yScale = d3.scaleLinear()
      .domain([minPrice, maxPrice])
      .range([height, 0]);

    const barContainerWidth = width / this.data.length;
    
    const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart-container");
                  
    svg.selectAll("rect")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * barContainerWidth)
      .attr("y", d => yScale(Math.max(d.open, d.close)))
      .attr("width", barContainerWidth - 2)
      .attr("height", (d, i) => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", (d, i) => {
        if (d.open < d.close) {
          return "green"
        } else {
          return "red"
        }
      })
  }

  render() {
    return (
      <h1>Chart</h1>
    )
  }
}

export default Chart;