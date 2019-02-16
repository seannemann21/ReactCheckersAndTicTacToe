
export class TicTacToeGame {

	constructor() {
		this.state = {};
	}

	handleClick(i, j) {
		const squares = this.state.squares.slice();
		let nextIsX = this.state.nextIsX;
		let winner = "";
		if(squares[i][j] instanceof TicTacToeEmpty) {
			squares[i][j] = this.state.nextIsX ? new TicTacToeSpace(true) : new TicTacToeSpace(false);
			nextIsX = !nextIsX;
			winner = this.checkWinner();
		}

		this.state = {
			squares: squares,
			nextIsX:nextIsX,
			winner:winner
		}

		return this.state;
	}

	checkWinner() {
		const winningLines = [
			[[0,0],[0,1],[0,2]],
			[[1,0],[1,1],[1,2]],
			[[2,0],[2,1],[2,2]],
			[[0,0],[1,0],[2,0]],
			[[0,1],[1,1],[2,1]],
			[[0,2],[1,2],[2,2]],
			[[0,0],[1,1],[2,2]],
			[[0,2],[1,1],[2,0]]
		]

		const squares = this.state.squares;
		let winner = ""
		for(let i = 0; i < winningLines.length; i++) {
			if(squares[winningLines[i][0][0]][winningLines[i][0][1]] instanceof TicTacToeSpace && 
				squares[winningLines[i][1][0]][winningLines[i][1][1]] instanceof TicTacToeSpace &&
				squares[winningLines[i][2][0]][winningLines[i][2][1]] instanceof TicTacToeSpace) {
				if(squares[winningLines[i][0][0]][winningLines[i][0][1]].isX === squares[winningLines[i][1][0]][winningLines[i][1][1]].isX &&
					squares[winningLines[i][0][0]][winningLines[i][0][1]].isX === squares[winningLines[i][2][0]][winningLines[i][2][1]].isX) {
					if(squares[winningLines[i][0][0]][winningLines[i][0][1]].isX) {
						winner = "X";
					} else {
						winner = "O";
					}
				}
			}
		}

		return winner;
	}

	setup() {
		let squares = new Array(3).fill(null);
		for(let i = 0; i < squares.length; i++) {
			squares[i] = new Array(3).fill(null);
		}

		for(let i = 0; i < squares.length; i++) {
			for(let j = 0; j < squares[i].length; j++) {
				squares[i][j] = new TicTacToeEmpty();
			}
		}

		this.state = {
			squares: squares,
			nextIsX:true,
			winner:""
		}

		return this.state;
	}

}

export class TicTacToeSpace {
	constructor(isX) {
		this.isX = isX;
	}

	getSymbol() {
		return this.isX ? "X" : "O";
	}

	getClasses(){
		let classes = "tic-tac-toe-square";
		
		return classes;
	}
}

export class TicTacToeEmpty {

	getSymbol() {
		return "";
	}

	getClasses(){
		let classes = "tic-tac-toe-square";

		return classes;
	}
}