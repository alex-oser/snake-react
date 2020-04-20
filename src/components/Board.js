import React, { useRef, useState, useEffect } from "react";

export default function Board({ rows, cols, runState, resetState }) {
  // Locations are going to be 1-based since that is how CSS grid works
  const [ bodyCoord, _setBodyCoord ] = useState(
    [
      {
        x: Math.floor(rows / 2),
        y: Math.floor(cols / 2)
      }
    ]
  )
  const bodyCoordRef = useRef(bodyCoord)
  const setBodyCoord = data => {
    bodyCoordRef.current = data;
    _setBodyCoord(data);
  };
  const [ snakeBody, setSnakeBody ] = useState()
  const [ length, _setLength ] = useState(3)
  const lengthRef = useRef(length)
  const setLength = data => {
    lengthRef.current = data;
    _setLength(data);
  };
  const [ direction, _setDirection ] = useState("left")
  const directionRef = useRef(direction);
  const setDirection = data => {
    directionRef.current = data;
    _setDirection(data);
  };
  const [ timer, setTimer ] = useState(null)
  const [ running, setRunning ] = useState(runState)
  const [ reset, setReset ] = useState(false)
  const [ apple, _setApple ] = useState({'x': null, 'y': null})
  const appleRef = useRef(apple)
  const setApple = data => {
    appleRef.current = data;
    _setApple(data);
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${rows}, 10px)`,
    gridTemplateRows: `repeat(${cols}, 10px)`,
    height: "100%",
    width: "100%",
    backgroundColor: "yellow"
  }

  useEffect(() => {
    resetBoard()
  }, [rows, cols])

  useEffect(() => {
    if (reset) {
      console.log(`reset button hit, resetting`)
      resetBoard()
    }
  }, [reset])

  useEffect(() => {
    setReset(resetState)
  }, [resetState])

  useEffect(() => {
    setSnakeBody(bodyCoord.map((loc) =>
      <div style={{
        gridColumn: `${loc.x}`,
        gridRow: `${loc.y}`,
        backgroundColor: "green"
      }}></div>
    ))
  }, [bodyCoord])

  useEffect(() => {
    console.log("board detected a change to runstate")
    console.log(`board is running: ${running}`)
    if ( running ) {
      const gameTimer = setInterval(() => {
        moveSnake()
      }, 75); 
      setTimer(gameTimer)
    } else {
      clearInterval(timer)
    }
  }, [running])

  useEffect(() => {
    setRunning(runState)
  }, [runState])

  useEffect(() => {
    window.addEventListener("keydown", getDirection);
    findApple()
  }, [])

  const resetBoard = () => {
    setBodyCoord([{ x: Math.floor(rows / 2), y: Math.floor(cols / 2) }])
    findApple()
    setLength(3)
  }

  const findApple = () => {
    let foundApple = false
    while (! foundApple) {
      const appleX = Math.ceil(Math.random()*rows)
      const appleY = Math.ceil(Math.random()*cols)
      const overlap = bodyCoordRef.current.filter(coord => coord.x === appleX && coord.y === appleY)
      if (overlap.length === 0) {
        console.log(`old apple at [${apple.x}, ${apple.y}]`)
        setApple({'x': appleX, 'y': appleY})
        console.log(`set new apple at [${appleX}, ${appleY}]`)
        foundApple = true
      }
    }
  }

  // Returns a new array for the body coordinates with next location added and last removed if the snake is too long
  const moveSnake = () => {
    const next = {}
    switch (directionRef.current){
      case "left":
        next.x = bodyCoordRef.current[0].x - 1
        next.y = bodyCoordRef.current[0].y
        break;
      case "up":
        next.x = bodyCoordRef.current[0].x
        next.y = bodyCoordRef.current[0].y - 1
        break;
      case "right":
        next.x = bodyCoordRef.current[0].x + 1
        next.y = bodyCoordRef.current[0].y
        break;
      case "down":
        next.x = bodyCoordRef.current[0].x 
        next.y = bodyCoordRef.current[0].y + 1
    }
    if (gameOver(next)) {
      setRunning(false)
      return
    }
    if (next.x === appleRef.current.x && next.y === appleRef.current.y) {
      console.log('snake found the apple!')
      setLength(lengthRef.current + 3)
      findApple()
    }
    const newCoords = bodyCoordRef.current.slice();
    newCoords.unshift(next);
    if (newCoords.length > lengthRef.current) {
      newCoords.pop()
    }
    setBodyCoord(newCoords);
  }

  const gameOver = (next) => {
    const overlap = bodyCoordRef.current.filter(coord => coord.x === next.x && coord.y === next.y)
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
        if ( directionRef.current !== "left" && directionRef.current !== "right" ) {
          setDirection("left");
        }
        break;
      case 38:
        if ( directionRef.current !== "up" && directionRef.current !== "down" ) {
          setDirection("up");
        }
        break;
      case 39:
        if ( directionRef.current !== "left" && directionRef.current !== "right" ) {
          setDirection("right");
        }
        break;
      case 40:
        if ( directionRef.current !== "up" && directionRef.current !== "down" ) {
          setDirection("down");
        }
    }
  }

  return (
    <div className="board-panel">
      <div style={gridStyle}>
        <label>Score: {length}</label>
        {snakeBody}
        <div style={{
            gridColumn: `${apple.x}`,
            gridRow: `${apple.y}`,
            backgroundColor: "red"
          }}></div>
      </div>
    </div>
  );
}