import { it } from 'vitest';
import handclap from '../../../src/ts/checks/notes/handclap';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('handclap', () => {
   const [checkArgs, expectOutput] = getInput('handclap');
   const results = handclap.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
