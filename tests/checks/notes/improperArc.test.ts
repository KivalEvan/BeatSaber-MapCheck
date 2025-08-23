import { it } from 'vitest';
import improperArc from '../../../src/ts/checks/notes/improperArc';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('improperArc', () => {
   const [checkArgs, expectOutput] = getInput('improperArc');
   improperArc.input.params.Unrankable = true;
   const results = improperArc.run(checkArgs);
   getAndCompareTimeResult('Improper', results, expectOutput[0]);
   getAndCompareTimeResult('Disconnect', results, expectOutput[1]);
   getAndCompareTimeResult('Intersect', results, expectOutput[2]);
   getAndCompareTimeResult('Unrankable', results, expectOutput[3]);
});
