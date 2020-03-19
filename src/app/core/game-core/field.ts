export class Field {

  readonly col: number;
  readonly row: number;
  private mine: boolean;
  private mark: number;
  private opened = false;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  getMark(): number {
    return this.mark;
  }


  hasMinesAround(): boolean {
    return this.getMark() !== 0;
  }


  isMined(): boolean {
    return this.mine;
  }

  isOpened(): boolean {
    return this.opened;
  }


  open(): Field {
    this.opened = true;
    return this;
  }


  setMine(value: boolean = true): void {
    this.mine = value;
  }


  setMark(value: number): void {
    this.mark = value;
  }


  toString(): string {
    return this.isOpened()
      ? (this.isMined() ? '*' : this.mark.toString())
      : '?';
  }


}
