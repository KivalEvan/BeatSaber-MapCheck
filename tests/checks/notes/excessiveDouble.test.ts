import { it } from 'vitest';
import excessiveDouble from '../../../src/ts/checks/notes/excessiveDouble';
import { getAndCompareStringLabel } from '../../utils';
import { getInput } from '../../loader';

it('excessiveDouble', () => {
   const [checkArgs, expectOutput] = getInput('excessiveDouble');
   const results = excessiveDouble.run(checkArgs);
   getAndCompareStringLabel(0, results, '80%');
});
