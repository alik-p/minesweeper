import { GameLevel } from '../game-api';
import { Minefield } from './minefield';
import {Position} from './position';
import { GameConfig } from './game-config';
import { Field } from './field';

export class Game {
  private gameOver = false;
  private minefield: Minefield;

  private config: GameConfig = {
    cols: 9, rows: 9, mines: 10
  };

  constructor() {}


  currentMap(): string {
    return this.minefieldToString();
  }


  openField(position: Position): 'fail' | 'success' {
    const result = this.minefield.openField(position);
    if (result === 'fail') {
      this.gameOver = true;
    }
    return result;
  }


  startGame(level: number): void {
    // debugger
    this.gameOver = false;
    this.minefield = new Minefield(this.config); // TODO config
    console.log(this.minefield);
  }


  private minefieldToString(): string {
    let result = '';
    const {cols, rows} = this.config;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        result += this.fieldToString(
          this.minefield.field({row, col})
        );
      }
      result += '\n';
    }
    return result;
  }


  private fieldToString(field: Field): string {
    if (this.gameOver) {
      field.open();
    }
    return field.isOpened()
      ? (field.isMined() ? '*' : field.getMark().toString())
      : '?';
  }


}
