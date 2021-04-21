import React, { useRef, useState, useEffect } from "react";
import GameOfLife from './Components/GameOfLife/GameOfLife.js'
import styles from './App.module.css'

function App() {

  return (
    <div className={styles.App}>
      <GameOfLife></GameOfLife>
    </div>
  );
}

export default App;
