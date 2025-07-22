import { it } from 'vitest';
import hitboxReverseStair from '../../../src/ts/checks/notes/hitboxReverseStair';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('hitboxReverseStair', () => {
   const [checkArgs, expectOutput] = getInput('hitboxReverseStair');
   const results = hitboxReverseStair.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
