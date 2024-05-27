import { useState } from 'react'
import './App.css'

type TurnType = {
  X: string;
  O: string;
};

const TURNS: TurnType = {
  X: '✖️',
  O: '⭕'
};

type CellProps = {
  children: React.ReactNode;
  updateBoard: (index: number) => void;
  index: number;
};

type Winner = string | null | false;

// const initialBoard: (string | null)[] = ['✖️', '⭕', '✖️', '⭕', '✖️', '⭕', '✖️', '⭕', '✖️'];

const Cell = ({ children, updateBoard, index }: CellProps) => {
  const handleClick = () => {
    updateBoard(index)
  }

  return (
    <div onClick={handleClick} className='cell'>
      {children}
    </div>
  )
}

function App() {
  const [turn, setTurn] = useState<string>(TURNS.X);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [winner, setWinner] = useState<Winner>(null);
  // const [board, setBoard] = useState<(string | null)[]>(initialBoard);

  const updateBoard = (index: number) => {
    if (board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  }

  const WINNER_COMBOS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  const checkWinner = (boardToCheck:(string | null)[]) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a]
      }
    }
    // si no hay ganador
    return null
  }

  const checkEndGame = (boardToCheck:(string | null)[]) => {
    return boardToCheck.every((cell) => cell !== null)
  }

  const reset = () => {
    setWinner(null)
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
  }

  return (
    <div className="container">
      <h1>Tic Tac Toe</h1>
      {(winner === null) ? (<>
      <div className="board">
        {board.map((cell, index) => {
          return (
              <Cell 
                key={index}
                updateBoard={updateBoard}
                index={index}
              >
                {cell !== null ? cell : ""}
              </Cell>
          )
        })}
      </div>
      <p id="nextPlayer">Next player: {turn}</p>
      </>) : (
        <EndGame winner={winner} />
      )}
      <button id="reset" onClick={reset}>Reset</button>
    </div>
  )
}

const EndGame = ({ winner }: { winner: Winner }) => {
  const winnerText: string = winner === false ? 'Ha sido un empate!' : `Ganó: ${winner}`;
  return (
    <div style={{ marginBottom: '1rem' }}>
      {winnerText}
    </div>
  )
}

export default App
