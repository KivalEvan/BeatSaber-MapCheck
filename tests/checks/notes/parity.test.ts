import { it } from 'vitest';
import parity from '../../../src/ts/checks/notes/parity';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('parity', () => {
   const [checkArgs, expectOutput] = getInput('parity');
   const results = parity.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
