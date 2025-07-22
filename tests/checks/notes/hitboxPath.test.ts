import { it } from 'vitest';
import hitboxPath from '../../../src/ts/checks/notes/hitboxPath';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('hitboxPath', () => {
   const [checkArgs, expectOutput] = getInput('hitboxPath');
   const results = hitboxPath.run(checkArgs);
   getAndCompareTimeResult(0, results, expectOutput);
});
