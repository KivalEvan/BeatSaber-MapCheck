import { it } from 'vitest';
import improperChain from '../../../src/ts/checks/notes/improperChain';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('improperChain', () => {
   const [checkArgs, expectOutput] = getInput('improperChain');
   improperChain.input.params.Unrankable = true;
   const results = improperChain.run(checkArgs);
   getAndCompareTimeResult('Improper', results, expectOutput[0]);
   getAndCompareTimeResult('Unrankable', results, expectOutput[1]);
});
