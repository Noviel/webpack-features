import React, { Component } from 'react';

import Scss from './Scss';

import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        <div className="globalClass">-__-</div>
        CSS
        <Scss />
      </div>
    );
  }
}

export default App;
