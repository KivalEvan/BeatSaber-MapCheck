import { it } from 'vitest';
import improperWindow from '../../../src/ts/checks/notes/improperWindow';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('improperWindow', () => {
   const [checkArgs, expectOutput] = getInput('improperWindow');
   const results = improperWindow.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
