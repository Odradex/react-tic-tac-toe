import { useState } from "react"
import { Chip, Divider, Sheet } from "@mui/joy"
import { Button, ButtonGroup } from "@mui/joy"
import confetti from "canvas-confetti"

function Square({ value, onSquareClick, isWinningSquare }) {
  const buttonStyle = isWinningSquare ? "square winning-square" : "square"
  return <button className={buttonStyle} onClick={onSquareClick}>{value}</button>;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const currentSquareSet = history[currentMove]
  let xIsNext = currentMove % 2 === 0

  function handlePlay(nextSquareSet) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquareSet]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history.slice(1).map((_, move) => {
    move++
    let variant = move <= currentMove ? 'soft' : 'outlined'
    let color = move <= currentMove ? 'primary' : 'neutral'
    return (
      <Button key={move} color={color} variant={variant} onClick={() => jumpTo(move)}>Ход №{move}</Button>
    )
  })

  return (
    <>
      <div className="game-board">
        <Board xIsNext={xIsNext} squareSet={currentSquareSet} onPlay={handlePlay}/>
      </div>
      <Divider />
      <Sheet sx={{width: '100%', mt: 2,}}>
        <Button sx={{width: '100%', mb: 2}} onClick={() => jumpTo(0)}>Сначала</Button>
        <ButtonGroup orientation="vertical" color="neutral">{moves}</ButtonGroup>
      </Sheet>
    </>
  )
}

export function Board({xIsNext, squareSet, onPlay}) {
  const winner = calculateWinner(squareSet)
  let status
  if (winner) {
    const confettiShapes = [
      confetti.shapeFromText('🏆'),
      winner.player === 'X' ? confetti.shapeFromText('❌') : confetti.shapeFromText('⭕'),
    ]
    confetti({shapes: confettiShapes, ticks: 100, scalar: 2, startVelocity: 30, gravity: 0.2, spread: 360, origin: {y: 0.2, x: 0.5}})
    status = `ПОБЕДА: ${winner.player}`
  }
  else {
    status = `След. ход: ${xIsNext? 'X' : 'O'}`
  }

  function handleClick(i) {
    if (squareSet[i] || calculateWinner(squareSet)) {
      return
    }
    const newSquares = squareSet.slice()
    newSquares[i] = xIsNext? 'X' : 'O'
    onPlay(newSquares)
  }

  function calculateWinner(squareSet) {
    const winningLines = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal
      [2, 4, 6], // diagonal
    ]

    for (let i = 0; i < winningLines.length; i++) {
      const [a, b, c] = winningLines[i]
      if (squareSet[a] && squareSet[a] === squareSet[b] && squareSet[a] === squareSet[c]) {
        return {
          player: squareSet[a],
          winningLine: winningLines[i],
        }
      }
    }
    return null
  }

  const board = [];

  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const squareIndex = i * 3 + j;
      row.push(
        <Square
          key={squareIndex}
          value={squareSet[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinningSquare={winner && winner.winningLine.includes(squareIndex)}
        />
      );
    }
    board.push(<div key={i} className="board-row">{row}</div>);
  }

return (
  <>
    <div className="board-grid">
      {board}
    </div>
    <div>
      <Chip variant="soft" sx={{width: '260px', my: 2, fontSize:24}}>
        {status}
      </Chip>
    </div>
  </>
);
}
