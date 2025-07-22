import { it } from 'vitest';
import insufficientLight from '../../../src/ts/checks/events/insufficientLight';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('insufficientLight', () => {
   const [checkArgs, expectOutput] = getInput('insufficientLight');
   const results = insufficientLight.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
