import { it } from 'vitest';
import effectiveBPM from '../../../src/ts/checks/notes/effectiveBPM';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('effectiveBPM', () => {
   const [checkArgs, expectOutput] = getInput('effectiveBPM');
   effectiveBPM.input.adjustTime!(checkArgs.beatmap.timeProcessor);
   const results = effectiveBPM.run(checkArgs);
   getAndCompareTimeResult('EBPM warning', results, expectOutput[1]);
   getAndCompareTimeResult('swing', results, expectOutput[0]);
});
