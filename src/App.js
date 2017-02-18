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

class ItemOpt extends Component {
  render() {
    const optObj = this.props.opt;
    const optName = optObj.subType === undefined ? optObj.typeName : optObj.subType;
    return (
      <li
        className={(this.props.opt.typeName === 'delete' ? 'delete-has-sub-opts ' : '') + optObj.iconFont}
        onClick={optObj.subType === undefined ? () => {this.props.onClick(optName)} : undefined}>
        { optObj.typeName === 'delete' &&
          <div>
            <span onClick={(e) => {this.props.onClick(optName[0])}}>Self</span>
            <span onClick={(e) => {this.props.onClick(optName[1])}}>Self & Subs</span>
          </div>
        }
      </li>
    )
  }
}

class AllItemOpts extends Component {
  render() {
    var itemOptList = itemOptTypes.map((opt, index) => (
          <ItemOpt opt={opt} key={opt.typeName + index} onClick={this.props.onClick}/>
        ));
    return (
      <div className="item-opt">
        <ul>
          {itemOptList}
        </ul>
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
      text: 'Mind map;)',
      isImportant: false
    };
    this.toggleOpt = this.toggleOpt.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleItemOpts = this.handleItemOpts.bind(this);
    this.toggleImportant = this.toggleImportant.bind(this);
  }

  toggleOpt() {
    this.setState({ showOpt: true });
  }

  toggleEditing() {
    this.setState({ onEditing: !this.state.onEditing });
  }

  handleInput(e) {
    this.setState({ text: e.target.value});
    // console.log(e.target.previousElementSibling.innerHTML);
    // e.target.style.width = e.target.previousElementSibling.clientWidth + 'px';
    // console.log(e.target.previousElementSibling.clientWidth);
    // console.log(e.target.clientWidth);
  }

  toggleImportant() {
    this.setState({ isImportant: !this.state.isImportant });
  }

  addItem(e) {
    // TODO: add corresponding item
  }

  handleItemOpts(optType) {
    console.log(this);
    switch (optType) {
      case 'make-important':
        this.toggleImportant();

        break;
      default:

    }
  }

  render() {
    return (
      <div className={"item" + (this.state.isImportant ? " important" : "")}>
        <ItemView
          onClick={this.toggleOpt}
          onDoubleClick={this.toggleEditing}
          text={this.state.text}
        />
        { this.state.onEditing && (
          <ItemEdit
            value={this.state.text}
            onChange={this.handleInput}
            onBlur={this.toggleEditing}
         /> )
        }
        { this.state.showOpt &&
          <AllItemOpts onClick={this.handleItemOpts}/>
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
  }, {
    typeName: 'insert-img',
    iconFont: 'fontawesome-picture'
  }, {
    typeName: 'number-children',
    iconFont: 'fontawesome-list-ol'
  }, {
    typeName: 'copy',
    iconFont: 'fontawesome-copy'
  }, {
    typeName: 'paste',
    iconFont: 'fontawesome-paste'
  }, {
    typeName: 'cut',
    iconFont: 'fontawesome-cut'
  }, {
    typeName: 'delete',
    iconFont: 'fontawesome-remove',
    subType: ['delete-self', 'delete-self-and-subs']
  }];

export default App;
