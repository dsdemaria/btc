import React, { Component } from 'react';

export default class BTCSorter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 5,
    };
  }
  componentDidMount() { // fetch initial data for each list/sorter
    this._doRefresh();
  }
  _doRefresh() {
    const { onRefresh, apiUrl } = this.props; // destructure
    const { count } = this.state;
    if (count > 0) {                    // only do
      onRefresh(`${apiUrl}${count}/`);  //
    }
  }

  onChangeInput(e) { // Validatate that amount is different before hitting server again
    if (e.target.value !== this.state.value) {
      this.setState({ count: e.target.value });
    }
  }

  onKeyDown(e) { // switch statement that looks for enter/return key through event.key
    switch (e.key) {
      case 'Enter': {
        this._doRefresh();
      }
    }
  }
  onSortClick(e) { // Ternary to update sortOrder filter ascending or descending
    e.preventDefault();
    let newOrder = this.props.sortOrder === 'asc' ? 'desc' : 'asc';
    this.props.onUpdateSortOrder(newOrder);
  }

  render() {
    const Sorter = () => (
      <a href='' onClick={this.onSortClick.bind(this)}>
        {this.props.sortOrder}
      </a>
    );

    return (
      <div>
        <div className='form-group' style={{ width: '50%' }}>
          <label htmlFor='count'>Amount</label>
          <input
            id='count'
            className='form-control'
            value={this.state.count}
            onChange={this.onChangeInput.bind(this)}
            onBlur={this._doRefresh.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            type='number' />
        </div>

        <table className='table table-striped'>
          <caption>
            <div>BTC Payees Info</div>
            <div>
              (Toggle sort order: <Sorter />)
            </div>
          </caption>
          <thead>
            <tr>
              <th>Payee</th>
              <th>Sum</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.items
                .sort((a, b) =>
                  this.props.sortOrder === 'asc' ?
                    a.sum - b.sum :
                    b.sum - a.sum
                ).map(item => {
                  return (
                    <tr key={item.contributor_payee}>
                      <td>{item.contributor_payee}</td>
                      <td>$ {item.sum.toFixed(2)}</td>
                    </tr>
                  )
                })
            }
          </tbody>
        </table>
      </div>
    );
  }
}
