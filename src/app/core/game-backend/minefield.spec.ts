import { GameConfig } from './types/game-config';
import { Minefield } from './minefield';
import { Position } from './types/position';
import { Demine } from './types/demine';

describe('Game Backend - Minefield', () => {
  let minefield: Minefield;
  const config: GameConfig = {cols: 10, rows: 11, mines: 12};

  beforeEach(() => {
    minefield = new Minefield(config);
  });


  it('#field', () => {
    const position: Position = {col: 1, row: 2};
    expect(minefield.field(position)).toEqual(jasmine.objectContaining(position));
  });


  it('#minesCount', () => {
    expect(minefield.minesCount()).toEqual(config.mines);
  });


  it('#open', () => {
    const position: Position = {col: 1, row: 2};
    const field = minefield.field(position);
    field.setMine(false);
    expect(minefield.open(position)).toEqual(Demine.Success);
    field.setMine(true);
    expect(minefield.open(position)).toEqual(Demine.Lose);
    // TODO test case Demine.Win
  });


  // TODO test toString()
  it('#toString - TODO', () => {
    expect(true).toBe(true);
  });


});
