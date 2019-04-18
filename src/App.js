import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ChartContainer from './components/chart/ChartContainer'

class App extends Component {
  render() {
    return (
      <div className="App">
        <br />
        <ChartContainer />
      </div>
    );
  }
}

export default App;
