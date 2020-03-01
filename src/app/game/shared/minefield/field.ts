export class Field {

  mine = false;
  probability: number;
  value: number;

  readonly x: number;
  readonly y: number;

  private exploded = false;

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

  isExploded(): boolean {
    return this.exploded;
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


}
