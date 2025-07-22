import { it } from 'vitest';
import doubleDirectional from '../../../src/ts/checks/notes/doubleDirectional';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('doubleDirectional', () => {
   const [checkArgs, expectOutput] = getInput('doubleDirectional');
   const results = doubleDirectional.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
