import { it } from 'vitest';
import invalidEventBox from '../../../src/ts/checks/events/invalidEventBox';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('invalidEventBox', () => {
   const [checkArgs, expectOutput] = getInput('invalidEventBox');
   const results = invalidEventBox.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
