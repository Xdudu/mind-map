import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var winScrollX = 2333 - windowWidth / 4;
    var winScrollY = 2333 - windowHeight / 3;
    window.scroll(winScrollX, winScrollY);
  }
}
