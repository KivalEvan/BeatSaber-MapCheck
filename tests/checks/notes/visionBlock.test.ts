import { it } from 'vitest';
import visionBlock from '../../../src/ts/checks/notes/visionBlock';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('visionBlock', () => {
   const [checkArgs, expectOutput] = getInput('visionBlock');
   const results = visionBlock.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
