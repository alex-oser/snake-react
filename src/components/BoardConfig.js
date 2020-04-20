import React, { useEffect, useState }  from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

export default function BoardConfig( { callbackFromParent } ) {
  const [ cols, setCols ] = useState(35)
  const [ rows, setRows ] = useState(35)

  const rowsText = (value) => {
    setRows(value)
    return `${value}°C`
  }

  const colsText = (value) => {
    setCols(value)
    return `${value}°C`
  }

  useEffect(() => {
    callbackFromParent(rows, cols)
  }, [rows, cols])

  const sliderHeight = '300px'

  return (
    <div className="board-config"> 
      <div style={{height: sliderHeight}}>
        <Typography id="discrete-slider" gutterBottom>
          {cols} Cols
        </Typography>
        <Slider
          defaultValue={35}
          orientation="vertical"
          getAriaValueText={colsText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          marks
          min={20}
          max={50}
        />
      </div>
      <div style={{height: sliderHeight}}>
        <Typography id="discrete-slider" gutterBottom>
          {rows} Rows
        </Typography>
        <Slider
          defaultValue={35}
          orientation="vertical"
          getAriaValueText={rowsText}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          marks
          min={20}
          max={50}
        />
      </div>
    </div>
  );
}