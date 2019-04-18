import React, { Component } from 'react'

class ChartControls extends Component {

  render() {
    return (
      <div class="chart-controls">
        <table>
          <tr>
            <td>from:</td>
            <td><input /></td>
          </tr>
          <tr>
            <td>to:</td>
            <td><input /></td>
          </tr>
          <tr>
            <td>symbol:</td>
            <td><input /></td>
          </tr>
        </table>
        <br />
      </div>
    )
  }
}

export default ChartControls