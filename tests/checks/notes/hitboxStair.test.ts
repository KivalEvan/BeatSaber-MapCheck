import { it } from 'vitest';
import hitboxStair from '../../../src/ts/checks/notes/hitboxStair';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('hitboxStair', () => {
   const [checkArgs, expectOutput] = getInput('hitboxStair');
   const results = hitboxStair.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
