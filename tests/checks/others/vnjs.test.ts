import { it } from 'vitest';
import vnjs from '../../../src/ts/checks/others/vnjs';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('Very slow vNJS', () => {
   const [checkArgs, expectOutput] = getInput('vnjs');
   const results = vnjs.run(checkArgs);
   getAndCompareTimeResult('slow', results, expectOutput[0]);
});

it('Very high vNJS', () => {
   const [checkArgs, expectOutput] = getInput('vnjs');
   const results = vnjs.run(checkArgs);
   getAndCompareTimeResult('high', results, expectOutput[1]);
});

it('Quick vNJS change', () => {
   const [checkArgs, expectOutput] = getInput('vnjs');
   const results = vnjs.run(checkArgs);
   getAndCompareTimeResult('Quick', results, expectOutput[2]);
});
