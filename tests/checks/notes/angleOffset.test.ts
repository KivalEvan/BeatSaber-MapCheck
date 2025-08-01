import { it } from 'vitest';
import angleOffset from '../../../src/ts/checks/notes/angleOffset';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('Rankable Angle Offset', () => {
   const [checkArgs, expectOutput] = getInput('angleOffset');
   angleOffset.input.params.Negative = true;
   angleOffset.input.params.Excess = true;
   const results = angleOffset.run(checkArgs);
   getAndCompareTimeResult('Rankable', results, expectOutput[0]);
});

it('Negative Angle Offset', () => {
   const [checkArgs, expectOutput] = getInput('angleOffset');
   angleOffset.input.params.Negative = true;
   angleOffset.input.params.Excess = true;
   const results = angleOffset.run(checkArgs);
   getAndCompareTimeResult('Negative', results, expectOutput[1]);
});

it('Excess Angle Offset', () => {
   const [checkArgs, expectOutput] = getInput('angleOffset');
   angleOffset.input.params.Negative = true;
   angleOffset.input.params.Excess = true;
   const results = angleOffset.run(checkArgs);
   getAndCompareTimeResult('Excess', results, expectOutput[2]);
});
