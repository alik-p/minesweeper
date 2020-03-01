/// <reference lib="webworker" />


import { Probabilities } from './probabilities';
import { Field, Minefield } from '../minefield';

{

  addEventListener('message', ({data}) => {
    const minefield = new Minefield(data);
    const solution = findSolution(minefield);
    postMessage(solution);
  });


  const findSolution = (minefield: Minefield): Field[] => {
    const probabilities = Probabilities.calculate(minefield);
    const thresholdSafe = 0.05;
    const thresholdMined = 0.9;
    const solvedFields: Set<Field> = new Set<Field>();

    probabilities.forEach((group) => {
      group.fields.forEach(field => {
        if (field.probability >= thresholdMined) {
          field.mine = true;
          solvedFields.add(field);
        } else if (field.probability === 0) {
          solvedFields.add(field);
        }
      });
      const min = group.probabilityMin;
      if (min > 0 && min <= thresholdSafe) {
        const random = group.randomFieldMin;
        solvedFields.add(random);
      }
    });

    const demineFields = Array.from(solvedFields);
    return demineFields;

  };


}
