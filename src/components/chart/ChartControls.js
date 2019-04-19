import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

class ChartControls extends Component {

  componentDidMount() {
    this.refs.from.value = this.props.from;
    this.refs.to.value = this.props.to;
    this.refs.symbol.value = this.props.symbol;
  }

  componentWillReceiveProps(newProps) {
    this.refs.from.value = newProps.from;
    this.refs.to.value = newProps.to;
    this.refs.symbol.value = newProps.symbol;
  }

  render() {
    return (
      <div class="chart-controls">
        <table>
          <tr>
            <td>from:</td>
            <td><input ref="from" onBlur={event => this.props.onFromChange(event.target.value)}/></td>
          </tr>
          <tr>
            <td>to:</td>
            <td><input ref="to" onBlur={event => this.props.onToChange(event.target.value)}/></td>
          </tr>
          <tr>
            <td>symbol:</td>
            <td>
              <select ref="symbol" onChange={event => this.props.onSymbolChange(event.target.value)}>
                {this.props.symbols.map(symbol => <option key={symbol} value={symbol}>{symbol}</option>)}
              </select>
            </td>
          </tr>
        </table>
        <br />
      </div>
    )
  }
}

const graphqlQuery = gql`{
  symbols { name }
}
`

export default function WrappedChartControls(props) {
  return (
    <Query query={graphqlQuery} >
      {({ data, loading, error }) => {
        if (loading) return <div>loading</div>;
        if (error) return <p>ERROR</p>;

        return (
          <ChartControls
            symbols={data.symbols.map(s => s.name)}
            {...props}
            />
        );
      }}
    </Query>
  );
};