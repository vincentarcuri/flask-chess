

// Fetch Request Functions
function initialGETRequest(path) {
    fetch(`${window.origin}/get-info`)
    .then(data => {
        return data.json();
    })
    .then(data => {
        console.log(data);
        loadPiecesFromJSON(data);
    });
}

function handleGameState(json_obj) {
    const chessBoardDiv = document.getElementById("chessBoardDiv");
    const gameState = json_obj.state;
    if (gameState == "play") {
        loadPiecesFromJSON(json_obj);
    } else if (gameState == "promotion") {
        showPromotionWindow(json_obj.player);
    } else if (gameState == "checkmate") {
        // Handle checkmate
        loadPiecesFromJSON(json_obj);
        chessBoardDiv.classList.add("fade-out");
        chessBoardDiv.classList.add("clicks-off")
        setTimeout(function() {
            window.open(`${window.origin}/checkmate/${json_obj.player}`, "_self");
        }, 3000);
        console.log("checkmate");
    } else if (gameState == "stalemate") {
        loadPiecesFromJSON(json_obj);
        chessBoardDiv.classList.add("fade-out");
        chessBoardDiv.classList.add("clicks-off")
        setTimeout(function() {
            window.open(`${window.origin}/draw`, "_self");
        }, 3000);
        console.log("stalemate")
    }

}

function postRequest(evt) {
    let target = evt.target;
    if (target.tagName == 'TD') {
        squareId = target.id;
    } else {
        squareId = target.dataset.square;
    }
    let squareEntry = {square: squareId}
    let jsonPost = {
        method: "POST",
        cache: "no-cache",
        headers: new Headers({
            'content-type': 'application/json'
        }),
        body: JSON.stringify(squareEntry)
    }
    fetch(`${window.origin}/square`, jsonPost).then(function (response) {
        if (response.status != 200) {
            console.log("Error" + response.status);
        }
        else {
            return response.json()
            // let json = response.json()
            // console.log(json);
            // console.log('meow')
            // loadPiecesFromJSON(json);
        }
    }).then(json_obj => {
        handleGameState(json_obj);
        // if (json_obj.state == 'play') {
        //     loadPiecesFromJSON(json_obj);
        // } else if (json_obj.state == "promotion"){
        //     showPromotionWindow(json_obj.player);
        // }
        // console.log(json_obj);
    });
  
}

function promoteRequest(evt) {
    const promotion_letter = evt.target.dataset.letter;
    console.log(evt.target);
    const entry = {promote_to: promotion_letter}
    let jsonPost = {
        method: "POST",
        cache: "no-cache",
        headers: new Headers({
            'content-type': 'application/json'
        }),
        body: JSON.stringify(entry)
    }
    fetch(`${window.origin}/promote`, jsonPost)
    .then(function (response) {
        if (response.status != 200) {
            console.log("Error " + response.status);
        }
        else {return response.json()}
    }).then(json_obj => {
        handleGameState(json_obj);
        // if (json_obj.state == "play") {
        //     loadPiecesFromJSON(json_obj)
        // }
    });
    const overlay = document.getElementById("promoteOverlay");
    overlay.remove();
}

// Load Promotions Window
function showPromotionWindow(color) {
    const chessBoard = document.getElementById("chessBoardDiv");
    let overlay = document.createElement("div");
    overlay.id = "promoteOverlay";
    
    const table = document.createElement("table");
    const tr = document.createElement("tr");
    for (const letter of "QBNR".split("")) {
        let td = document.createElement("td");
        td.dataset.letter = letter;
        let img = document.createElement("img");
        img.dataset.letter = letter;
        img.src = '/static/images/' + color[0] + letter + ".svg";
        td.appendChild(img);
        td.addEventListener("click", promoteRequest);
        tr.appendChild(td);
    }
    table.appendChild(tr);
    overlay.appendChild(table);
    chessBoard.appendChild(overlay);

}


function highlightPlayer(player) {
    const bottomPlayer = document.getElementById("playerBottom");
    const topPlayer = document.getElementById("playerTop");
    
    bottomPlayer.classList.remove("player-turn");
    topPlayer.classList.remove("player-turn");

    boardFlipped = isBoardFlipped();
    
    if (boardFlipped) {
        if (player == "black") {
            bottomPlayer.classList.add("player-turn");
        } else {
            topPlayer.classList.add("player-turn");
        }
    } else {
        if (player == "white") {
            bottomPlayer.classList.add("player-turn");
        } else {
            topPlayer.classList.add("player-turn");
        }
    }
}

// Load Pieces
function loadPiecesFromJSON(json_obj) {
    const img_path = '/static/images';
    let pieceInfo = json_obj.board;
    for (let piece of pieceInfo) {
        let img = document.querySelector("#" + piece.position + " > img");
        if (piece.piece == null) {
            img.src = "";
            //img.removeEventListener("click");
        } else {
            img.src = img_path + "/" + piece.img;
            //img.addEventListener("click", postRequest);
        }
    }
    highlightPlayer(json_obj.player)
}

function isBoardFlipped() {
    let table = document.getElementById("board");
    let firstSquare = table.children[0].children[0].id;
    if (firstSquare == "a8") {
        return false;
    } else {
        return true;
    }
}

// Function to flip the board
function flipBoard() {
    let table = document.getElementById("board");
    let boardFlipped = isBoardFlipped()
    table.remove();
    if (boardFlipped) {
        buildWhiteTable();
    } else {
        buildBlackTable();
    }
    // Call initialGETRequest to reload pieces
    addAllListeners();
    initialGETRequest();
}


function addAllListeners() {
    // Add event listeners for fetch requests
    const squares = document.querySelectorAll("#board td");
    for (const square of squares) {
        square.addEventListener("click", postRequest);
    }
    // Add flip board button listener
    const flipBtn = document.getElementById("flipBtn");
    flipBtn.addEventListener("click", flipBoard);
}


