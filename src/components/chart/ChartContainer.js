import React, { Component } from 'react'
import Chart from './Chart';
import ChartControls from './ChartControls';

class ChartContainer extends Component {

  render() {
    return (
      <div>
        <Chart />
        <ChartControls />
      </div>
    )
  }
}

export default ChartContainer