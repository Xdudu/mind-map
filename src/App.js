import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
      text: '',
      isImportant: false
    };
    this.toggleOpt = this.toggleOpt.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.dispatchItemOpts = this.dispatchItemOpts.bind(this);
    this.toggleImportant = this.toggleImportant.bind(this);
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.onEditing === true) {
      var thisThoughtItemNode = ReactDOM.findDOMNode(this);
      var thisItemViewNode = thisThoughtItemNode.firstElementChild;
      var thisItemEditNode = thisItemViewNode.nextElementSibling;
      thisItemEditNode.style.width = thisItemViewNode.clientWidth + 1 + 'px';
    }
  }

  toggleOpt() {
    this.setState({ showOpt: true });
  }

  toggleEditing() {
    this.setState({ onEditing: !this.state.onEditing });
  }

  handleInput(e) {
    var tempText = e.target.value;
    // if the key `Enter` is pressed, discard it and quit editing
    if (tempText.charCodeAt(tempText.length-1) === 10) {
      tempText = tempText.slice(0, -1);
      this.setState({ onEditing: false});
    };
    this.setState({ text: tempText});
  }

  toggleImportant() {
    this.setState({ isImportant: !this.state.isImportant });
  }

  addItem(e) {
    // TODO: add corresponding item
  }

  dispatchItemOpts(optType) {
    switch (optType) {
      case 'make-important':
        this.toggleImportant();
        break;
      case 'insert-img':
        // this.insertImg();
        break;
      default:
      // this.props.crossItemOpts();
    };
  }

  render() {
    var theItemID = this.state.itemID;
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
          <AllItemOpts onClick={this.dispatchItemOpts}/>
        }
        <AddItem onClick={() => {this.props.onClick(theItemID)}}/>
      </div>
    )
  }
}

class ThoughtNode extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  };

  handleClick() {
    // console.log(deepFindPointer(theItemID, this.thoughtTree, []));
  };

  render() {
    if (this.props.treeModel.subTopicsID !== undefined) {
    var subDiv = this.props.treeModel.subTopicsID.map(function(topic,index) {
        return <ThoughtNode treeModel={topic} key={topic.topicID}/>
      });
    }
    return (
      <div className="branch">
        <div className="topic">
          <ThoughtItem
            thisItemID={this.props.treeModel.topicID}
            onClick={this.handleClick}/>
        </div>
        { this.props.treeModel.subTopicsID !== undefined &&
          <div className="sub-topics">
            {subDiv}
          </div>
        }
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      thoughtTree: {
        topicID: Date.now()
      }
    };
  }
  render() {
    return (
      <ThoughtNode treeModel={this.state.thoughtTree} />
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

function deepFindPointer(theItemID, theTree, thePointer) {
  if (theTree.topicID === theItemID) {
    return thePointer;
  } else {
    if (theTree.subTopicsID === undefined) {
      return 'not this branch';
    };
    for (var i = 0; i < theTree.subTopicsID.length; i++) {
      thePointer.push(i);
      var result = deepFindPointer(theItemID, theTree.subTopicsID[i], thePointer);
      if (result === 'not this branch') {
        thePointer.pop();
      } else {
        break;
      };
    };
    return result;
  };
};

export default App;
