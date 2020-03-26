import { AppUtils } from '../app-utils';
import { GameConfig } from './types/game-config';
import { Position } from './types/position';
import { Field } from './field';
import { Demine } from './types/demine';


export class Minefield {

  private fields: Field[] = [];
  private opened = new Set<string>();

  constructor(private config: GameConfig) {
    this.init(this.config);
  }


  field(position: Position): Field {
    return this.fields.find(field =>
      field.row === position.row && field.col === position.col
    );
  }


  minesCount(): number {
    return this.config.mines;
  }


  open(position: Position): Demine {
    const field = this.field(position);
    if (field) {
      this.openFieldNeighbors(this.openField(field));
      return field.isMined()
        ? Demine.Lose
        : this.isWin() ? Demine.Win : Demine.Success;
    }
  }


  toString(openAll = false): string {
    let result = '';
    const {cols, rows} = this.config;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        result += this.field({row, col}).toString(this.isWin() || openAll);
      }
      result += '\n';
    }
    return result;
  }


  private fieldNeighbors(field: Field): Field[] {
    const result: Field[] = [];
    const validRow: number[] = [field.row - 1, field.row, field.row + 1].filter(item => item >= 0);
    const validCol: number[] = [field.col - 1, field.col, field.col + 1].filter(item => item >= 0);
    validRow.forEach(row => {
      validCol.forEach(col => result.push(this.field({row, col})));
    });
    return result.filter(item => !!item);
  }


  private fieldNeighborsToOpen(field: Field): Field[] {
    return this.fieldNeighbors(field)
      .filter(neighbor =>
        neighbor.isOpened()
          ? false
          : (field.hasMinesAround() ? !neighbor.hasMinesAround() : true)
      );
  }


  private init(config: GameConfig): void {
    this.config = config;
    this.initFields();
    this.initMines();
  }


  private initFields(): void {
    const {cols, rows} = this.config;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.fields.push(new Field(row, col));
      }
    }
  }


  private initMarks(): void {
    this.fields
      .filter(field => !field.isMined())
      .forEach(field => field.setMark(
        this.fieldNeighbors(field)
          .filter(neighbor => neighbor.isMined())
          .length
      ));
  }


  private initMines(): void {
    const config: GameConfig = this.config;
    let mines = 0;
    while (mines < config.mines) {
      const position: Position = {
        row: AppUtils.randomInteger(0, config.rows - 1),
        col: AppUtils.randomInteger(0, config.cols - 1),
      };
      const field = this.field(position);
      if (!field.isMined()) {
        mines++;
        this.field(position).setMine();
      }
    }
    this.initMarks();
  }


  private isWin(): boolean {
    return this.fields.length === this.opened.size + this.minesCount();
  }


  private openField(field: Field): Field {
    this.opened.add(this.toKey(field));
    return field.open();
  }


  private openFieldNeighbors(field: Field): void {
    this.fieldNeighborsToOpen(field)
      .forEach(neighbor => {
        this.openFieldNeighbors(
          this.openField(neighbor)
        );
      });
  }


  private toKey(field: Field): string {
    const {col, row} = field;
    return `${row} ${col}`;
  }


}



