import { it } from 'vitest';
import inlineAngle from '../../../src/ts/checks/notes/hitboxInline';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('inlineAngle', () => {
   const [checkArgs, expectOutput] = getInput('inlineAngle');
   const results = inlineAngle.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
