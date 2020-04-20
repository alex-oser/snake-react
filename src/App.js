import React, { useState, useCallback } from 'react';
import './App.css';
import GameControl from './components/GameControl'
import BoardConfig from './components/BoardConfig'
import Board from './components/Board'

export default function App() {
  const [ rows, setRows ] = useState(20)
  const [ cols, setCols ] = useState(20)
  const [ runState, setRunState] = useState(false)
  const [ resetState, setResetState ] = useState(false)

  const useGameCallback = useCallback( (currentState) => {
    const currentRows = ("rows" in currentState) ? currentState.rows : rows
    const currentCols = ("cols" in currentState) ? currentState.cols : cols
    const currentRunState = ("runState" in currentState) ? currentState.runState : runState
    const currentResetState = ("resetState" in currentState) ? currentState.resetState : resetState
    console.log(`App: Game state is rows=${currentRows} cols=${currentCols} runState=${currentRunState} resetState=${currentResetState}`)
    setRows( currentRows )
    setCols( currentCols )
    setRunState( currentRunState )
    setResetState( currentResetState )
  }, [ cols, rows, runState, resetState ])

  return (
    <div className="App">
      <GameControl runState={runState} resetState={resetState} callbackFromParent={useGameCallback}/>
      <BoardConfig rows={rows} cols={cols} callbackFromParent={useGameCallback}/>
      <Board rows={rows} cols={cols} runState={runState} resetState={resetState} callbackFromParent={useGameCallback}/>
    </div>
  );
}