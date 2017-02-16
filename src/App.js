import React, { Component } from 'react';
import './App.css';

class ItemView extends Component {
  render() {
    return (
      <label
        className="item-view"
        onClick={this.props.onClick}
        onDoubleClick={this.props.onDoubleClick} >
        {this.props.text}
      </label>
    )
  }
}

class ItemOpt extends Component {
  render() {
    var itemOptList = itemOptTypes.map((opt, index) => (
          <li key={'item'+index} className={'remove-item ' + opt.iconFont}>
            { (opt.typeName === 'delete') &&
              <div className="item-opt-remove">
                <span className={opt.subType[0]}> Self</span>
                <span className={opt.subType[1]}> Self & Subs</span>
              </div>
            }
          </li>
        ));
    return (
      <div className="item-opt" onClick={this.props.onClick}>
        <ul>
          {itemOptList}
        </ul>
      </div>
    )
  }
}

class ItemEdit extends Component {
  render() {
    return (
      <textarea
        className="item-edit"
        type="text"
        rows="10"
        autoFocus="true"
        value={this.props.value}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
      />
    )
  }
}

class AddItem extends Component {
  render() {
    return (
      <div className="add-item" onClick={this.props.onClick}>
        <div className="add-item-sibling fontawesome-angle-down"></div>
        <div className="add-item-parent fontawesome-angle-left"></div>
        <div className="add-item-child fontawesome-angle-right"></div>
      </div>
    )
  }
}

class ThoughtItem extends Component {
  constructor() {
    super();
    this.state = {
      showOpt: false,
      onEditing: false,
      text: 'Mind map;)'
    };
    this.toggleOpt = this.toggleOpt.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  toggleOpt() {
    this.setState({ showOpt: true });
  }

  toggleEditing() {
    this.setState({ onEditing: !this.state.onEditing });
  }

  handleInput(e) {
    this.setState({ text: e.target.value});
  }

  addItem(e) {
    // TODO: add corresponding item
  }

  handleItemOpts(e) {
    const optType = e.target.className.split(' ')[0]
  }

  render() {
    return (
      <div className="item">
        <ItemView
          onClick={this.toggleOpt}
          onDoubleClick={this.toggleEditing}
          text={this.state.text}
        />
        { this.state.showOpt &&
          <ItemOpt onClick={this.handleItemOpts}/>
        }
        { this.state.onEditing && (
          <ItemEdit
            value={this.state.text}
            onChange={this.handleInput}
            onBlur={this.toggleEditing}
         /> )
        }
        <AddItem onClick={this.addItem}/>
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

var itemOptTypes = [{
    typeName: 'make-important',
    iconFont: 'fontawesome-bolt'
  },{
    typeName: 'insert-img',
    iconFont: 'fontawesome-picture'
  },{
    typeName: 'number-children',
    iconFont: 'fontawesome-list-ol'
  },{
    typeName: 'copy',
    iconFont: 'fontawesome-copy'
  },{
    typeName: 'paste',
    iconFont: 'fontawesome-paste'
  },{
    typeName: 'cut',
    iconFont: 'fontawesome-cut'
  },{
    typeName: 'delete',
    iconFont: 'fontawesome-remove',
    subType: ['delete-self', 'delete-self-and-subs']
  }];

export default App;
