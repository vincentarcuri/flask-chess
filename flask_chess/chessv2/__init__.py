from flask import Flask
from chessv2.views import chess

app = Flask(__name__, static_url_path='/static')
app.register_blueprint(chess)