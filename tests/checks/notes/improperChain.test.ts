import { it } from 'vitest';
import improperChain from '../../../src/ts/checks/notes/improperChain';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('improperChain', () => {
   const [checkArgs, expectOutput] = getInput('improperChain');
   const results = improperChain.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
