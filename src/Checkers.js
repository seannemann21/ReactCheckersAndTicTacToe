
export class CheckersGame {

	constructor() {
		this.state = {};
	}

	setup() {
		let squares = new Array(8).fill(null);
		for(let i = 0; i<squares.length; i++) {
			squares[i] = new Array(8).fill(null);
		}
		// fill red pieces
		for(let i = 0; i < squares.length; i++) {
			for(let j = 0; j < squares[i].length; j++) {

				if(j<=2){
					if(i % 2 === j % 2) {
						squares[i][j] = new Checker(i, j, "red", false);
					}
				}

				if(j>=5) {
					if(i % 2 === j % 2) {
						squares[i][j] = new Checker(i, j, "black", false);;
					}
				}
				if(squares[i][j] == null) {
					squares[i][j] = new Empty(i, j, false);
				}
			}
		}

		this.state = {
			squares: squares,
			selectedSquare: [],
			nextTurnRed:true,
			showEndTurn:false,
			isPlayingCheckers: true,
			winner:""
		};

		return this.state;
	}


	clearSelectedSquares(squares) {
		for(let i = 0; i < squares.length; i++) {
			for(let j = 0; j < squares[i].length; j++) {
				if(squares[i][j] instanceof Empty && squares[i][j].isPossibleMove) {
					squares[i][j] = new Empty(i, j, false);
				}
			}
		}
	}


	handleClick(i,j) {
		const squares = this.state.squares.slice();
		let selectedSquare = this.state.selectedSquare.slice();
		let nextTurnRed = this.state.nextTurnRed;
		let showEndTurn = this.state.showEndTurn;
		let winner = "";
		if((squares[i][j] instanceof Checker && !nextTurnRed && squares[i][j].color === "red")
		||  (nextTurnRed && squares[i][j].color === "black")
		|| (showEndTurn && !(squares[i][j] instanceof Empty && squares[i][j].isPossibleMove))) {
			return;
		}
		if(squares[i][j] instanceof Empty && squares[i][j].isPossibleMove) {
			nextTurnRed = this.handleMoveSelection(squares, nextTurnRed, selectedSquare, i, j);
			if(nextTurnRed === this.state.nextTurnRed) {
				showEndTurn = true;
			} else {
				showEndTurn = false;
			}
			winner = this.checkWinner();
		} else if(squares[i][j] instanceof Checker) {
			this.handleCheckerSelection(squares, selectedSquare, i, j);
		}
		
		this.state = {squares: squares,
					   selectedSquare: selectedSquare,
					   nextTurnRed:nextTurnRed,
					   showEndTurn: showEndTurn,
					   winner: winner
					};

		return this.state;
	}

	checkWinner() {
		let blackCheckerFound = false;
		let redCheckerFound = false;
		const squares = this.state.squares;
		for(let i = 0; i < squares.length; i++) {
			for(let j = 0; j < squares[i].length; j++) {
				if(squares[i][j] instanceof Checker) {
					if(squares[i][j].color === "red") {
						redCheckerFound = true;
					} else {
						blackCheckerFound = true;
					}
				}
				if(redCheckerFound && blackCheckerFound) {
					break;
				}
			}
		}

		let result = "";
		if(!redCheckerFound) {
			result = "Black";
		} else if(!blackCheckerFound) {
			result = "Red";
		}

		return result;
	}

	handleCheckerSelection(squares, selectedSquare, checkerXPosition, checkerYPosition) {
		this.clearSelectedSquares(squares);
		const allMoves = squares[checkerXPosition][checkerYPosition].getAllMoves(squares);
		for(let i in allMoves[0]) {
			const move = allMoves[0][i];
			squares[move[0]][move[1]] = new Empty(move[0], move[1], true);
		}
		for(let i in allMoves[1]) {
			const move = allMoves[1][i];
			squares[move[0]][move[1]] = new Empty(move[0], move[1], true);
		}
		selectedSquare[0] = checkerXPosition;
		selectedSquare[1] = checkerYPosition;
	}

	handleMoveSelection(squares, nextTurnRed, selectedSquare, newXPosition, newYPosition) {
		this.clearSelectedSquares(squares);
		var checkerJumped = this.moveChecker(squares, selectedSquare[0], selectedSquare[1], newXPosition, newYPosition);
		// new X/Y positions are now the position of the checker
		if(this.isCheckerAtOppositeEnd(squares, newXPosition, newYPosition, squares[newXPosition][newYPosition])) {
			this.kingChecker(squares, newXPosition, newYPosition);
		}
		let allAvailableMoves = [];
		if(checkerJumped) {
			// allMoves[0] = normal moves, allMoves[1] = jump moves
			allAvailableMoves = squares[newXPosition][newYPosition].getAllMoves(squares);
			// only show jump moves
			for(let i in allAvailableMoves[1]) {
				const move = allAvailableMoves[1][i];
				squares[move[0]][move[1]] = new Empty(move[0], move[1], true);
			}
			selectedSquare[0] = newXPosition;
			selectedSquare[1] = newYPosition;

		}
		// turn ends if checker took a normal move or there are no more jumps left
		if(!checkerJumped || allAvailableMoves[1].length === 0) {
			nextTurnRed = !nextTurnRed;
		}

		return nextTurnRed;
	}

	moveChecker(squares, oldXPosition, oldYPosition, newXPosition, newYPosition) {
			squares[newXPosition][newYPosition] = new Checker(newXPosition, newYPosition, squares[oldXPosition][oldYPosition].color, squares[oldXPosition][oldYPosition].isKing);
			squares[oldXPosition][oldYPosition] = new Empty(oldXPosition, oldYPosition, false);
			let checkerJumped = false;
			// check if checker jumped
			if(oldXPosition - newXPosition === 2 || newXPosition - oldXPosition ===2) {
				checkerJumped = true;
				// remove jumped checker
				const jumpXCoordinate = (oldXPosition + newXPosition) /2;
				const jumpYCoordinate = (oldYPosition + newYPosition) /2;
				squares[jumpXCoordinate][jumpYCoordinate] = new Empty(jumpXCoordinate, jumpYCoordinate, false);
			}

			return checkerJumped;
	}

	kingChecker(squares, xPosition, yPosition) {
		squares[xPosition][yPosition] = new Checker(xPosition, yPosition, squares[xPosition][yPosition].color, true);
	}

	isCheckerAtOppositeEnd(squares, xPosition, yPosition, checker) {
		return (checker.color === "red" && yPosition===squares[xPosition].length - 1) ||
			   (checker.color === "black" && yPosition===0);
	}

	endTurn() {
		const squares = this.state.squares.slice();

		this.clearSelectedSquares(squares);

		this.state = {squares: squares,
					   selectedSquare: this.state.selectedSquare,
					   nextTurnRed: !this.state.nextTurnRed,
					   showEndTurn: false,
					};

		return this.state;
	}

}

export class Checker {
	constructor(xPosition, yPosition, color, isKing) {
		this.xPosition = xPosition;
		this.yPosition = yPosition;
		this.color = color;
		this.isKing = isKing;
	}

	getSymbol() {
		return this.isKing ? "K" : "O";
	}

	getClasses() {
		let classes = "square";
		if(this.color==="red") {
			classes += " red-checker";
		} else {
			classes += " black-checker";
		}

		if(this.isKing) {
			classes += " king";
		}

		classes += getSquareColorClass(this.xPosition, this.yPosition);

		return classes;
	}


	getAllMoves(squares) {
		// red on bottom of screen
		const allMoves = [];
		const normalMoves = [];
		const jumpMoves = [];
		let yDir = 1;
		let otherColor = "black";
		if(this.color === "black") {
			yDir = -1;
			otherColor = "red";
		}

		this.getMoves(squares, this.xPosition, this.yPosition, yDir, normalMoves, jumpMoves, otherColor);
		if(this.isKing) {
			yDir*=-1;
			this.getMoves(squares, this.xPosition, this.yPosition, yDir, normalMoves, jumpMoves, otherColor);
		}

		// filter out impossible moves
		const possibleMoves = [];
		for(let i in normalMoves) {
			let move = normalMoves[i];
			if(move[0]<squares.length && move[0] >= 0 && move[1]>=0 && move[1] < squares[move[0]].length 
				&& !(squares[move[0]][move[1]] instanceof Checker)) {
				possibleMoves.push(move);
			}
		}
		allMoves[0] = possibleMoves;
		allMoves[1] = jumpMoves;
		return allMoves;
	}

	getMoves(squares, xPosition, yPosition, yDir, normalMoves, jumpMoves, otherColor) {
		// get normal moves
		normalMoves.push([xPosition+1,yPosition+1*yDir]);
		normalMoves.push([xPosition-1,yPosition+1*yDir]);

		// get hop moves

		if(xPosition + 2 >= 0 && xPosition + 2 < squares.length
		&& yPosition + 2*yDir >= 0 && yPosition + 2*yDir < squares.length
		&& squares[xPosition+1][yPosition + 1*yDir] instanceof Checker
		&& squares[xPosition+1][yPosition + 1*yDir].color === otherColor
		&& squares[xPosition + 2][yPosition+2*yDir] instanceof Empty) {
			jumpMoves.push([xPosition+2,yPosition + 2*yDir]);
		}
		if(xPosition - 2 >= 0 && xPosition - 2 < squares.length
		&& yPosition + 2*yDir >= 0 && yPosition + 2*yDir < squares.length
		&& squares[xPosition-1][yPosition + 1*yDir] instanceof Checker
		&& squares[xPosition - 1][yPosition + 1*yDir].color === otherColor 
		&& squares[xPosition - 2][yPosition+2*yDir] instanceof Empty) {
			jumpMoves.push([xPosition-2,yPosition + 2*yDir]);
		}
	}
}


export class Empty {
	constructor(xPosition, yPosition, isPossibleMove) {
		this.isPossibleMove = isPossibleMove;
		this.xPosition = xPosition;
		this.yPosition = yPosition;
	}

	getSymbol() {
		return "";
	}

	getClasses() {
		let classes = "square";
		if(this.isPossibleMove) {
			classes += " normal-move";
		}

		classes += getSquareColorClass(this.xPosition, this.yPosition);

		return classes;
	}
}

function getSquareColorClass(xPosition, yPosition) {
	let squareColorClass = " secondary-color"
	if(xPosition % 2 === yPosition % 2) {
		squareColorClass = " primary-color"
	}

	return squareColorClass;
}