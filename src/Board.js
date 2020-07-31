import React, { useState } from 'react';
import Cell from './Cell';
import './Board.css';

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = Math.random() }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let i = 0; i < nrows; i++) {
      let rowArr = [];

      for (let j = 0; j < ncols; j++) {
        rowArr.push({
          y: i,
          x: j,
          isLit: Math.random() > chanceLightStartsOn ? true : false,
        });
      }

      initialBoard.push(rowArr);
    }

    return initialBoard;
  }

  // Check the board in state to determine whether the player has won.
  function hasWon(gameBoard = board) {
    let litCount = 0;
    gameBoard.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isLit) {
        litCount += 1
        }
      })
    })
    if(litCount === 9) {
      console.log('Win')
      return true;
    }
    return false;
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split('-').map(Number);
      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x].isLit = !boardCopy[y][x].isLit;
        }
      };

      // Make a (deep) copy of the oldBoard
      let boardCopy = oldBoard.slice();

      // In the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);
      // Return the copy
      return boardCopy;
    });
  }

  // If the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (
      <div>Winner</div>
    )
  }
  return (
    <>
      <div className="Board">
        <table>
          <tbody>
            {board.map((row) => (
              <tr>
                {row.map((cellObj) => (
                  <Cell
                    key={`${cellObj.y}-${cellObj.x}`}
                    flipCellsAroundMe={() => {
                      flipCellsAround(`${cellObj.y}-${cellObj.x}`);
                    }}
                    isLit={cellObj.isLit === true ? true : false}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Board;
