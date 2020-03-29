import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Field, Minefield } from '../../shared/minefield';
import { IMinefieldAction, MinefieldAction } from '../../shared/types/minefield-action';


@Component({
  selector: 'app-minefield',
  templateUrl: './minefield.component.html',
  styleUrls: ['./minefield.component.sass']
})
export class MinefieldComponent implements OnInit {
  @Input() minefield: Minefield;
  @Output() action = new EventEmitter<IMinefieldAction>();


  constructor() {
  }


  get cols(): number[] {
    return this.arrayFrom(this.minefield.width);
  }

  get rows(): number[] {
    return this.arrayFrom(this.minefield.height);
  }


  ngOnInit(): void {
  }


  fieldClass(x: number, y: number): string {
    const field = this.minefield.field(x, y);
    let result = '_closed';
    if (field.isFlagged()) {
      result = '_flagged';
    } else if (field.isMined()) {
      result = '_mined';
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
    this.action.emit({action: MinefieldAction.Demine, data: field});
  }


  onFlagToggle(event): void {
    event.preventDefault();
    const field = this.eventField(event);
    if (!field || field.isOpened()) {
      return;
    }

    this.action.emit({action: MinefieldAction.Flag, data: field});
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


}
