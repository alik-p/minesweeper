import { Field } from './index';


export class FieldsSet {

  private readonly fieldSet: Set<string>;

  constructor() {
    this.fieldSet = new Set<string>();
  }

  get keys(): { x: number, y: number }[] {
    return [...this.fieldSet].map(item => this.position(item));
  }

  add(field): FieldsSet {
    this.fieldSet.add(this.key(field));
    return this;
  }

  delete(field: Field): FieldsSet {
    this.fieldSet.delete(this.key(field));
    return this;
  }

  has(field: Field): boolean {
    return this.fieldSet.has(this.key(field));
  }

  private key(field: Field): string {
    return field ? `${field.x} ${field.y}` : null;
  }

  private position(key: string): { x: number, y: number } {
    const [x, y] = key.split(' ');
    return {x: +x, y: +y};
  }

}
