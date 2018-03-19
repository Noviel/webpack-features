import React, { Component } from 'react';

import { hot } from 'react-hot-loader';
import Scss from './Scss';

import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        I am using CSS Modules
        <div className="globalClass">I am using global CSS</div>
        <Scss />
      </div>
    );
  }
}

export default hot(module)(App);
