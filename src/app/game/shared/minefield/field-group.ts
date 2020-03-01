import { Field } from './field';
import { AppUtils } from '../../../core/shared/app-utils';

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

  get probabilityMin(): number {
    const probabilities: number[] = this.fields
      .map(field => field.probability)
      .filter((p, index, self) => (p !== undefined) && self.indexOf(p) === index);
    return Math.min(...probabilities);
  }


  get randomFieldMin(): Field {
    const min = this.probabilityMin;
    const fields = this.fields.filter(field => field.probability <= min);
    const index = AppUtils.randomInteger(0, fields.length - 1);
    return fields[index];
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
