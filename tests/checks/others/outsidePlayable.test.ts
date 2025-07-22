import { it } from 'vitest';
import outsidePlayable from '../../../src/ts/checks/others/outsidePlayable';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('outsidePlayable', () => {
   const [checkArgs, _] = getInput('outsidePlayable');
   const results = outsidePlayable.run(checkArgs);
   getAndCompareTimeResult("before", results, [-1]);
   getAndCompareTimeResult("after", results, [65]);
});
