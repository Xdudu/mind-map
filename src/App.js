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
    );
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
    );
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
  constructor(props) {
    super(props);
    this.state = {
      onEditing: false,
      isImportant: false
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleImportant = this.toggleImportant.bind(this);
    this.dispatchItemOpts = this.dispatchItemOpts.bind(this);
    this.clicks = 0;
    this.timer = null;
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.onEditing) {
      var thisThoughtItemNode = ReactDOM.findDOMNode(this);
      var thisItemViewNode = thisThoughtItemNode.firstElementChild;
      var thisItemEditNode = thisItemViewNode.nextElementSibling;
      thisItemEditNode.style.width = (thisItemViewNode.clientWidth + 1) + 'px';
    }
  }

  handleInput(e) {
    var tempText = e.target.value;
    // if the key `Enter` is pressed, discard it and quit editing
    if (tempText.charCodeAt(tempText.length-1) === 10) {
      tempText = tempText.slice(0, -1);
      this.toggleEditing();
      // this.toggleOpt();
    };
    this.props.handleInput(tempText);
  }

  handleClick() {
    this.clicks++;
    if (this.clicks === 1) {
      this.timer = setTimeout(() => {
        this.props.toggleOpts(this.props.pointer);
        this.clicks = 0;
      }, 300);
    } else {
      clearTimeout(this.timer);
      this.setState({ onEditing: !this.state.onEditing });
      this.clicks = 0;
    };
  }

  toggleImportant() {
    this.setState({ isImportant: !this.state.isImportant });
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
    return (
      <div className={"item" + (this.state.isImportant ? " important" : "")}>
        <ItemView
          onClick={this.handleClick}
          onDoubleClick={(e) => {e.preventDefault();}}
          text={this.props.content}
        />
        { this.state.onEditing && (
          <ItemEdit
            value={this.props.content}
            onChange={this.handleInput}
            onBlur={() => {this.setState({ onEditing: !this.state.onEditing });}}
         /> )
        }
        { is2ArraysEqual(this.props.pointer, this.props.itemShowingOpts) &&
          <AllItemOpts onClick={this.dispatchItemOpts}/>
        }
        <AddItem onClick={this.props.onClick}/>
      </div>
    );
  }
}

class ThoughtNode extends Component {
  render() {
    if (this.props.treeModel.subTopicsContent.length !== 0) {
      var subDiv = this.props.treeModel.subTopicsContent.map((topic, index) => {
        var pointerTemp = this.props.pointer.slice(0);
        pointerTemp.push(index);
        return (
          <ThoughtNode
            key={pointerTemp.toString()}
            treeModel={topic}
            content={topic.topicContent}
            itemShowingOpts={this.props.itemShowingOpts}
            pointer={pointerTemp}
            handleInput={this.props.handleInput}
            onClick={this.props.onClick}
            toggleOpts={this.props.toggleOpts}/>
        );
      });
    };
    return (
      <div className="branch">
        <div className="topic">
          <ThoughtItem
            pointer={this.props.pointer}
            content={this.props.content}
            itemShowingOpts={this.props.itemShowingOpts}
            handleInput={(text) => {this.props.handleInput(text, this.props.pointer)}}
            onClick={this.props.onClick(this.props.pointer)}
            toggleOpts={this.props.toggleOpts} />
        </div>
        { this.props.treeModel.subTopicsContent.length !== 0 &&
          <div className="sub-topics">
            {subDiv}
          </div>
        }
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      thoughtTree: [{
        topicContent: 'Mind Map;)',
        subTopicsContent: []
      }],
      itemShowingOpts: [null]
    };
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.toggleOpts = this.toggleOpts.bind(this);
  }

  handleInput(text, pointer) {
    var thoughtTreeTemp = this.state.thoughtTree.slice(0)[0];
    var contentChangedItem = deepFindItem(pointer, thoughtTreeTemp, true);
    contentChangedItem.topicContent = text;
    this.setState({thoughtTree: [thoughtTreeTemp]});
  }

  handleAddItem(pointer) {
    var theApp = this;
    return function(e) {
      theApp.setState({itemShowingOpts: [null]});
      var addType = e.target.className.match(/(sibling|parent|child)\b/)[0];
      var thoughtTreeTemp = theApp.state.thoughtTree.slice(0)[0];
      var itemOnOpt;
      switch (addType) {
        case 'child':
          itemOnOpt = deepFindItem(pointer, thoughtTreeTemp, true);
          itemOnOpt.subTopicsContent.push({
            topicContent: '',
            subTopicsContent: []
          });
          theApp.setState({thoughtTree: [thoughtTreeTemp]});
          break;
        case 'sibling':
          if (!pointer.length) {
            return;
          };
          itemOnOpt = deepFindItem(pointer, thoughtTreeTemp, false);
          itemOnOpt.subTopicsContent.splice((pointer[pointer.length - 1] + 1), 0, {
            topicContent: '',
            subTopicsContent: []
          });
          theApp.setState({thoughtTree: [thoughtTreeTemp]});
          break;
        case 'parent':
          itemOnOpt = deepFindItem(pointer, thoughtTreeTemp, false);
          var itemBeenClicked = itemOnOpt.subTopicsContent.splice(pointer[pointer.length - 1], 1, {
            topicContent: '',
            subTopicsContent: []
          });
          itemOnOpt = deepFindItem(pointer, thoughtTreeTemp, true);
          itemOnOpt.subTopicsContent.push(itemBeenClicked[0]);
          theApp.setState({thoughtTree: [thoughtTreeTemp]})
          break;
        default:

      };
    };
  }

  toggleOpts(pointer) {
    this.setState({itemShowingOpts: pointer});
  }

  render() {
    return (
      <ThoughtNode
        key={'root'}
        className={'thought-tree-root'}
        treeModel={this.state.thoughtTree[0]}
        content={this.state.thoughtTree[0].topicContent}
        itemShowingOpts={this.state.itemShowingOpts}
        pointer={[]}
        handleInput={this.handleInput}
        onClick={this.handleAddItem}
        toggleOpts={this.toggleOpts}/>
    );
  }
}

var itemOptTypes = [
  {
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
  }
];

function deepFindItem(thePointer, theTree, findSelf) {
  var theItem = theTree;
  if (!(!thePointer.length && findSelf)) {
    for (var i = 0; i < (findSelf ? thePointer.length : thePointer.length - 1); i++) {
      theItem = theItem.subTopicsContent[thePointer[i]];
    };
  };
  return theItem;
}

function is2ArraysEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  } else {
    for (var i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      };
    };
    return true;
  };
}

export default App;
