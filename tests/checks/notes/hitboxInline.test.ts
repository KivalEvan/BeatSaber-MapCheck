import { it } from 'vitest';
import hitboxInline from '../../../src/ts/checks/notes/hitboxInline';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('hitboxInline', () => {
   const [checkArgs, expectOutput] = getInput('hitboxInline');
   const results = hitboxInline.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
