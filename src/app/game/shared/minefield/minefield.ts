import { Field } from './field';

export class Minefield {

  fields: Field[] = [];

  private _data: string[][];

  constructor(data?: string[][]) {
    this.init(data);
  }

  get data(): string[][] {
    const result = this._data;
    this.fieldsMined().forEach(({x, y}) => result[y][x] = '*');
    return this._data;
  }

  get height(): number {
    return this.hasFields() ? this.lastY() + 1 : 0;
  }

  get size(): number {
    return this.height * this.width;
  }

  get width(): number {
    return this.hasFields() ? this.lastX() + 1 : 0;
  }


  field(x: number, y: number): Field {
    return this.fields.find(field => field.x === x && field.y === y);
  }

  fieldNeighbors(field: Field): Field[] {
    const result: Field[] = [];
    const validY: number[] = [field.y - 1, field.y, field.y + 1].filter(item => item >= 0);
    const validX: number[] = [field.x - 1, field.x, field.x + 1].filter(item => item >= 0);
    validX.forEach(x => {
      validY.forEach(y => result.push(this.field(x, y)));
    });
    return result;
  }


  fieldsValuable(): Field[] {
    return this.fields.filter(field => field.isOpened() && field.value > 0);
  }


  fieldsMined(): Field[] {
    return this.fields.filter(field => field.isMined());
  }


  update(data: string[][]): Minefield {
    if (!this._data) {
      this.init(data);
    }
    this.fields.forEach(field => {
      if (field.isClosed() && !field.isMined()) {
        field.setValue(data[field.y][field.x]);
      }
    });
    return this;
  }


  private init(data: string[][]): void {
    if (!data) {
      return;
    }
    this._data = data;
    data.forEach((row, y) => {
      row
        // .map(val => +val)
        .forEach((val, x) => {
          const field = new Field(x, y, +val);
          if (val === '*') {
            field.mine = true;
          }
          this.fields.push(field);
        });
    });
  }


  private hasFields(): boolean {
    return this.fields.length > 0;
  }

  private lastX(): number {
    return this.hasFields() && this.fields[this.fields.length - 1].x;
  }

  private lastY(): number {
    return this.hasFields() && this.fields[this.fields.length - 1].y;
  }


}
