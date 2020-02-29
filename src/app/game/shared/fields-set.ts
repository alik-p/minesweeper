import { Field } from './minefield';

export class FieldsSet {
  private readonly fieldSet: Set<string>;

  constructor() {
    this.fieldSet = new Set<string>();
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

}
