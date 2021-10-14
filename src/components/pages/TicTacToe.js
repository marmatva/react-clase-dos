import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import './TicTacToe.css';
import FancyButton from '../small/FancyButton';

/* 
  Esta tarea consiste en hacer que el juego funcione, para lograr eso deben completar el componente 
  TicTacToe y el custom hook `useTicTacToeGameState`, que como ven solamente define algunas variables.

  Para completar esta tarea, es requisito que la FIRMA del hook no cambie.
  La firma de una función consiste en los argumentos que recibe y el resultado que devuelve.
  Es decir, este hook debe recibir el argumento initialPlayer y debe devolver un objeto con las siguientes propiedades:
  {
    tiles: // un array de longitud 9 que representa el estado del tablero (es longitud 9 porque el tablero es 3x3)
    currentPlayer: // un string que representa el jugador actual ('X' o 'O')
    winner: // el ganador del partido, en caso que haya uno. si no existe, debe ser `null`
    gameEnded: // un booleano que representa si el juego terminó o no
    setTileTo: // una función que se ejecutará en cada click
    restart: // una función que vuelve a setear el estado original del juego
  }

  Verán que los diferentes componentes utilizados están completados y llevan sus propios propTypes
  Esto les dará algunas pistas
*/

const Square = ({ value, onClick = () => {}, id }) => {
  return (
    <div onClick={()=>onClick(id)} className="square" id={id}>
      {value}
    </div>
  );
};

Square.propTypes = {
  value: PropTypes.oneOf(['X', 'O', '']),
  onClick: PropTypes.func,
};

const WinnerCard = ({ show, winner, onRestart = () => {} }) => {
  return (
    <div className={cx('winner-card', { 'winner-card--hidden': !show })}>
      <span className="winner-card-text">
        {winner ? `Player ${winner} has won the game!` : "It's a tie!"}
      </span>
      <FancyButton onClick={onRestart}>Play again?</FancyButton>
    </div>
  );
};

WinnerCard.propTypes = {
  show: PropTypes.bool.isRequired,
  winner: PropTypes.oneOf(['X', 'O']),
  onRestart: PropTypes.func,
};


function getWinner(tiles, currentPlayer){
  const previousPlayer = ((currentPlayer === "X") ? "O" : "X") 
  const playerEntries = tiles.map((el, i)=> (el===previousPlayer)? i : null).filter((i)=> i!==null);
  
  let winnerExists;

  if(playerEntries.length>=3){
    winnerExists = searchForWinnerEntries(playerEntries);
  }

  return ((winnerExists)? previousPlayer : false);
};

function searchForWinnerEntries(playerEntries){
  if(playerEntries.length<3){
    return false
  }
  const closerRelations = extractsIncreaseAndModulesDifferenceWithTheFirstArrayElement(playerEntries)
  const extendedRelations = searchsForTheSamePatternInOtherArrayElements(playerEntries, closerRelations)
  return ((extendedRelations.length!== 0)? true : searchForWinnerEntries(playerEntries.slice(1)))
}

function extractsIncreaseAndModulesDifferenceWithTheFirstArrayElement(playerEntries){
  return playerEntries.slice(1)
    .filter(el => el>=(playerEntries[0]-4))
    .map(el => [el, (el-playerEntries[0]), (el%3 - playerEntries[0]%3)])
}

function searchsForTheSamePatternInOtherArrayElements(playerEntries, shortenedArray){
  const elementFromWiningLine =  shortenedArray.filter(([el, increase, moduleDifference])=>{
    const searchedNumber = el+increase;
    return (playerEntries.includes(searchedNumber) && ((searchedNumber%3-el%3)===moduleDifference))
  });

  return elementFromWiningLine
}

const useTicTacToeGameState = initialPlayer => {
  const [tiles, setTileTo] = React.useState(["","","","","","","","",""])
  const [player, setPlayer] = React.useState(initialPlayer)

  const allSquaresFilled = (tiles.indexOf('')===-1)
  const winner = getWinner(tiles, player)
  const gameEnded = winner!== false || allSquaresFilled;

  const squareOnClic = (id)=>{
    const idNumber = parseInt(id.replace('square-', ''));
    (tiles[idNumber]!=="") || setTileTo(tiles.map((el, i)=> (i===idNumber)? player : el));
    setPlayer((player === "X") ? "O" : "X")
  }

  const restart = () => {
    setTileTo(["","","","","","","","",""])
    setPlayer(initialPlayer)
  };

  return { tiles, gameEnded, restart, squareOnClic, winner };
};

const TicTacToe = () => {
  const { tiles, gameEnded, restart, squareOnClic, winner} = useTicTacToeGameState('X');

  return (
    <div className="tictactoe">
      {/* Este componente debe contener la WinnerCard y 9 componentes Square, 
      separados en tres filas usando <div className="tictactoe-row">{...}</div> 
      para separar los cuadrados en diferentes filas */
      <>  
        <WinnerCard show={gameEnded} onRestart={restart} winner={winner || undefined}/>
        {tiles.map((tile, i)=>{
          if(i%3===0){
            return (
              <div className="tictactoe-row" key={`div-${i}`}>
                <Square value={tiles[i]} id={`square-${i}`} onClick={squareOnClic}></Square>
                <Square value={tiles[i+1]} id={`square-${i+1}`} onClick={squareOnClic}></Square>
                <Square value={tiles[i+2]} id={`square-${i+2}`} onClick={squareOnClic}></Square>
              </div>
            )}
        })}
      </>  
      }
    </div>
  );
};
export default TicTacToe;