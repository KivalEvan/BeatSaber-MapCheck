import { it } from 'vitest';
import improperArc from '../../../src/ts/checks/notes/improperArc';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('improperArc', () => {
   const [checkArgs, expectOutput] = getInput('improperArc');
   const results = improperArc.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
