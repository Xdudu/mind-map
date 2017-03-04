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
        <div className="add-item-icon add-item-sibling">
          <svg
            viewBox="0 0 24 24"
            version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <path d="M9.644 5.918l3.189 3.189 3.189-3.189 0.976 0.976-4.165 4.165-4.165-4.165z"></path>
          </svg>
          <div className="add-item-mask sibling"></div>
        </div>
        <div className="add-item-icon add-item-parent">
          <svg
            viewBox="0 0 24 24"
            version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <path d="M18.273 16.192l-0.957 0.957-4.084-4.084 4.084-4.084 0.957 0.957-3.127 3.127z"></path>
          </svg>
          <div className="add-item-mask parent"></div>
        </div>
        <div className="add-item-icon add-item-child">
          <svg
            viewBox="0 0 24 24"
            version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <path d="M5.838 16.384l3.127-3.127-3.127-3.127 0.957-0.957 4.084 4.084-4.084 4.084z"></path>
          </svg>
          <div className="add-item-mask child"></div>
        </div>
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
        className={(this.props.opt.typeName === 'delete' ? 'delete-has-sub-opts ' : '')}
        onClick={optObj.subType === undefined ? () => {this.props.onClick(optName)} : undefined}>
        <svg
          className="opt-icon"
          viewBox="0 0 15 15"
          version="1.1" xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink">
          <path d={this.props.pathData}></path>
        </svg>
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
          <ItemOpt
            key={opt.typeName + index}
            pathData={opt.pathData}
            opt={opt}
            onClick={this.props.onClick}/>
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
      console.log(e.target.className);
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
        if (pointer.length === 0) {
          break;
        };
        var itemDeletingSubTopicFrom = deepFindItem(pointer, thoughtTreeCopy, false);
        var itemBeenCut = itemDeletingSubTopicFrom.subTopicsContent.splice(pointer[pointer.length - 1], 1)[0];
        this.setState({thoughtTree: thoughtTreeCopy, itemForPaste: itemBeenCut});
        break;
      case 'delete-self':
        // no item showing opts after click to add an item--trade off?
        this.setState({itemShowingOpts: [null]});
        if (pointer.length === 0) {
          break;
        };
        var itemDeletingTopicFrom = deepFindItem(pointer, thoughtTreeCopy, false);
        var subTopicsOfItemBeenDelete = deepFindItem(pointer, thoughtTreeCopy, true).subTopicsContent;
        itemDeletingTopicFrom.subTopicsContent.splice(pointer[pointer.length - 1], 1, ...subTopicsOfItemBeenDelete);
        this.setState({thoughtTree: thoughtTreeCopy});
        break;
      case 'delete-self-and-subs':
        // no item showing opts after click to add an item--trade off?
        this.setState({itemShowingOpts: [null]});
        if (pointer.length === 0) {
          break;
        };
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
    pathData: 'M7.5 3.353c0.334 0 0.585-0.278 0.585-0.612s-0.251-0.585-0.585-0.585-0.585 0.251-0.585 0.585 0.251 0.612 0.585 0.612zM8.085 8.697v-3.563h-1.169v3.563h1.169zM8.085 11.063v-1.197h-1.169v1.197h1.169zM11.647 2.156c0.64 0 1.197 0.557 1.197 1.197v8.294c0 0.64-0.557 1.197-1.197 1.197h-8.294c-0.64 0-1.197-0.557-1.197-1.197v-8.294c0-0.64 0.557-1.197 1.197-1.197h2.477c0.251-0.696 0.891-1.197 1.67-1.197s1.419 0.501 1.67 1.197h2.477z'
  }, {
    typeName: 'insert-img',
    pathData: 'M5.425 8.385l-2.048 2.656h8.245l-2.656-3.542-2.048 2.656zM12.813 11.623c0 0.636-0.553 1.19-1.19 1.19h-8.245c-0.636 0-1.19-0.553-1.19-1.19v-8.245c0-0.636 0.553-1.19 1.19-1.19h8.245c0.636 0 1.19 0.553 1.19 1.19v8.245z'
  }, {
    typeName: 'number-subtopics',
    pathData: 'M4.365 8.115v-1.23h8.76v1.23h-8.76zM4.365 11.865v-1.23h8.76v1.23h-8.76zM4.365 3.135h8.76v1.23h-8.76v-1.23zM1.26 6.885v-0.645h1.875v0.586l-1.143 1.289h1.143v0.645h-1.875v-0.586l1.113-1.289h-1.113zM1.875 5.010v-1.875h-0.615v-0.645h1.23v2.52h-0.615zM1.26 10.635v-0.645h1.875v2.52h-1.875v-0.645h1.23v-0.293h-0.615v-0.645h0.615v-0.293h-1.23z'
  }, {
    typeName: 'copy',
    pathData: 'M12.283 4.439c0.317 0 0.574 0.257 0.574 0.574v7.271c0 0.317-0.257 0.574-0.574 0.574h-5.74c-0.317 0-0.574-0.257-0.574-0.574v-1.722h-3.253c-0.317 0-0.574-0.257-0.574-0.574v-4.018c0-0.317 0.185-0.759 0.407-0.981l2.439-2.439c0.221-0.221 0.664-0.407 0.981-0.407h2.487c0.317 0 0.574 0.257 0.574 0.574v1.961c0.233-0.138 0.532-0.239 0.765-0.239h2.487zM9.031 5.712l-1.788 1.788h1.788v-1.788zM5.204 3.416l-1.788 1.788h1.788v-1.788zM6.376 7.285l1.889-1.889v-2.487h-2.296v2.487c0 0.317-0.257 0.574-0.574 0.574h-2.487v3.827h3.061v-1.531c0-0.317 0.185-0.759 0.407-0.981zM12.092 12.092v-6.888h-2.296v2.487c0 0.317-0.257 0.574-0.574 0.574h-2.487v3.827h5.357z'
  }, {
    typeName: 'paste',
    pathData: 'M6.735 12.092h5.357v-3.827h-2.487c-0.317 0-0.574-0.257-0.574-0.574v-2.487h-2.296v6.888zM8.265 3.482v-0.383c0-0.102-0.090-0.191-0.191-0.191h-4.209c-0.102 0-0.191 0.090-0.191 0.191v0.383c0 0.102 0.090 0.191 0.191 0.191h4.209c0.102 0 0.191-0.090 0.191-0.191zM9.796 7.5h1.788l-1.788-1.788v1.788zM12.857 8.265v4.018c0 0.317-0.257 0.574-0.574 0.574h-5.74c-0.317 0-0.574-0.257-0.574-0.574v-0.957h-3.253c-0.317 0-0.574-0.257-0.574-0.574v-8.036c0-0.317 0.257-0.574 0.574-0.574h6.505c0.317 0 0.574 0.257 0.574 0.574v1.961c0.078 0.048 0.15 0.102 0.215 0.167l2.439 2.439c0.227 0.227 0.407 0.664 0.407 0.981z'
  }, {
    typeName: 'cut',
    pathData: 'M10.772 3.283h1.406v0.461l-3.272 3.294-0.944-0.944zM7.5 7.742c0.132 0 0.242-0.11 0.242-0.242s-0.11-0.242-0.242-0.242-0.242 0.11-0.242 0.242 0.11 0.242 0.242 0.242zM4.689 11.255c0.505 0 0.944-0.417 0.944-0.944s-0.439-0.944-0.944-0.944-0.944 0.417-0.944 0.944 0.439 0.944 0.944 0.944zM4.689 5.633c0.505 0 0.944-0.417 0.944-0.944s-0.439-0.944-0.944-0.944-0.944 0.417-0.944 0.944 0.439 0.944 0.944 0.944zM6.402 5.458l5.776 5.798v0.461h-1.406l-3.272-3.272-1.098 1.098c0.11 0.242 0.154 0.483 0.154 0.769 0 1.032-0.835 1.867-1.867 1.867s-1.867-0.835-1.867-1.867 0.835-1.867 1.867-1.867c0.285 0 0.527 0.044 0.769 0.154l1.098-1.098-1.098-1.098c-0.242 0.11-0.483 0.154-0.769 0.154-1.032 0-1.867-0.835-1.867-1.867s0.835-1.867 1.867-1.867 1.867 0.835 1.867 1.867c0 0.285-0.044 0.527-0.154 0.769z'
  }, {
    typeName: 'delete',
    pathData: 'M11.553 4.263l-3.237 3.237 3.237 3.237-0.816 0.816-3.237-3.237-3.237 3.237-0.816-0.816 3.237-3.237-3.237-3.237 0.816-0.816 3.237 3.237 3.237-3.237z',
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
