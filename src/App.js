import React, { Component } from 'react';
import BTCSorter from './BTCSorter';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_INDV = 'http://54.213.83.132/hackoregon/http/oregon_individual_contributors/';
const API_BIZ  = 'http://54.213.83.132/hackoregon/http/oregon_business_contributors/';

const styles = {
  sorterWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  sorterStyle: {
    border: '1px solid #ddd',
    width: '49%',
    padding: '1rem',
  }
}


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ind: {
        items: [],
        sortOrder: 'desc',
      },
      biz: {
        items: [],
        sortOrder: 'desc',
      },
      data: []
    };
    this.onRefreshForKey = this.onRefreshForKey.bind(this);
    this.onUpdateSortForKey = this.onUpdateSortForKey.bind(this);
    this.hitServer = this.hitServer.bind(this);
  }

// === es6 version w/ promise===
  hitServer() {
    return fetch('http://54.213.83.132/hackoregon/http/oregon_individual_contributors/5/')
      .then(response => response.json())
      .then(data => this.setState({ data: data }))
      .catch(error => console.log(error))
  }

  // === es5 version ===
  hitServer() {
    const self = this;
    return fetch('http://54.213.83.132/hackoregon/http/oregon_individual_contributors/5/')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        self.setState({ data: data })
      })
      .catch(function(error) {
        console.log(error)
      });
  }
  componentDidMount() {
    this.hitServer();
  }

  onRefreshForKey(key) {
    return async url => {
      let response = await fetch(url);
      let data = await response.json();
      this.setState({
        [key]: {
          ...this.state[key],
          items: data
        }
      });
    }
  }
  onUpdateSortForKey(key) {
    return order => {
      this.setState({
        [key]: {
          ...this.state[key],
          sortOrder: order
        }
      });
    }
  }
  render() {
    const { ind, biz } = this.state;
    return (
      <div className='container'>
        <h1>BTC Data Viewer</h1>
        <div style={styles.sorterWrapper}>
          <div style={styles.sorterStyle}>
            <h2 className='text-center'>Individuals</h2>
            <BTCSorter
              items={ind.items}
              sortOrder={ind.sortOrder}
              apiUrl={API_INDV}
              onRefresh={this.onRefreshForKey('ind')}
              onUpdateSortOrder={this.onUpdateSortForKey('ind')}
            />
          </div>
          <div style={styles.sorterStyle}>
            <h2 className='text-center'>Businesses</h2>
            <BTCSorter
              items={biz.items}
              sortOrder={biz.sortOrder}
              apiUrl={API_BIZ}
              onRefresh={this.onRefreshForKey('biz')}
              onUpdateSortOrder={this.onUpdateSortForKey('biz')}
            />
          </div>
        </div>
      </div>
    );
  }
}
