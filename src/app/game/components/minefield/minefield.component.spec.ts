import { MinefieldComponent } from './minefield.component';
import { Minefield } from '../../shared/minefield';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { click } from '../../../../testing';
import { IMinefieldAction } from '../../shared/types/minefield-action';
import { By } from '@angular/platform-browser';

describe('Game / MinefieldComponent', () => {
  let component: MinefieldComponent;
  let componentDebugElement: DebugElement;
  let componentNativeElement: HTMLElement;
  let fixture: ComponentFixture<MinefieldComponent>;

  const minefieldCell = (x: number, y: number): HTMLElement => {
    return componentNativeElement.querySelector<HTMLElement>(`.minefield--cell[data-position="${x},${y}"]`);
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinefieldComponent]
    });
    fixture = TestBed.createComponent(MinefieldComponent);
    component = fixture.componentInstance;
    componentDebugElement = fixture.debugElement;
    componentNativeElement = componentDebugElement.nativeElement;

    const data: string[][] = [
      ['1', '*', '?', '0'],
      ['?', '?', '?', '0'],
      ['0', '0', '0', '0'],
    ];
    component.minefield = new Minefield(data);

    fixture.detectChanges();  // trigger initial data binding

  });


  it('#cols', () => {
    expect(component.cols).toEqual([0, 1, 2, 3]);
  });


  it('#rows', () => {
    expect(component.rows).toEqual([0, 1, 2]);
  });


  it('#fieldClass()', () => {
    expect(component.fieldClass(0, 0)).toBe('_1');
    expect(component.fieldClass(0, 1)).toBe('_closed');
    expect(component.fieldClass(1, 0)).toBe('_mined');
    component.minefield.field(1, 1).setFlag();
    expect(component.fieldClass(1, 1)).toBe('_flagged');
  });


  it('#onDemine() - TODO', () => {
    // TODO
    let action: IMinefieldAction;
    const clickableEl = componentNativeElement.querySelector<HTMLElement>('.minefield');
    const targetEl = minefieldCell(1, 0);
    clickableEl.appendChild(targetEl);
    const testEl = componentDebugElement.query(By.css('.minefield'));
    click(testEl, {target: targetEl});
    component.action.subscribe(res => action = res);
    expect(true).toBeTrue();
  });


  it('#onFlagToggle() - TODO', () => {
    expect(true).toBeTrue();
  });


});
