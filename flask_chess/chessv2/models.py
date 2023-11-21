import json

import chessv2.chess_logic as chs
from chessv2.piece_loader import PieceLoader

class GameInfo:

    def __init__(self, state: str, selection: chs.Piece | None, player: str, turn: int, board: list[dict], moves: list | None = None):
        self.state = state
        self.selection = selection,
        self.player = player
        self.turn = turn
        self.board = board

    def to_json(self):
        json_dict = {
            "state": self.state,
            "player": self.player,
            "turn": self.turn,
            "board": self.board,
        }
        return json.dumps(json_dict)

class Controller:

    def __init__(self):
        self.game = chs.Game()

        # For testing promotion
        #self.game.board.pieces.piece_list = PieceLoader.load_white_pawn_promotion()

        #For testing checkmate
        #self.game.board.pieces.piece_list = PieceLoader.load_one_move_to_checkmate()

        self.ready_to_select_move = False
        self.game_state_strings: dict = {
            chs.GameState.PLAY: "play",
            chs.GameState.CHECKMATE: "checkmate",
            chs.GameState.STALEMATE: "stalemate",
            chs.SelectionType.PROMOTION: "promotion",
        }

    def _get_player(self):
        return ('black', 'white')[self.game.determine_color()]

    def _get_board_info(self):
        all_squares = [f'{letter}{num}' for letter in list("abcdefgh") for num in range(1, 9)]
        board_list = [] 
        piece_positions = self.game.board.pieces.get_dict('instance', 'position')
        for item in piece_positions.items():
            piece: chs.Piece = item[0]
            position: str = item[1]
            piece_name = piece.__class__.__name__
            if piece_name == "Pawn":
                piece_letter = "P"
            else:
                piece_letter = piece.letter
            color = ("black", "white")[piece.white]
            item_dict = {
                'position': position,
                'piece': piece_name,
                'color': color,
                'img': color[0] + piece_letter + ".svg",
            }
            board_list.append(item_dict)
            all_squares.remove(position)
        for leftover in all_squares:
            item_dict = {
                'position': leftover,
                'piece': None,
                'color': None,
                'img': None,
            }
            board_list.append(item_dict)
        return board_list
    
    def handle_input(self, square) -> GameInfo:
        if not self.ready_to_select_move:
            selection_message = self.game.select_piece(square)
            print(selection_message)
            match selection_message:
                case chs.SelectionType.NO_PIECE:
                    return GameInfo(
                        state='play',
                        selection=None,
                        turn=self.game.turn,
                        player=self._get_player(),
                        board = self._get_board_info(),
                    )
                case chs.SelectionType.SELECTED:
                    self.ready_to_select_move = True
                    return GameInfo(
                        state='play',
                        selection = self.game.piece_selection.position,
                        turn = self.game.turn,
                        player = self._get_player(),
                        board = self._get_board_info(),
                        moves = list(self.game.board.pieces.get_dict(
                            'position', 'moves', self.game.determine_color(), self.game.board)[self.game.piece_selection.position])
                    )
        else:
            selection_message = self.game.select_move(square)
            print(selection_message)
            match selection_message:
                case chs.SelectionType.RESELECT:
                    return GameInfo(
                        state='play',
                        selection = self.game.piece_selection.position,
                        turn = self.game.turn,
                        player = self._get_player(),
                        board = self._get_board_info(),
                        moves = list(self.game.piece_selection.get_moves(self.game.board))
                    )
                case chs.SelectionType.NO_MOVE:
                    return GameInfo(
                        state='play',
                        selection = self.game.piece_selection.position,
                        turn = self.game.turn,
                        player = self._get_player(),
                        board = self._get_board_info(),
                        moves = list(self.game.piece_selection.get_moves(self.game.board))
                    )
                case chs.SelectionType.SELECTED:
                    game_state = self.game.move_and_next_turn()
                    self.ready_to_select_move = False
                    return GameInfo(
                        state=self.game_state_strings[game_state],
                        selection=None,
                        turn=self.game.turn,
                        player=self._get_player(),
                        board = self._get_board_info(),
                        moves=None,
                    )
                case chs.SelectionType.PROMOTION:
                    return GameInfo(
                        state=self.game_state_strings[selection_message],
                        selection=self.game.piece_selection.position,
                        turn=self.game.turn,
                        player=self._get_player(),
                        board=self._get_board_info(),
                        moves=None,
                    )

    
    def request_GET(self):
        game_info = GameInfo(
            state="play",
            selection=None,
            player=("black", "white")[self.game.determine_color()],
            turn = self.game.turn,
            board = self._get_board_info(),
            moves = None
        )
        return game_info.to_json()
    
    def request_POST(self, json_post):
        square = json_post['square']
        return self.handle_input(square).to_json()
    
    def promote_POST(self, json_post):
        promote_to = json_post["promote_to"]
        print(promote_to + "thisline")
        piece_to_promote = self.game.piece_selection
        position = piece_to_promote.position
        color = piece_to_promote.white
        self.game.board.promote(position, promote_to, color)
        self.game.piece_selection = self.game.board.get_piece_at(position)
        game_state = self.game.move_and_next_turn()
        self.ready_to_select_move = False
        game_info = GameInfo(
            state=self.game_state_strings[game_state],
            selection=None,
            player=self._get_player(),
            turn=self.game.turn,
            board=self._get_board_info(),
        )
        return game_info.to_json()



            

