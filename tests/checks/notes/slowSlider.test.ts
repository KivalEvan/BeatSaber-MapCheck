import { it } from 'vitest';
import slowSlider from '../../../src/ts/checks/notes/slowSlider';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('slowSlider', () => {
   const [checkArgs, expectOutput] = getInput('slowSlider');
   const results = slowSlider.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
