import React from 'react';
import Button from '@material-ui/core/Button';

export default function GameControl(  { runState, resetState, callbackFromParent } ) {

  return (
    <div className="game-control">
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => callbackFromParent({'runState': ! runState})}
      >
        { runState ? "Pause" : "Start" }
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        onClick=
          {() => {
            callbackFromParent({'runState': false, 'resetState': true})
          }}>
          Reset
      </Button>
    </div>
  );
}