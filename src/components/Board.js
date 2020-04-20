import React, { useRef, useState, useEffect } from "react";

// Code for this function taken from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if ( delay !== null ) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function Board({ rows, cols, runState, resetState, callbackFromParent }) {
  // Locations are going to be 1-based since that is how CSS grid works
  const snakeBodyColor = "pink"
  const snakeHeadColor = "purple"
  const appleColor = "green"
  const gameOverColor = "red"
  const [ bodyCoord, setBodyCoord ] = useState(
    [{
      x: Math.floor(rows / 2),
      y: Math.floor(cols / 2),
      color: snakeHeadColor
    }]
  )
  const [ length, setLength ] = useState(3)
  const [ direction, setDirection ] = useState(null)
  const [ apple, setApple ] = useState({'x': null, 'y': null})
  const [ gridStyle, setGridStyle ] = useState({
    display: "grid",
    gridTemplateColumns: `repeat(${rows}, 10px)`,
    gridTemplateRows: `repeat(${cols}, 10px)`,
    height: "100%",
    width: "100%",
    backgroundColor: "yellow"
  })

  useEffect(() => {
    setBodyCoord([{ x: Math.floor(rows / 2), y: Math.floor(cols / 2), color: snakeHeadColor }])
    setLength(3)
    setApple(findApple(apple))
    setGridStyle({
      display: "grid",
      gridTemplateColumns: `repeat(${rows}, 10px)`,
      gridTemplateRows: `repeat(${cols}, 10px)`,
      height: "100%",
      width: "100%",
      backgroundColor: "yellow"
    })
  }, [rows, cols])

  useEffect(() => {
    console.log("Board detected a reset")
    setBodyCoord( (resetState) ? [{ x: Math.floor(rows / 2), y: Math.floor(cols / 2), color: snakeHeadColor }] : bodyCoord )
    setLength( (resetState) ? 3 : length )
    setApple( (resetState) ? findApple(apple) : apple )
    if ( resetState ) {
      console.log("I am telling app to set resetState to false")
      callbackFromParent({'resetState': false})
    }
  }, [ resetState ])

  useEffect(() => {
    setApple(findApple(apple))
  }, [])

  useEffect(() => {
    console.log(`Board: Game state is rows=${rows} cols=${cols} runState=${runState} resetState=${resetState}`)  
    window.addEventListener("keydown", getDirection);
    return () => window.removeEventListener("keydown", getDirection);
  })

  useInterval(() => {
    moveSnake();
  }, runState ? 150 : null);

  const findApple = (currApple) => {
    let foundApple = false
    let newApple = {}
    while (! foundApple) {
      const appleX = Math.ceil(Math.random()*rows)
      const appleY = Math.ceil(Math.random()*cols)
      const overlap = bodyCoord.filter(coord => coord.x === appleX && coord.y === appleY)
      if (overlap.length === 0) {
        console.log(`old apple at [${currApple.x}, ${currApple.y}]`)
        console.log(`set new apple at [${appleX}, ${appleY}]`)
        newApple = { x: appleX, y: appleY }
        foundApple = true
      }
    }
    return newApple
  }

  // Returns a new array for the body coordinates with next location added and last removed if the snake is too long
  const moveSnake = () => {
    const next = {}
    switch (direction){
      case "left":
        next.x = bodyCoord[0].x - 1
        next.y = bodyCoord[0].y
        break;
      case "up":
        next.x = bodyCoord[0].x
        next.y = bodyCoord[0].y - 1
        break;
      case "right":
        next.x = bodyCoord[0].x + 1
        next.y = bodyCoord[0].y
        break;
      case "down":
        next.x = bodyCoord[0].x 
        next.y = bodyCoord[0].y + 1
        break;
      // Move left by default
      default:
        next.x = bodyCoord[0].x - 1
        next.y = bodyCoord[0].y
    }
    next.color = snakeHeadColor
    // If next move is game over
    if (gameOver(next)) {
      const newCoords = bodyCoord.slice();
      newCoords[0].color = gameOverColor
      setBodyCoord(newCoords)
      callbackFromParent({'runState':false})
      return
    } 
    // If snake eats apple on next move
    if (next.x === apple.x && next.y === apple.y) {
      console.log('snake found the apple!')
      setLength(length + 3)
      setApple(findApple(apple))
    }
    // Next move is valid, prepend head to snake body
    const newCoords = bodyCoord.slice();
    newCoords[0].color = snakeBodyColor
    newCoords.unshift(next);
    newCoords[0].color = snakeHeadColor
    if (newCoords.length > length) {
      newCoords.pop()
    }
    setBodyCoord(newCoords);
  }

  const gameOver = (next) => {
    const overlap = bodyCoord.filter(coord => coord.x === next.x && coord.y === next.y)
    if (overlap.length > 0) {
      console.log(`Snake hit itself at [${next.x}, ${next.y}]`)
      return true
    }
    if ( next.x < 1 || next.x > rows || next.y < 1 || next.y > cols ) {
      console.log(`Snake out of bounds at [${next.x}, ${next.y}]`)
      return true
    }
    return false
  }

  const getDirection = (event) => {
    switch (event.keyCode) {
      case 37:
        if ( direction !== "left" && direction !== "right" ) {
          setDirection("left");
        }
        break;
      case 38:
        if ( direction !== "up" && direction !== "down" ) {
          setDirection("up");
        }
        break;
      case 39:
        if ( direction !== "left" && direction !== "right" ) {
          setDirection("right");
        }
        break;
      case 40:
        if ( direction !== "up" && direction !== "down" ) {
          setDirection("down");
        }
        break;
      default:
        return
    }
  }

  const getKey = (coord) => {
    return `loc_${coord.x}_${coord.y}`
  }

  return (
    <div className="board-panel">
      <div style={gridStyle}>
        <label>Score: {length}</label>
        {/* Set boxes for snake body to green */}
        {bodyCoord.map((coord) =>
          <div 
            key={getKey(coord)} 
            style={{
              gridColumn: `${coord.x}`,
              gridRow: `${coord.y}`,
              backgroundColor: `${coord.color}`
            }}>
          </div>
        )}
        {/* Set box for apple to red */}
        <div 
          key="apple"
          style={{
            gridColumn: `${apple.x}`,
            gridRow: `${apple.y}`,
            backgroundColor: appleColor
          }}>
        </div>
      </div>
    </div>
  );
}