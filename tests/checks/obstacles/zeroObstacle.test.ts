import { it } from 'vitest';
import zeroObstacle from '../../../src/ts/checks/obstacles/zeroObstacle';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('zeroObstacle', () => {
   const [checkArgs, expectOutput] = getInput('zeroObstacle');
   const results = zeroObstacle.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
