import { it } from 'vitest';
import hotStart from '../../../src/ts/checks/others/hotStart';
import { getAndCompareStringValue } from '../../utils';
import { getInput } from '../../loader';

it('hotStart', () => {
   const [checkArgs, expectOutput] = getInput('hotStart');
   const results = hotStart.run(checkArgs);
   getAndCompareStringValue(0, results, '1s');
});
