import { Field, FieldGroup, Minefield } from './minefield';

export class Probabilities {

  static calculate(minefield: Minefield): FieldGroup[] {
    const groups: FieldGroup[] = Probabilities.initGroups(minefield);
    groups.forEach(group => {
      group.fields.forEach(field => {
        if (!field.hasProbability()) {
          field.probability = group.mines / group.size;
        } else {
          field.probability = 1 - (1 - field.probability) * (1 - group.mines / group.size);
        }
      });
    });
    return Probabilities.correct(groups);
  }


  private static correct(groups: FieldGroup[]): FieldGroup[] {
    let repeat: boolean;
    do {
      repeat = false;
      groups.forEach(group => {
        const probability = group.probabilities * 100;
        const mines = group.mines * 100;
        if (Math.abs(probability - mines) > 1) {
          repeat = true;
          const correct = mines / probability;
          group.fields.forEach(field => field.probability *= correct);
        }
      });
    } while (repeat);

    groups.forEach(group => {
      group.fields.forEach(field => {
        // TODO needed (???)
        field.probability = (field.probability > 0.99) ? 0.99 : field.probability;
        field.probability = (field.probability < 0) ? 0 : field.probability;
      });
    });

    return groups;
  }


  private static initGroups(minefield: Minefield): FieldGroup[] {
    const result: FieldGroup[] = [];
    minefield.fieldsValuable()
      .forEach((field: Field) => {
        const neighbors = minefield.fieldNeighbors(field);
        const group: Field[] = neighbors
          .filter(item => item && item.isUnknown());
        if (group.length > 0) {
          const neutralized = neighbors.filter(item => item && item.isMined()).length;
          const mines = field.value - neutralized;
          result.push(new FieldGroup(mines, group));
        }
      });
    return result;
  }

}
