import { it } from 'vitest';
import rankableObstacle from '../../../src/ts/checks/obstacles/rankableObstacle';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('rankableObstacle', () => {
   const [checkArgs, expectOutput] = getInput('rankableObstacle');
   const results = rankableObstacle.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
