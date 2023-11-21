// Create the table for white's turn


function buildWhiteTable() {
    const whiteSquareEven = "aceg".split("");
    const whiteSquareOdd = "bdfh".split("");
    const chessBoardDiv = document.getElementById("chessBoardDiv");
    let table = document.createElement("table");
    table.id = "board";

    const files = "abcdefgh".split("");
    const ranks = "87654321".split("");
    for (const rank of ranks) {
        let tr = document.createElement("tr");
        tr.id = rank;
        for (const file of files) {
            let td = document.createElement("td");
            td.id = file + "" + rank;
            if (whiteSquareEven.includes(file) && Number(rank) % 2 == 0) {
                td.className = "light-square";
            } else if (whiteSquareOdd.includes(file) && Number(rank) % 2 == 1) {
                td.className = "light-square";
            } else {
                td.className = "dark-square";
            }
            td.className += " board-square";
            let img = document.createElement("img");
            img.src = "";
            img.dataset.square = file + "" + rank;
            td.appendChild(img);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    chessBoardDiv.appendChild(table);
    const whitePlayerImg = document.getElementById("playerBottomImg");
    whitePlayerImg.src = "static/images/wQ.svg";
    const blackPlayerImg = document.getElementById("playerTopImg");
    blackPlayerImg.src = 'static/images/bQ.svg';
}

function buildBlackTable() {
    const whiteSquareEven = "aceg".split("");
    const whiteSquareOdd = "bdfh".split("");
    const chessBoardDiv = document.getElementById("chessBoardDiv");
    let table = document.createElement("table");
    table.id = "board";

    const files = "hgfedcba".split("");
    const ranks = "12345678".split("");
    for (const rank of ranks) {
        let tr = document.createElement("tr");
        tr.id = rank;
        for (const file of files) {
            let td = document.createElement("td");
            td.id = file + "" + rank;
            if (whiteSquareEven.includes(file) && Number(rank) % 2 == 0) {
                td.className = "light-square";
            } else if (whiteSquareOdd.includes(file) && Number(rank) % 2 == 1) {
                td.className = "light-square";
            } else {
                td.className = "dark-square";
            }
            td.className += " board-square";
            let img = document.createElement("img");
            img.src = "";
            img.dataset.square = file + "" + rank;
            td.appendChild(img);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    chessBoardDiv.appendChild(table);
    const whitePlayerImg = document.getElementById("playerTopImg");
    whitePlayerImg.src = "static/images/wQ.svg";
    const blackPlayerImg = document.getElementById("playerBottomImg");
    blackPlayerImg.src = 'static/images/bQ.svg';
}




//buildWhiteTable();

/*
function loadPiecesFromJSON(JSONFile) {
    const img_path = "images/chess_pieces_svg"
    let pieceInfo = JSONFile.board;
    for (const piece of pieceInfo) {
        let img = document.querySelector("#" + piece.square + " > img");
        if (piece.piece == null) {
            img.src = ""
        } else {
            img.src = img_path + "/" + piece.img;
        }
    }
}
// We'll move this to another file but for now lets test reading the json file.

fetch("js/samples.json")
    .then(response => {return response.json();})
    .then(json => 
        //console.log(json)
        loadPiecesFromJSON(json));


*/