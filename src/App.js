import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Chart from './components/chart/Chart'

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Test</h1>
        <Chart />
      </div>
    );
  }
}

export default App;
