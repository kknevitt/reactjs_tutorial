import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return(
      <Square
        key={'square' + i}
        value={this.props.squares[i]}
        onClick={() => this.props.handleSquareClick(i)}
      />
    );
  }

  render() {
    const boardRowCollection = [];
    let counter = 0;
    for(let i = 0; i < 3; i++) {
      let row = []
      for(let j = 0; j < 3; j++) {
        row.push(this.renderSquare(counter, j, i))
        counter += 1;
      }
      boardRowCollection.push(row)
    }
    return (
      <div>
        {
          boardRowCollection.map((row, rowIndex) => {
            return (
              <div key={`row`+ rowIndex} className = "board-row" >
                { row.map((cell) => cell) }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: null
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleSquareClick = (value) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[this.state.stepNumber];
    const squares = [...current.squares];

    if (calculateWinner(squares) || squares[value]) {
      return;
    }
    
    squares[value] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares: squares, position: value}]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} (#${calculateCoords(step.position)})` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            <span className={`${move === this.state.stepNumber ? 'typ--em' : ''}`}>{desc}</span>
          </button>
        </li>
      );
    });

    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            xIsNext={current.xIsNext}
            handleSquareClick={this.handleSquareClick}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculateCoords(position) {
  const rowNumber = Math.floor(position / 3);
  const colNumber = position - (3 * rowNumber);
  return [colNumber, rowNumber]
}
