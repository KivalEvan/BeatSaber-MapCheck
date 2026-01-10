import { it } from 'vitest';
import insufficientLight from '../../../src/ts/checks/events/insufficientLight';
import { getAndCompareStringValue } from '../../utils';
import { getInput } from '../../loader';

it('Insufficient Light v3', () => {
   const [checkArgs, expectOutput] = getInput('insufficientLight1');
   const results = insufficientLight.run(checkArgs);
   getAndCompareStringValue(0, results, 'v3 environment light should be manually checked');
});

it('Insufficient Light pre-v3', () => {
   const [checkArgs, expectOutput] = getInput('insufficientLight2');
   const results = insufficientLight.run(checkArgs);
   getAndCompareStringValue(0, results, '');
});
