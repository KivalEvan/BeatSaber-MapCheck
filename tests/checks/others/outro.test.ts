import { it } from 'vitest';
import outro from '../../../src/ts/checks/others/outro';
import { getAndCompareStringValue } from '../../utils';
import { getInput } from '../../loader';

it('Outro Quick', () => {
   const [checkArgs, _] = getInput('outro1');
   const results = outro.run(checkArgs);
   getAndCompareStringValue("Quick", results, '1s');
});

it('Outro Empty', () => {
   const [checkArgs, _] = getInput('outro2');
   const results = outro.run(checkArgs);
   getAndCompareStringValue("Empty", results, '29s');
});
