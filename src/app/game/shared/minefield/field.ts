export interface IField {
  x: number;
  y: number;
  mine: boolean;
  value: number;
  flagged: boolean;
  probability: number;
}


export class Field {

  probability: number;
  value: number;

  readonly x: number;
  readonly y: number;

  private flagged = false;
  private mine = false;

  constructor(x: number, y: number, value: number) {
    this.x = x;
    this.y = y;
    this.value = value;
  }


  hasProbability(): boolean {
    return this.probability !== undefined;
  }


  isClosed(): boolean {
    return Number.isNaN(this.value);
  }


  isFlagged(): boolean {
    return this.flagged;
  }


  isOpened(): boolean {
    return !this.isClosed();
  }


  isMined(): boolean {
    return this.mine;
  }


  isUnknown(): boolean {
    return this.isClosed() && !this.isMined();
  }


  setFlag(value: boolean = true): Field {
    this.flagged = value;
    return this;
  }


  setMine(value: boolean = true): Field {
    this.mine = value;
    return this;
  }


}
