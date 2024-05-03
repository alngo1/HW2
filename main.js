document.addEventListener("DOMContentLoaded", (event) => {
    function setupBoard(){
        //board
        let board = document.getElementById("checkers-board");
        board.style.minWidth = "300px";
        board.style.border = "2px solid pink";
        for(let i = 0; i < BOARD_HEIGHT; i++){
            board.insertAdjacentHTML("beforeend", `<div class="row" row-index="`+i+`" style="display:flex;"></div>`);
            for(let j = 0; j < BOARD_WIDTH; j++){
                let row = document.getElementsByClassName("row")[i];
                let color = P2_COLOR;
                //if i and j are both even or both odd then shade as white
                if(i % 2 == 0 && j % 2 == 0 || (i % 2 != 0 && j % 2 != 0)){
                    color = "white";
                }
                else{
                    color = "black";
                }
                row.insertAdjacentHTML("beforeend", `<div class="square" col-index="`+j+`" 
                    style="width: 40px; 
                    height: 40px; 
                    background-color: `+color+`;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid black; "></div>`);
            }
        }
        console.textContent = "Current Player: " + currPlayer;
    }
    
    function setupPieces(){
        let squares = document.getElementsByClassName("square");
        let currColor = P2_COLOR;
        // i is the row j is the colomns
        for(let i = 0; i < BOARD_HEIGHT; i++){
            //if 2 < i < 5 don't put anything
            if(i >= NUM_ROWS && i < BOARD_HEIGHT-NUM_ROWS){
                continue;
            }
            if(i > BOARD_HEIGHT/2){
                currColor = P1_COLOR;
            }
            for(let j = 0; j < BOARD_WIDTH; j++){
                //if the square is black/ the indicies are one odd and one even then make a piece there
                if((i % 2 == 0 && j % 2 != 0) || (i % 2 != 0 && j % 2 == 0))
                {
                    //the i * board_height allows our indecies to not overlap
                    //for example (0, 1) and (1, 0) if i+j would both give 1, but with board height modifying the i then one maps to 1 the other to 8
                    //I've also added the "currColor" to both the class and the css
                    //set pointer events of the pieces to be none so it doesn't interfere with gameplay clicks on the squares
                    squares[i*BOARD_HEIGHT+j].insertAdjacentHTML("afterBegin", `<div class="piece" piece-color="`+ currColor +`" style="width: 20px; 
                    height: 20px; 
                    background-color:` + currColor + `;
                    border: 2px dotted black; border-radius: 100px;
                    pointer-events: none;
                    "></div>`);    
                }
            }
        }
        //add event handler to all squares
        for(let k = 0; k < squares.length; k++){
            squares[k].addEventListener('click', handleSquareClick);
        }
    }
    
    
    function handleSquareClick(event){
        //if piece selected is false and a square has been clicked
        // check if that square has a piece
        // if not then send a message or do nothing
        // if it does then pieceSelected = true and get that piece;
        const clickedSquare = event.target;
        let piece = clickedSquare.firstElementChild;
        let pieceColor = null;
        if(piece != null){
            pieceColor = piece.getAttribute("piece-color");
        }
    
        //do not switch turns till a viable move is made
        //update board
        if(pieceSelected == false && (pieceColor != null && pieceColor == currPlayer)){
            currPiece = clickedSquare.firstElementChild;
            if(currPiece != null){
                currPiece.style.border = "4px solid yellow";
                pieceSelected = true;
            }
        }
        else if(pieceSelected == true){
            //if selected another piece while holding a piece switch selection
            if(currPiece != null && clickedSquare.firstElementChild != null && (pieceColor != null && pieceColor == currPlayer)){            
                currPiece.style.border = "2px dotted black";
                currPiece = clickedSquare.firstElementChild
                currPiece.style.border = "4px solid yellow";
            //if selected an empty square check if its a viable move or edible move, and if so move it
            }else if(currPiece != null && clickedSquare.firstElementChild == null){
                //get the coords of the current piece
                //get viable moves from current piece
                let currPieceCoords = getCoordsFromPiece(currPiece);
                let moves = getViableMoves(currPieceCoords[0], currPieceCoords[1]);
                //get the coords of the square we want to move to
                let coordsToMove = getCoordsFromSquare(clickedSquare);
                //for all the viable moves check if the move we want to go to has a match and if so then move it
                if(canDoubleJump == false){
                    for(let i = 0; i < moves.length; i++){
                        if(coordsToMove[0] == moves[i][0] && coordsToMove[1] == moves[i][1]){
                            //grab the curr piece color
                            let currColor = currPiece.getAttribute("piece-color");
                            //remove currPiece
                            let currSquare = currPiece.parentNode;
                            currSquare.removeChild(currPiece);
                            //create new piece
                            let newSquare = getSquareFromCoords(moves[i][0], moves[i][1]);
                            newSquare.insertAdjacentHTML("afterBegin", `<div class="piece" piece-color="`+ currColor +`"  style="width: 20px; 
                            height: 20px; 
                            background-color:` + currColor + `;
                            border: 2px dotted black; border-radius: 100px;
                            pointer-events: none;
                            "></div>`);
    
                            hasMoved = true;
    
    
                            //stop loop
                            break; 
                        }
                    }
                }
                let edibleMoves = getEdibleMoves(currPieceCoords[0], currPieceCoords[1]);
                for(let i = 0; i < edibleMoves.length; i++){
                    if(coordsToMove[0] == edibleMoves[i][0] && coordsToMove[1] == edibleMoves[i][1]){
                        //grab the curr piece color and coords
                        let currColor = currPiece.getAttribute("piece-color");
                        let currCoords = getCoordsFromPiece(currPiece);
    
                        //get piece to eat, if its a different color eat it otherwise skip
                        let eatenSquare = getSquareFromCoords(currCoords[0] + (edibleMoves[i][0] - currCoords[0])/2, currCoords[1] + (edibleMoves[i][1] - currCoords[1])/2);
                        let eatenPiece = eatenSquare.firstElementChild;
                        if(eatenPiece.getAttribute("piece-color") == P2_COLOR){
                            num_white--;
                        }else{
                            num_red--;
                        }
                        eatenSquare.removeChild(eatenPiece);
    
                        //remove currPiece
                        let currSquare = currPiece.parentNode;
                        currSquare.removeChild(currPiece);
                        //create new piece
                        let newSquare = getSquareFromCoords(edibleMoves[i][0], edibleMoves[i][1]);
                        newSquare.insertAdjacentHTML("afterBegin", `<div class="piece" piece-color="`+ currColor +`"  style="width: 20px; 
                        height: 20px; 
                        background-color:` + currColor + `;
                        border: 2px dotted black; border-radius: 100px;
                        pointer-events: none;
                        "></div>`);
                        
    
                        //if it just did an edible double jump disable the doubleJump bool
                        if(canDoubleJump == true){
                            canDoubleJump = false;
                        }
    
                        //check if game is over
                        checkWin();
    
                        //allow double jump
                        currPiece = newSquare.firstElementChild;
                        currPieceCoords = getCoordsFromPiece(currPiece);
                        edibleMoves = getEdibleMoves(currPieceCoords[0], currPieceCoords[1]);
                        if(edibleMoves.length > 0){
                            canDoubleJump = true;
                        }
    
                        hasMoved = true;
                        //stop loop
                        break;
                    }
                }
                
    
                //only gets here when a move is made
                //when moved and can't double jump then switch turns
                if(hasMoved == true && currPlayer == P2_COLOR && canDoubleJump == false){
                    currPlayer = P1_COLOR;
                    pieceSelected = false;
                    currPiece = null;
                    hasMoved = false;
                }else if(hasMoved == true && currPlayer == P1_COLOR && canDoubleJump == false){
                    currPlayer = P2_COLOR;
                    pieceSelected = false;
                    currPiece = null;
                    hasMoved = false;
                }
                console.textContent = "Current Player: " + currPlayer;

            }
        }
    }
    
    function checkWin(){
        if(num_white == 0){
            gameOver = true;
            console.textContent = "RED WINS";
        }else if(num_red == 0){
            gameOver = true;
            console.textContent = "WHITE WINS";
        }
    }
    
    function getCoordsFromPiece(pieceNode){
        let parentSquare = pieceNode.parentNode;
        let x = parseInt(parentSquare.getAttribute('col-index'));
        let y = parseInt(parentSquare.parentNode.getAttribute('row-index'));
        return [x, y]
    }
    
    function getCoordsFromSquare(squareNode){
        let x = parseInt(squareNode.getAttribute('col-index'));
        let y = parseInt(squareNode.parentNode.getAttribute('row-index'));
        return [x, y]
    }
    
    function getSquareFromCoords(x, y){
        let row = document.getElementsByClassName("row")[y];
        let square = row.children[x];
        return square;
    }
    
    //x is the horizontal, y is the vertical
    //lets makeit so when we put in a coordinate it returns an array of moves we can make
    function getViableMoves(x, y){
        let viableMoves = []; //moves to empty squares
        // one row down from selected piece
        if(x+1 < BOARD_WIDTH && y+1 < BOARD_HEIGHT){
            if(getSquareFromCoords(x+1, y+1).firstElementChild == null)
                viableMoves.push([x+1, y+1]);
        }
        if(x-1 >= 0 && y+1 < BOARD_HEIGHT){
            if(getSquareFromCoords(x-1, y+1).firstElementChild == null)
                viableMoves.push([x-1, y+1])
        }
        // one row up from selected piece
        if(x-1 >= 0 && y-1 >= 0){
            if(getSquareFromCoords(x-1, y-1).firstElementChild == null)
                viableMoves.push([x-1, y-1]);
        }
        if(x+1 < BOARD_WIDTH && y-1 >= 0){
            if(getSquareFromCoords(x+1, y-1).firstElementChild == null)
                viableMoves.push([x+1, y-1]);
        }
    
        return viableMoves;
    }
    
    function getEdibleMoves(x, y){
        let edibleMoves = []; //moves to eat
    
        //edible moves
        if(x+2 < BOARD_HEIGHT && y+2 < BOARD_WIDTH){
            if(getSquareFromCoords(x+2, y+2).firstElementChild == null && getSquareFromCoords(x+1, y+1).firstElementChild != null && getSquareFromCoords(x+1, y+1).firstElementChild.getAttribute("piece-color") != currPlayer)
                edibleMoves.push([x+2, y+2]);
        }
        if(x+2 < BOARD_HEIGHT && y-2 >= 0){
            if(getSquareFromCoords(x+2, y-2).firstElementChild == null && getSquareFromCoords(x+1, y-1).firstElementChild != null && getSquareFromCoords(x+1, y-1).firstElementChild.getAttribute("piece-color") != currPlayer)
                edibleMoves.push([x+2, y-2])
        }
        //move one row up
        if(x-2 >= 0 && y-2 >= 0){
            if(getSquareFromCoords(x-2, y-2).firstElementChild == null && getSquareFromCoords(x-1, y-1).firstElementChild != null && getSquareFromCoords(x-1, y-1).firstElementChild.getAttribute("piece-color") != currPlayer)
                edibleMoves.push([x-2, y-2]);
        }
        if(x-2 >= 0 && y+2 < BOARD_WIDTH){
            if(getSquareFromCoords(x-2, y+2).firstElementChild == null && getSquareFromCoords(x-1, y+1).firstElementChild != null && getSquareFromCoords(x-1, y+1).firstElementChild.getAttribute("piece-color") != currPlayer)
                edibleMoves.push([x-2, y+2]);
        }
    
        return edibleMoves;
    }
    
    
    function setupGame(){
        num_white = NUM_PIECES/2;
        num_red = NUM_PIECES/2;
        currPlayer = P1_COLOR;
        gameOver = false;
        pieceSelected = false;
        currPiece = null;
        hasMoved = false;
        setupBoard();
        setupPieces();
    }
    
    //constants
    const BOARD_WIDTH = 8;
    const BOARD_HEIGHT = 8;
    const NUM_PIECES = 24; //3*(NUM_COLS) or 4*(NUM_ROWS) based on if width or height is odd or even
    const NUM_ROWS = 3;
    const NUM_COLS = 8;
    const P1_COLOR = "red";
    const P2_COLOR = "white";
    
    //game variables
    let num_white = NUM_PIECES/2;
    let num_red = NUM_PIECES/2;
    let currPlayer = P1_COLOR;
    let gameOver = false;
    let pieceSelected = false;
    let currPiece = null;
    let hasMoved = false;
    let canDoubleJump = false;
    let console = document.getElementById("checkers-console");
    
    
    
    //deal with royals
    //deal with double jump
    //deal with edible
    //allow reset
    
    
    setupGame();
    
});


