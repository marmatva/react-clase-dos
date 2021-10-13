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
    <div onClick={onClick} className="square" id={id}>
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

const getWinner = (tiles, player) => {
  const allSquaresFilled = (tiles.indexOf('')===-1)
  const playerEntries = tiles.map((el, i)=> (el===player)? i : null).filter((i)=> i!==null);
  let winnerExists;

  if(playerEntries.length>=3){
    winnerExists = mapper(playerEntries);
  }

  function mapper(array){
    if(array.length<3){
      return false
    }
    const closerRelations = array.slice(1).filter(el => el>=(array[0]-4) || el<=(array[0]-4)).map(el => [el, (el-array[0]), (el%3 - array[0]%3)])
    const extendedRelations = closerRelations.filter(([el, increase, moduleDifference])=>{
      const searchedNumber = array[0]+increase*2;
      return (array.includes(searchedNumber) && ((searchedNumber%3-array[0]%3)===moduleDifference*2))
    });
    return ((extendedRelations.length!== 0)? true : mapper(array.slice(1)))
  }

  const results = (winnerExists)? player : (allSquaresFilled)? "tie" : false

  return results;
};

const useTicTacToeGameState = initialPlayer => {
  const [tiles, setTileTo] = React.useState(["","","","","","","","",""])
  const [player, setPlayer] = React.useState(initialPlayer)
  const [gameEnded, setGameEnded] = React.useState(false)
  const [winner, setWinner] = React.useState('')

  React.useEffect(()=>{
    const winner = getWinner(tiles, player);
    (winner) ? endGame(winner) : updatePlayer()
  },[tiles])

  function endGame(winner){
    setGameEnded(true)
    if(winner!=="tie"){
      setWinner(winner)
    }
  }

  const squareOnClic = (e)=>{
    if(gameEnded){
      return
    }
    const id = parseInt(e.target.id.replace('square-', ''));
    (tiles[id]!=="") || setTileTo(tiles.map((el, i)=> (i===id)? player : el));
  }
  
  const updatePlayer = ()=>{
    if(tiles.indexOf(initialPlayer)===(-1)){
      setPlayer(initialPlayer)
    } else{
      setPlayer((player === "X") ? "O" : "X")
    }
  }

  const restart = () => {
    setTileTo(["","","","","","","","",""])
    setGameEnded(false)
    setWinner('')
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
        <div className="tictactoe-row">
          <Square value={tiles[0]} id={`square-${0}`} onClick={squareOnClic}></Square>
          <Square value={tiles[1]} id={`square-${1}`} onClick={squareOnClic}></Square>
          <Square value={tiles[2]} id={`square-${2}`} onClick={squareOnClic}></Square>
        </div>
        <div className="tictactoe-row">
          <Square value={tiles[3]} id={`square-${3}`} onClick={squareOnClic}></Square>
          <Square value={tiles[4]} id={`square-${4}`} onClick={squareOnClic}></Square>
          <Square value={tiles[5]} id={`square-${5}`} onClick={squareOnClic}></Square>
        </div>
        <div className="tictactoe-row">
          <Square value={tiles[6]} id={`square-${6}`} onClick={squareOnClic}></Square>
          <Square value={tiles[7]} id={`square-${7}`} onClick={squareOnClic}></Square>
          <Square value={tiles[8]} id={`square-${8}`} onClick={squareOnClic}></Square>
        </div>
      </>  
      }
    </div>
  );
};
export default TicTacToe;
