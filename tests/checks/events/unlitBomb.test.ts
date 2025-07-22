import { it } from 'vitest';
import unlitBomb from '../../../src/ts/checks/events/unlitBomb';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('unlitBomb', () => {
   const [checkArgs, expectOutput] = getInput('unlitBomb');
   const results = unlitBomb.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
