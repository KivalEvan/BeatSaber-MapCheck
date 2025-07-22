import { it } from 'vitest';
import stackedNote from '../../../src/ts/checks/notes/stackedNote';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('stackedNote', () => {
   const [checkArgs, expectOutput] = getInput('stackedNote');
   const results = stackedNote.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
