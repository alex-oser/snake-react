import React, { useEffect, useState } from 'react';
import './App.css';
import GameControl from './components/GameControl'
import BoardConfig from './components/BoardConfig'
import Board from './components/Board'

export default function App() {
  const [ rows, setRows ] = useState(35)
  const [ cols, setCols ] = useState(35)
  const [ running, setRunning] = useState(false)
  const [ reset, setReset ] = useState(false)

  const boardConfigCallback = (rowsCb, colsCb) => {
    setRows(rowsCb)
    setCols(colsCb)
    console.log(`rows are ${rowsCb} and cols are ${colsCb}`)
  }

  const gameControlCallback = (runningCb, resetCb) => {
    setRunning(runningCb)
    setReset(resetCb)
  }

  return (
    <div className="App">
      <GameControl callbackFromParent={gameControlCallback}/>
      <BoardConfig callbackFromParent={boardConfigCallback}/>
      <Board rows={rows} cols={cols} runState={running} resetState={reset}/>
    </div>
  );
}