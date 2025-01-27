import rand_arr_elem from '../helpers/rand_arr_elem'

function take_easy_turn(refs, cell_vals, win_sets) {
  // The original random cell computer player
  let empty_cells_arr = []


  for (let i=1; i<=9; i++)
    !cell_vals['c'+i] && empty_cells_arr.push('c'+i)

  const c = rand_arr_elem(empty_cells_arr)
  placeNaught(cell_vals, c, refs)

  return cell_vals
}

function placeNaught(cell_vals, c, refs) {
  cell_vals[c] = 'o'

  TweenMax.from(refs[c], 0.7, { opacity: 0, scaleX: 0, scaleY: 0, ease: Power4.easeOut })
}

function take_medium_turn(refs, cell_vals, win_sets) {
  // Will now stop the first set of two of an opponent, and finish it's own set of 3 if available
  // otherwise it'll play randomly
  let empty_cells_arr = []

  for (const win_set of win_sets) {
    let x_pieces = 0;
    let o_pieces = 0;
    let free_pieces = 0;
    for (const position of win_set) {
      if (cell_vals[position] == 'x') {
        x_pieces++;
      } else if (cell_vals[position] == 'o') {
        o_pieces++;
      } else {
        free_pieces = position;
      }
    }
    if ((x_pieces == 2 || o_pieces == 2) && free_pieces != 0) {
      placeNaught(cell_vals, free_pieces, refs)
      return cell_vals
    }
  }

  for (let i=1; i<=9; i++)
    !cell_vals['c'+i] && empty_cells_arr.push('c'+i)

  const c = rand_arr_elem(empty_cells_arr)
  placeNaught(cell_vals, c, refs)

  return cell_vals;
}

function take_hard_turn(refs, cell_vals, win_sets) {
  // Plays basically optimally, except for thinking ahead about corner positions, to ensure it's still possible to beat occasionally
  let empty_cells_arr = []
  let corners = [ 'c1', 'c3', 'c7', 'c9' ]

  for (const win_set of win_sets) {
    let x_pieces = 0;
    let o_pieces = 0;
    let free_pieces = 0;
    for (const position of win_set) {
      if (cell_vals[position] == 'x') {
        x_pieces++;
      } else if (cell_vals[position] == 'o') {
        o_pieces++;
      } else {
        free_pieces = position;
      }
    }
    if ((x_pieces == 2 || o_pieces == 2) && free_pieces != 0) {
      placeNaught(cell_vals, free_pieces, refs)

      return cell_vals
    }
  }

  if (!cell_vals['c5']) {
    placeNaught(cell_vals, 'c5', refs)

    return cell_vals
  } else {
    for (const corner of corners) {
      if (!cell_vals[corner]) {
        placeNaught(cell_vals, corner, refs)

        return cell_vals
      }
    }
  }

  for (let i=1; i<=9; i++)
    !cell_vals['c'+i] && empty_cells_arr.push('c'+i)

  const c = rand_arr_elem(empty_cells_arr)
  placeNaught(cell_vals, c, refs)

  return cell_vals;
}

export default { take_easy_turn, take_medium_turn, take_hard_turn }