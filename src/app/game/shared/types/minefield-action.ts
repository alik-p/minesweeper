import { Field } from '../minefield/field';

export enum MinefieldAction {
  Demine = 'demine',
  Flag = 'flag'
}


export interface IMinefieldAction {
  action: MinefieldAction;
  data: Field;
}
