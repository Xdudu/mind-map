import React, { Component } from 'react';
import './App.css';

class ItemView extends Component {
  render() {
    return (
      <label className="item-view">Mind Map</label>
    )
  }
}

class ItemOpt extends Component {
  render() {
    return (
      <div className="item-opt">
        <ul>
          <li className="fontawesome-bolt" />
          <li className="fontawesome-picture" />
          <li className="fontawesome-list-ol" />
          {/* <li className="fontawesome-chevron-up" /> */}
          <li className="fontawesome-copy" />
          <li className="fontawesome-paste" />
          <li className="fontawesome-cut" />
          <li className="fontawesome-remove" />
        </ul>
      </div>
    )
  }
}

class ItemEdit extends Component {
  render() {
    return (
      <input className="item-edit" type="text" size="0" />
    )
  }
}

class ThoughtItem extends Component {
  constructor() {
    super();
    this.state = {
      enableOpt: true,
      onEditing: true
    };
  }
  render() {
    return (
      <div className="item">
        <ItemView />
        { this.state.enableOpt &&
          <ItemOpt />
        }
        { this.state.onEditing &&
          <ItemEdit />
        }
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <ThoughtItem/>
    );
  }
}

export default App;
