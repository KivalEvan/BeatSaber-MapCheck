import { it } from 'vitest';
import acceptablePrec from '../../../src/ts/checks/notes/acceptablePrec';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('acceptablePrec', () => {
   const [checkArgs, expectOutput] = getInput('acceptablePrec');
   const results = acceptablePrec.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
