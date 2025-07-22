import { it } from 'vitest';
import hammerHit from '../../../src/ts/checks/notes/hammerHit';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('hammerHit', () => {
   const [checkArgs, expectOutput] = getInput('hammerHit');
   const results = hammerHit.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
