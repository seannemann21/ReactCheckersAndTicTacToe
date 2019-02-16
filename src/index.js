import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Checker, CheckersGame } from './Checkers.js';
import { TicTacToeGame } from './TicTacToe.js';


class Square extends React.Component{
	
	render() {
		return (
			<button className={this.props.square.getClasses()} onClick={this.props.onClick}>
				{this.props.square.getSymbol()}
			</button>
			);
	}
}

class Scoreboard extends React.Component{

	renderEndTurn(endTurnPossible) {
		const rows = [];
		if(endTurnPossible) {
			rows.push(<button className="scoreboard-btn" onClick={this.props.endTurn}>End Turn</button>);
		}

		return rows;
	}

	renderStats(isPlayingCheckers, squares) {
		const rows = [];
		if(isPlayingCheckers) {

			let redCheckersLeft = 0;
			let blackCheckersLeft = 0;
			let redKings = 0;
			let blackKings = 0;
			for(let i = 0; i < squares.length; i++) {
				for(let j = 0; j < squares[i].length; j++) {
					if(squares[i][j] instanceof Checker) {
						if(squares[i][j].color === "black") {
							blackCheckersLeft++;
							if(squares[i][j].isKing) {
								blackKings++;
							}
						} else {
							redCheckersLeft++;
							if(squares[i][j].isKing) {
								redKings++;
							}
						}
					}
				}
			}

			rows.push(<div className="stat-box"> Checkers Left: <span className="stats"><span className="team-color-1">{redCheckersLeft}</span> <span className="team-color-2">{blackCheckersLeft}</span></span></div>);
			rows.push(<div className="stat-box"> Kings: <span className="stats"><span className="team-color-1">{redKings}</span> <span className="team-color-2">{blackKings}</span></span></div>);
			
		}

		return rows;
	}

	render() {
	return (
		<div className="scoreboard shadow">
			<div className="scoreboard-btn-container">
				{this.renderEndTurn(this.props.endTurnPossible)}
				<button className="scoreboard-btn" onClick={this.props.switchGame}>Switch Game</button>

				<button className="scoreboard-btn" onClick={this.props.newGame}>New Game</button>
			</div>
			<div className="stat-box-container">
				{this.renderStats(this.props.isPlayingCheckers, this.props.squares)}
			</div>
		</div>
	);
	}
}

class Board extends React.Component {
	renderSquare(i,j) {
		return <Square square={this.props.squares[i][j]}
		xPosition={i} yPosition={j} onClick={() => this.props.onClick(i,j)}/>;
	}

	render() {
		const rows = [];
		for(let i = 0; i<this.props.squares.length; i++){
			const row = [];
			for(let j = 0; j<this.props.squares[i].length; j++) {
				row[row.length]=this.renderSquare(j, this.props.squares[i].length - i - 1);
			}
			rows[rows.length] = <div className="board-row">{row}</div>
		}
		return <div>{rows}</div>;
	}
}

class Game extends React.Component {


	constructor(props) {
		super(props);
		this.game = new TicTacToeGame();
		this.state = this.game.setup();
	}

	switchGames() {
		 if(this.game instanceof TicTacToeGame) {
		 	this.game = new CheckersGame();
		 } else {
		 	this.game = new TicTacToeGame();
		 }
		 this.newGame();
	}

	newGame() {
	 	this.setState(this.game.setup());
	}

	renderBoard() {
		const rows = [];
		if(this.game instanceof TicTacToeGame) {
			rows.push(<Board squares={this.state.squares} onClick={(i,j) => this.handleClick(i, j)}/>);
		} else {
			rows.push(<Board squares={this.state.squares} onClick={(i,j) => this.handleTicTacToeClick(i, j)}/>);
		}

		return rows;
	}

	renderWinner() {
		const rows = [];
		if(this.state.winner !== "") {
			rows.push(<h1 className="winner-headline">{this.state.winner} is the Winner!!!!</h1>);
		}

		return rows;
	}

	handleClick(i, j) {
		this.setState(this.game.handleClick(i, j));
	}

	endTurn() {
		this.setState(this.game.endTurn());
	}

	isPlayingCheckers() {
		return this.game instanceof CheckersGame;
	}

  render() {
    return (
    <div>
      <div className="game">
        <div className="game-board shadow">
          <Board squares={this.state.squares} onClick={(i,j) => this.handleClick(i, j)}/>
        </div>
          <Scoreboard squares={this.state.squares} endTurnPossible={this.state.showEndTurn} isPlayingCheckers={this.isPlayingCheckers()} newGame={() => this.newGame()} switchGame={()=>this.switchGames()} endTurn={() => (this.endTurn())}/>
        </div>
        {this.renderWinner()}
      </div>
    );
  }
}

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);