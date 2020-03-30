import { MinefieldComponent } from './minefield.component';
import { Minefield } from '../../shared/minefield';

describe('Game / MinefieldComponent', () => {
  let component: MinefieldComponent;

  beforeEach(() => {
    component = new MinefieldComponent();
    const data: string[][] = [
      ['1', '*', '?', '0'],
      ['?', '?', '?', '0'],
      ['0', '0', '0', '0'],
    ];
    component.minefield = new Minefield(data);
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
    expect(true).toBeTrue();
  });


  it('#onFlagToggle() - TODO', () => {
    expect(true).toBeTrue();
  });


});
