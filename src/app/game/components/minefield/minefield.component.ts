import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Field, Minefield } from '../../shared/minefield';
import { FieldsSet } from '../../shared/fields-set';

@Component({
  selector: 'app-minefield',
  templateUrl: './minefield.component.html',
  styleUrls: ['./minefield.component.sass']
})
export class MinefieldComponent implements OnInit {
  @Input()
  set data(data: string[][]) {
    this.initMinefield(data);
  }

  @Output() demine = new EventEmitter<Field>();
  minefield: Minefield;
  fieldsMarked: FieldsSet = new FieldsSet();

  constructor() {
  }



  get minefieldCols(): number[] {
    return this.arrayFrom(this.minefield.height);
  }

  get minefieldRows(): number[] {
    return this.arrayFrom(this.minefield.height);
  }


  ngOnInit(): void {
  }


  fieldClass(x: number, y: number): string {
    // console.log('fieldClass this.fieldsMarked: ', this.fieldsMarked)
    const field = this.minefield.field(x, y);
    let result = '_closed';
    if (this.fieldsMarked.has(field)) {
      result = '_marked';
    } else if (field.isExploded()) {
      result = '_exploded';
    } else if (field.isOpened()) {
      result = `_${field.value}`;
    }
    return result;
  }


  onDemine(event): void {
    const field = this.eventField(event);
    if (!field || field.isMined() || field.isOpened()) {
      return;
    }
    console.log('onDemine: ', field);
    this.demine.emit(field);
    /*this.demine([field]);
    this.gameService.reloadMap();*/
    // this.findSolution(minefield);
  }

  onFlagToggle(event): void {
    event.preventDefault();
    const field = this.eventField(event);
    if (!field || field.isOpened()) {
      return;
    }
    this.fieldsMarked.has(field)
      ? this.fieldsMarked.delete(field)
      : this.fieldsMarked.add(field);
    // field.mine = !field.mine;
  }


  private arrayFrom(length: number): number[] {
    return Array.from({length}, (v, i) => i);
  }


  private eventField(event): Field {
    const position = this.eventFieldPosition(event);
    if (!position) {
      return;
    }
    const {x, y} = position;
    return this.minefield.field(x, y);
  }


  private eventFieldPosition(event): { x: number; y: number } {
    let position: string = null;
    let target: Element = event.target;
    while (target.id !== 'minefield') {
      if (target.hasAttribute('data-position')) {
        position = target.getAttribute('data-position');
      }
      target = target.parentElement;
    }
    if (!position) {
      return null;
    }
    const [x, y] = position.split(',').map(v => +v);
    return {x, y};
  }


  private initMinefield(data: string[][]): void {
    this.minefield = new Minefield(data);
  }


}
