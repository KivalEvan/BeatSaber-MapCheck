import { it } from 'vitest';
import varySwing from '../../../src/ts/checks/notes/varySwing';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('varySwing', () => {
   const [checkArgs, expectOutput] = getInput('varySwing');
   const results = varySwing.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
