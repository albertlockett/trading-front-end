import React, { Component } from 'react'
import Chart from './Chart';
import ChartControls from './ChartControls';

const LOCAL_STORAGE_VAR = 'chart_data'

export class ChartContainer extends Component {

  constructor(props, context) {
    super(props, context)

    if (localStorage.getItem(LOCAL_STORAGE_VAR)) {
      this.state = JSON.parse(localStorage.getItem(LOCAL_STORAGE_VAR))
    } else {
      this.state = {
        from: "2018-01-01",
        to: "2018-12-31",
        symbol: "AAPL"
      }
    }

    this.onFromChange = this.onFromChange.bind(this)
    this.onToChange = this.onToChange.bind(this)
    this.onSymbolChange = this.onSymbolChange.bind(this)
  }

  onFromChange(from) {
    if (from.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
      this.setState({ from })
      localStorage.setItem(LOCAL_STORAGE_VAR, JSON.stringify({ ...this.state, from }))
    }
  }

  onToChange(to) {
    if (to.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)) {
      this.setState({ to })
      localStorage.setItem(LOCAL_STORAGE_VAR, JSON.stringify({ ...this.state, to }))
    }
  }

  onSymbolChange(symbol) {
    this.setState({ symbol })
    localStorage.setItem(LOCAL_STORAGE_VAR, JSON.stringify({ ...this.state, symbol }))
  }

  render() {
    return (
      <div>
        <Chart from={this.state.from} to={this.state.to} symbol={this.state.symbol} />
        <ChartControls 
            from={this.state.from} 
            to={this.state.to} 
            symbol={this.state.symbol} 
            onFromChange={this.onFromChange} 
            onToChange={this.onToChange} 
            onSymbolChange={this.onSymbolChange} />
      </div>
    )
  }
}

export default ChartContainer