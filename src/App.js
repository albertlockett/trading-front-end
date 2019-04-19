import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import './App.css';
import client from './graphql-client'
import ChartContainer from './components/chart/ChartContainer'

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <br />
          <ChartContainer />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
