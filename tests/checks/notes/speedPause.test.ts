import { it } from 'vitest';
import speedPause from '../../../src/ts/checks/notes/speedPause';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('speedPause', () => {
   const [checkArgs, expectOutput] = getInput('speedPause');
   const results = speedPause.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
