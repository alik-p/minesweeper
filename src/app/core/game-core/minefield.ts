import { GameConfig } from './game-config';
import { AppUtils } from '../app-utils';
import { Position } from './position';
import { Field } from './field';


export class Minefield {
  private fields: Field[] = [];

  constructor(private config: GameConfig) {
    console.log('new Minefield: ', this.config)
    this.init(this.config);
    console.log('Minefield: ', this)
  }


  field(position: Position): Field {
    return this.fields.find(field =>
      field.row === position.row && field.col === position.col
    );
  }


  openField(position: Position): 'fail' | 'success' {
    const field = this.field(position);
    if (field) {
      this.openFieldNeighbors(field.open());
      return field.isMined() ? 'fail' : 'success';
    }
  }


  toString(openAll = false): string {
    let result = '';
    const {cols, rows} = this.config;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        result +=    this.field({row, col}).toString(openAll);
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


  private openFieldNeighbors(field: Field): void {
    this.fieldNeighborsToOpen(field)
      .forEach(neighbor =>
        this.openFieldNeighbors(neighbor.open())
      );
  }


  private toKey(position: Position): string {
    const {col, row} = position;
    return `${row} ${col}`;
  }


  private toPosition(key: string): Position {
    const [row, col] = key.split(' ').map(item => +item);
    return {row, col};
  }


}



