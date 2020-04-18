import { Field } from './field';

describe('Game Backend - Field', () => {
  let field: Field;
  beforeEach(() => field = new Field(0, 0));

  it('#getMark should return undefined', () => {
    expect(field.getMark()).toBe(undefined);
  });

  it('#getMark should return 3', () => {
    field.setMark(3);
    expect(field.getMark()).toBe(3);
  });

  it('#hasMinesAround', () => {
    field.setMark(0);
    expect(field.hasMinesAround()).toBe(false, 'should return false');
    field.setMark(1);
    expect(field.hasMinesAround()).toBe(true, 'should return true');
  });


  it('#isMined should return undefined', () => {
    expect(field.isMined()).toBe(undefined);
  });

  it('#isMined should return false', () => {
    field.setMine(false);
    expect(field.isMined()).toBe(false);
  });

  it('#isMined should return true', () => {
    field.setMine();
    expect(field.isMined()).toBe(true);
  });

  it('#isOpened should return false', () => {
    expect(field.isOpened()).toBe(false);
  });

  it('#isOpened should return true', () => {
    field.open();
    expect(field.isOpened()).toBe(true);
  });


  it('#open should return opened Field ', () => {
    expect(field.open()).toBe(field);
    expect(field.open().isOpened()).toBe(true);
  });

  it('#setMine function', () => {
    field.setMine();
    expect(field.isMined()).toBe(true);
    field.setMine(false);
    expect(field.isMined()).toBe(false);
    field.setMine(true);
    expect(field.open().isMined()).toBe(true);
  });


  it('#setMark function', () => {
    field.setMark(7);
    expect(field.getMark()).toBe(7);
  });


  it('#toString function', () => {
    expect(field.toString()).toBe('?');
    field.open();
    field.setMark(5);
    expect(field.toString()).toBe('5');
    field.setMine(true);
    expect(field.toString()).toBe('*');
  });


});
