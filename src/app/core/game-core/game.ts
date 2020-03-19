import { Minefield } from './minefield';
import { Position } from './position';
import { GameConfig } from './game-config';
import configs from './game.configs.json';
import { MoveResult } from './move-result';


export class Game {
  private gameOver = false;
  private minefield: Minefield;

  constructor() {
  }


  currentMap(): string {
    return this.minefield.toString(this.gameOver);
  }


  openField(position: Position): MoveResult {
    const result = this.minefield.open(position);
    if (result === MoveResult.Lose) {
      this.gameOver = true;
    }
    return result;
  }


  startGame(level: number): void {
    this.gameOver = false;
    this.minefield = new Minefield(this.levelConfig(level));
  }

  minesCount(): number {
    return this.minefield.minesCount();
  }


  private levelConfig(level: number): GameConfig {
    const levels: { [level: string]: GameConfig } = configs.levels;
    return levels[level];
  }


}
