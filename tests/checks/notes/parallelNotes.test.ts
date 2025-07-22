import { it } from 'vitest';
import parallelNotes from '../../../src/ts/checks/notes/parallelNotes';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('parallelNotes', () => {
   const [checkArgs, expectOutput] = getInput('parallelNotes');
   const results = parallelNotes.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
