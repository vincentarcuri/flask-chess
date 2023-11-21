from flask import Blueprint, render_template, jsonify, request, make_response
from chessv2.models import Controller
chess = Blueprint('chess', __name__)

controller: Controller = None

@chess.route('/')
def home():
    return render_template("home.html")

@chess.route('/play')
def play():
    global controller 
    controller = Controller()
    return render_template('play2.html')

@chess.route('/get-info', methods=["GET"])
def fetch():
    return controller.request_GET()

@chess.route('/nextTurn', methods=["POST"])
def next_turn():
    req = request.get_json()
    if req['action'] == "next":
        controller.increment_turn()
    res = make_response(jsonify({"message": "JSON received"}), 200)


    return res

@chess.route('/square', methods=["POST"])
def square():
    req = request.get_json()
    res = make_response(controller.request_POST(req), 200)
    return res

@chess.route('/promote', methods=['POST'])
def promote():
    req = request.get_json()
    res = make_response(controller.promote_POST(req), 200)
    return res

@chess.route('/checkmate/<player>')
def checkmate(player):
    if player == "white":
        player = "Black"
    else:
        player = "White"
    return f"Checkmate {player} wins"

@chess.route('/draw')
def draw():
    return "Draw"

