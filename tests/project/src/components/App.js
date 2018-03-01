import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

import Scss from './Scss';

import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <div className="globalClass">global style</div>
        CSS Modules style
        <Scss />
      </div>
    );
  }
}

export default hot(module)(App);
