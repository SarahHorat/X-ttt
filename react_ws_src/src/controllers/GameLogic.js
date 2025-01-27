import io from 'socket.io-client'

import TweenMax from 'gsap'

import AI_controller from './AIController'
import rand_to_fro from '../helpers/rand_to_fro'

export default class GameLogic {

  constructor(game_type, update_model, end_game, game_difficulty) {
    this.game_type = game_type;
    this.update_model = update_model;
    this.game_difficulty = game_difficulty;
    this.end_game = end_game;
    this.win_sets = [
          ['c1', 'c2', 'c3'],
          ['c4', 'c5', 'c6'],
          ['c7', 'c8', 'c9'],

          ['c1', 'c4', 'c7'],
          ['c2', 'c5', 'c8'],
          ['c3', 'c6', 'c9'],

          ['c1', 'c5', 'c9'],
          ['c3', 'c5', 'c7']
        ]

    if (this.game_type != 'live') {
      this.cell_vals = {};
      this.next_turn_ply = true;
      this.game_play = true;
      this.game_stat = 'Start game';
    } else {
      this.sock_start()

      this.cell_vals = {};
      this.next_turn_ply = true;
      this.game_play = false;
      this.game_stat = 'Connecting';
    }
  };

  sock_start() {
    this.socket = io(app.settings.ws_conf.loc.SOCKET__io.u);

    this.socket.on('connect', function(data) {
      // console.log('socket connected', data)

      this.socket.emit('new player', { name: app.settings.curr_user.name });

    }.bind(this));

    this.socket.on('pair_players', function(data) {
      // console.log('paired with ', data)

      this.next_turn_ply = data.mode=='m';
      this.game_play = true;
      this.game_stat = 'Playing with ' + data.opp.name;

    }.bind(this));

    this.socket.on('opp_turn', turn_opp_live.bind(this));

  }

  componentWillUnmount () {

    this.socket && this.socket.disconnect();
  }

  click_cell (e, refs) {
    this.refs = refs;
    if (!this.next_turn_ply || !this.game_play) return

    const cell_id = e.currentTarget.id.substr(11)
    if (this.cell_vals[cell_id]) return

    if (this.game_type != 'live')
      this.turn_ply_comp(cell_id)
    else
      this.turn_ply_live(cell_id)
  }

  turn_ply_comp (cell_id) {

    let cell_vals = this.cell_vals;

    cell_vals[cell_id] = 'x'

    TweenMax.from(this.refs[cell_id], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

    this.cell_vals = cell_vals

    this.check_turn()
  }

  turn_comp () {
    if (this.game_difficulty == 'easy') {
      this.cell_vals = AI_controller.take_easy_turn(this.refs, this.cell_vals, this.win_sets);
    } else if (this.game_difficulty == 'medium') {
      this.cell_vals = AI_controller.take_medium_turn(this.refs, this.cell_vals, this.win_sets);
    } else {
      this.cell_vals = AI_controller.take_hard_turn(this.refs, this.cell_vals, this.win_sets);
    }
    this.check_turn()
    this.update_model()
  }

  turn_ply_live (cell_id) {

    let cell_vals = this.cell_vals

    cell_vals[cell_id] = 'x'

    TweenMax.from(this.refs[cell_id], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

    this.socket.emit('ply_turn', { cell_id: cell_id });

    this.cell_vals = cell_vals

    this.check_turn()
  }

  turn_opp_live (data) {

    let cell_vals = this.cell_vals
    let empty_cells_arr = []


    const c = data.cell_id
    cell_vals[c] = 'o'

    TweenMax.from(this.refs[c], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})

    this.cell_vals = cell_vals

    this.check_turn()
  }

  check_turn () {

    const cell_vals = this.cell_vals

    let win = false
    let set
    let fin = true

    if (this.game_type!='live')
      this.game_stat = 'Play'


    for (let i=0; !win && i < this.win_sets.length; i++) {
      set = this.win_sets[i]
      if (cell_vals[set[0]] && cell_vals[set[0]]==cell_vals[set[1]] && cell_vals[set[0]]==cell_vals[set[2]])
        win = true
    }


    for (let i=1; i<=9; i++)
      !cell_vals['c'+i] && (fin = false)

    if (win) {

      this.refs[set[0]].classList.add('win')
      this.refs[set[1]].classList.add('win')
      this.refs[set[2]].classList.add('win')

      TweenMax.killAll(true)
      TweenMax.from('td.win', 1, {opacity: 0, ease: Linear.easeIn})

      this.game_stat = (cell_vals[set[0]]=='x'?'You':'Opponent')+' win';
      this.game_play = false;

      this.socket && this.socket.disconnect();

    } else if (fin) {

      this.game_stat = 'Draw';
      this.game_play = false;

      this.socket && this.socket.disconnect();

    } else {
      this.game_type!='live' && this.next_turn_ply && setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

      this.next_turn_ply = !this.next_turn_ply
    }
  }

  end_game () {
    this.socket && this.socket.disconnect();
    this.end_game();
  }
}