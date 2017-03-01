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
    this.dispatchItemOpts = this.dispatchItemOpts.bind(this);
    this.clicks = 0;
    this.timer = null;
  }

  componentDidUpdate() {
    if (this.state.onEditing) {
      var thisThoughtItemNode = ReactDOM.findDOMNode(this);
      var thisItemViewNode = thisThoughtItemNode.firstElementChild;
      var thisItemEditNode = thisItemViewNode.nextElementSibling;
      thisItemEditNode.style.width = (thisItemViewNode.clientWidth + 1) + 'px';
    };
  }

  handleInput(e) {
    var tempText = e.target.value;
    // if the key `Enter` is pressed, discard it and quit editing
    if (tempText.charCodeAt(tempText.length-1) === 10) {
      tempText = tempText.slice(0, -1);
      this.setState({ onEditing: !this.state.onEditing });
      if (is2PointersEqual(this.props.pointer, this.props.itemShowingOpts)) {
        this.props.toggleOpts([null]);
      }
    };
    if (this.props.beNumbered) {
      tempText = tempText.slice((tempText.indexOf('. ') + 2));
    }
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

  dispatchItemOpts(optType) {
    switch (optType) {
      case 'make-important':
        this.props.toggleImportant(this.props.pointer);
        break;
      case 'insert-img':
        // this.insertImg();
        break;
      case 'number-subtopics':
        this.props.numberSubs(this.props.pointer);
        break;
      // other opts: copy, paste, cut, delete-self, delete-self-and-subs
      default:
        this.props.crossItemOpts(this.props.pointer, optType);
    };
  }

  render() {
    var showOpts = is2PointersEqual(this.props.pointer, this.props.itemShowingOpts);
    return (
      <div className={this.props.className
        + " item"
        + (this.props.isImportant ? " important" : "")
        + (showOpts ? " on-opts" : "")}>
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
        { showOpts &&
          <AllItemOpts onClick={this.dispatchItemOpts}/>
        }
        <AddItem onClick={this.props.onClick}/>
      </div>
    );
  }
}

class ThoughtNode extends Component {

  componentDidMount() {
    var thisThoughtItemNode = ReactDOM.findDOMNode(this);
    thisThoughtItemNode.style.height = thisThoughtItemNode.childNodes[0].childNodes[0].clientHeight + 'px';
  }

  componentDidUpdate() {
    var thisThoughtNode = ReactDOM.findDOMNode(this);
    if (thisThoughtNode.parentNode.childNodes.length > 2) {
      var topicNodeClientHeight = thisThoughtNode.firstElementChild.clientHeight;
      var subTopicsNodeClientHeight = thisThoughtNode.childNodes.length > 1 ?
                                    thisThoughtNode.lastElementChild.clientHeight : 0;
      thisThoughtNode.style.height = Math.max(topicNodeClientHeight, subTopicsNodeClientHeight) + 'px';
    };
  }

  render() {
    if (this.props.treeModel.subTopicsContent.length !== 0) {
      var subDiv = this.props.treeModel.subTopicsContent.map((topic, index) => {
        var pointerTemp = this.props.pointer.slice(0);
        pointerTemp.push(index);
        var classNameForBeforeLine = null;
        if (index === 0 && this.props.treeModel.subTopicsContent.length > 1) {
          classNameForBeforeLine = "bottom-half-line ";
        } else if (index === this.props.treeModel.subTopicsContent.length - 1 && this.props.treeModel.subTopicsContent.length > 1) {
          classNameForBeforeLine = "top-half-line ";
        } else {
          classNameForBeforeLine = "full-line ";
        }
        return (
          <ThoughtNode
            key={pointerTemp.toString()}
            className={classNameForBeforeLine}
            treeModel={topic}
            pointer={pointerTemp}
            content={this.props.treeModel.numberSubTopics ?
              ((index + 1).toString() + '. ' + topic.topicContent) :
              topic.topicContent}
            itemShowingOpts={this.props.itemShowingOpts}
            toggleOpts={this.props.toggleOpts}
            isImportant={topic.isImportant}
            toggleImportant={this.props.toggleImportant}
            beNumbered={this.props.treeModel.numberSubTopics}
            numberSubs={this.props.numberSubs}
            crossItemOpts={this.props.crossItemOpts}
            handleInput={this.props.handleInput}
            onClick={this.props.onClick} />
        );
      });
    };
    var classNameForHierarchy = null;
    switch (this.props.pointer.length) {
      case 0:
        classNameForHierarchy = 'first-class-topic';
        break;
      case 1:
        classNameForHierarchy = 'second-class-topics';
        break;
      case 2:
        classNameForHierarchy = 'third-class-topics';
        break;
      default:
        classNameForHierarchy = 'other-topics';
    }
    return (
      <div className={this.props.className + "branch"}>
        <div className="topic">
          <ThoughtItem
            className={classNameForHierarchy}
            pointer={this.props.pointer}
            content={this.props.content}
            itemShowingOpts={this.props.itemShowingOpts}
            toggleOpts={this.props.toggleOpts}
            isImportant={this.props.isImportant}
            toggleImportant={this.props.toggleImportant}
            beNumbered={this.props.beNumbered}
            numberSubs={this.props.numberSubs}
            crossItemOpts={this.props.crossItemOpts}
            handleInput={(text) => {this.props.handleInput(text, this.props.pointer)}}
            onClick={this.props.onClick(this.props.pointer)} />
        </div>
        { this.props.treeModel.subTopicsContent.length !== 0 &&
          <div className="sub-topics">
            {subDiv}
            <svg
              style={{
                width: "60px",
                height: "2px",
                position: "absolute",
                left: "-30px",
                top: "50%"
              }}
              version="1.1" xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink">
              <line
                x1="0"
                y1="1"
                x2="45"
                y2="1"
                stroke="#a39e8a" />
            </svg>
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
      thoughtTree: new ThoughtBranch('Mind map;)'),
      itemShowingOpts: [null],
      itemForPaste: null
    };
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.toggleOpts = this.toggleOpts.bind(this);
    this.toggleImportant = this.toggleImportant.bind(this);
    this.numberSubs = this.numberSubs.bind(this);
    this.crossItemOpts = this.crossItemOpts.bind(this);
  }

  handleInput(text, pointer) {
    var thoughtTreeCopy = JSON.parse(JSON.stringify(this.state.thoughtTree));
    var contentChangedItem = deepFindItem(pointer, thoughtTreeCopy, true);
    contentChangedItem.topicContent = text;
    this.setState({thoughtTree: thoughtTreeCopy});
  }

  handleAddItem(pointer) {
    // set `this` in the scope
    var theApp = this;
    return function(e) {
      // no item showing opts after click to add an item--trade off?
      theApp.setState({itemShowingOpts: [null]});
      var addType = e.target.className.match(/(sibling|parent|child)\b/)[0];
      // copy of `thoughtTree` for setting state later
      var thoughtTreeCopy = JSON.parse(JSON.stringify(theApp.state.thoughtTree));
      var newItemParent = null;

      switch (addType) {
        case 'child':
          newItemParent = deepFindItem(pointer, thoughtTreeCopy, true);
          newItemParent.subTopicsContent.push(new ThoughtBranch());
          break;
        case 'sibling':
          if (!pointer.length) {
            return;
          };
          newItemParent = deepFindItem(pointer, thoughtTreeCopy, false);
          newItemParent.subTopicsContent.splice((pointer[pointer.length - 1] + 1), 0, new ThoughtBranch());
          break;
        case 'parent':
          newItemParent = deepFindItem(pointer, thoughtTreeCopy, false);
          var itemBeenClicked = newItemParent.subTopicsContent.splice(pointer[pointer.length - 1], 1, new ThoughtBranch());
          newItemParent = deepFindItem(pointer, thoughtTreeCopy, true);
          newItemParent.subTopicsContent.push(itemBeenClicked[0]);
          break;
        default:
          return;
      };
      theApp.setState({thoughtTree: thoughtTreeCopy});
    };
  }

  toggleOpts(pointer) {
    this.setState({itemShowingOpts: pointer});
  }

  toggleImportant(pointer) {
    var thoughtTreeCopy = JSON.parse(JSON.stringify(this.state.thoughtTree));
    var itemFiringOpt = deepFindItem(pointer, thoughtTreeCopy, true);
    itemFiringOpt.isImportant = !itemFiringOpt.isImportant;
    this.setState({thoughtTree: thoughtTreeCopy});
  }

  numberSubs(pointer) {
    var thoughtTreeCopy = JSON.parse(JSON.stringify(this.state.thoughtTree));
    var thisItem = deepFindItem(pointer, thoughtTreeCopy, true);
    thisItem.numberSubTopics = !thisItem.numberSubTopics;
    this.setState({thoughtTree: thoughtTreeCopy});
  }

  crossItemOpts(pointer, optType) {
    var thoughtTreeCopy = JSON.parse(JSON.stringify(this.state.thoughtTree));
    switch (optType) {
      case 'copy':
        var itemToBeCopied = deepFindItem(pointer, thoughtTreeCopy, true);
        this.setState({itemForPaste: itemToBeCopied});
        break;
      case 'paste':
        var parentItemForPaste = deepFindItem(pointer, thoughtTreeCopy, true);
        var itemForPasteCopy = JSON.parse(JSON.stringify(this.state.itemForPaste));
        parentItemForPaste.subTopicsContent.push(itemForPasteCopy);
        this.setState({thoughtTree: thoughtTreeCopy});
        break;
      case 'cut':
        // no item showing opts after click to add an item--trade off?
        this.setState({itemShowingOpts: [null]});
        var itemDeletingSubTopicFrom = deepFindItem(pointer, thoughtTreeCopy, false);
        var itemBeenCut = itemDeletingSubTopicFrom.subTopicsContent.splice(pointer[pointer.length - 1], 1)[0];
        this.setState({thoughtTree: thoughtTreeCopy, itemForPaste: itemBeenCut});
        break;
      case 'delete-self':
        // no item showing opts after click to add an item--trade off?
        this.setState({itemShowingOpts: [null]});
        var itemDeletingTopicFrom = deepFindItem(pointer, thoughtTreeCopy, false);
        var subTopicsOfItemBeenDelete = deepFindItem(pointer, thoughtTreeCopy, true).subTopicsContent;
        itemDeletingTopicFrom.subTopicsContent.splice(pointer[pointer.length - 1], 1, ...subTopicsOfItemBeenDelete);
        this.setState({thoughtTree: thoughtTreeCopy});
        break;
      case 'delete-self-and-subs':
        // no item showing opts after click to add an item--trade off?
        this.setState({itemShowingOpts: [null]});
        var itemDeletingTopicFrom = deepFindItem(pointer, thoughtTreeCopy, false);
        itemDeletingTopicFrom.subTopicsContent.splice(pointer[pointer.length - 1], 1);
        this.setState({thoughtTree: thoughtTreeCopy});
        break;
      default:

    }
  }

  render() {
    return (
      <div className="mind">
        <ThoughtNode
          key={'root'}
          className={'thought-tree-root '}
          treeModel={this.state.thoughtTree}
          pointer={[]}
          content={this.state.thoughtTree.topicContent}
          itemShowingOpts={this.state.itemShowingOpts}
          toggleOpts={this.toggleOpts}
          isImportant={this.state.thoughtTree.isImportant}
          toggleImportant={this.toggleImportant}
          beNumbered={false}
          numberSubs={this.numberSubs}
          crossItemOpts={this.crossItemOpts}
          handleInput={this.handleInput}
          onClick={this.handleAddItem} />
      </div>
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
    typeName: 'number-subtopics',
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

function ThoughtBranch(content) {
  this.topicContent = !content ? '' : content;
  this.important = false;
  this.subTopicsContent = [];
  this.numberSubTopics = false;
}

function deepFindItem(thePointer, theTree, findSelf) {
  var theItem = theTree;
  if (!(!thePointer.length && findSelf)) {
    for (var i = 0; i < (findSelf ? thePointer.length : thePointer.length - 1); i++) {
      theItem = theItem.subTopicsContent[thePointer[i]];
    };
  };
  return theItem;
}

function is2PointersEqual(pointer1, pointer2) {
  if (pointer1.length !== pointer2.length) {
    return false;
  } else {
    for (var i = 0; i < pointer1.length; i++) {
      if (pointer1[i] !== pointer2[i]) {
        return false;
      };
    };
    return true;
  };
}

export default App;
