import { Minefield } from './minefield';
import { Position } from './position';
import { GameConfig } from './game-config';
import configs from './game.configs.json';


export class Game {
  private gameOver = false;
  private minefield: Minefield;

  constructor() {
  }


  currentMap(): string {
    return this.minefield.toString(this.gameOver);
  }


  openField(position: Position): 'fail' | 'success' {
    const result = this.minefield.openField(position);
    if (result === 'fail') {
      this.gameOver = true;
    }
    return result;
  }


  startGame(level: number): void {
    this.gameOver = false;
    this.minefield = new Minefield(this.levelConfig(level));
  }


  private levelConfig(level: number): GameConfig {
    const levels: { [level: string]: GameConfig } = configs.levels;
    return levels[level];
  }


}
