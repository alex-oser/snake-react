import React from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

export default function BoardConfig( { cols, rows, callbackFromParent } ) {

  const rowsText = (value) => {
    if (value !== rows) {
      callbackFromParent({'rows': value, 'runState': false})
    }
    return `${value}°C`
  }

  const colsText = (value) => {
    if (value !== cols) {
      callbackFromParent({'cols': value, 'runState': false})
    }
    return `${value}°C`
  }

  const defaultRows = 10
  const defaultCols = 10

  const sliderHeight = '150px'

  return (
    <div className="board-config"> 
      <div style={{height: sliderHeight}}>
        <Typography id="discrete-slider" gutterBottom>
          {cols} Cols
        </Typography>
        <Slider
          defaultValue={defaultRows}
          orientation="vertical"
          getAriaValueText={colsText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          marks
          min={10}
          max={50}
        />
      </div>
      <div style={{height: sliderHeight}}>
        <Typography id="discrete-slider" gutterBottom>
          {rows} Rows
        </Typography>
        <Slider
          defaultValue={defaultCols}
          orientation="vertical"
          getAriaValueText={rowsText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          marks
          min={10}
          max={50}
        />
      </div>
    </div>
  );
}