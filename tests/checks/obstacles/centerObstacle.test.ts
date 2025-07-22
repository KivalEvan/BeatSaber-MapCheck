import { it } from 'vitest';
import centerObstacle from '../../../src/ts/checks/obstacles/centerObstacle';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('centerObstacle', () => {
   const [checkArgs, expectOutput] = getInput('centerObstacle');
   const results = centerObstacle.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
