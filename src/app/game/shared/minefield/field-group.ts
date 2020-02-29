import { Field } from './field';

export class FieldGroup {
  private _mines: number;
  private _fields: Field[];


  constructor(mines: number, fields: Field[]) {
    this._mines = mines;
    this._fields = fields;
  }


  get probabilities(): number {
    return this.fields
      .filter(field => field.hasProbability())
      .map(field => field.probability)
      .reduce((acc, val) => acc += val);
  }


  get fields(): Field[] {
    return this._fields;
  }

  get mines(): number {
    return this._mines;
  }

  get size(): number {
    return this.fields.length;
  }


}
