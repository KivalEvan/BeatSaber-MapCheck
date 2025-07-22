import { it } from 'vitest';
import shortObstacle from '../../../src/ts/checks/obstacles/shortObstacle';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('shortObstacle', () => {
   const [checkArgs, expectOutput] = getInput('shortObstacle');
   const results = shortObstacle.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
