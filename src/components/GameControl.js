import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';

export default function GameControl(  { callbackFromParent } ) {
  const [ running, setRunning ] = useState(false)

  useEffect(() => {
    callbackFromParent(running, false)
  }, [ running ])

  return (
    <div className="game-control">
      <Button variant="contained" color="secondary" onClick={() => setRunning( ! running )}>
        { running ? "Pause" : "Start" }
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        onClick=
          {() => {
            callbackFromParent(false, true)
          }}>
          Reset
      </Button>
    </div>
  );
}