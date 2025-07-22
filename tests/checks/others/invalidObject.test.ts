import { it } from 'vitest';
import invalidObject from '../../../src/ts/checks/others/invalidObject';
import { getAndCompareTimeResult } from '../../utils';
import { getInput } from '../../loader';

it('invalidObjectNoteBomb', () => {
   const [checkArgs, expectOutput] = getInput('invalidObjectNoteBomb');
   const results = invalidObject.run(checkArgs);
   getAndCompareTimeResult("note", results, expectOutput[0]);
   getAndCompareTimeResult("bomb", results, expectOutput[1]);
});

it('invalidObjectChainArc', () => {
   const [checkArgs, expectOutput] = getInput('invalidObjectChainArc');
   const results = invalidObject.run(checkArgs);
   getAndCompareTimeResult("arc", results, expectOutput[0]);
   getAndCompareTimeResult("chain", results, expectOutput[1]);
});

it('invalidObjectObstacle', () => {
   const [checkArgs, expectOutput] = getInput('invalidObjectObstacle');
   const results = invalidObject.run(checkArgs);
   getAndCompareTimeResult("obstacle", results, expectOutput);
});

it('invalidObjectEvent', () => {
   const [checkArgs, expectOutput] = getInput('invalidObjectEvent');
   const results = invalidObject.run(checkArgs);
   getAndCompareTimeResult("event", results, expectOutput);
});

it('invalidObjectGls', () => {
   const [checkArgs, expectOutput] = getInput('invalidObjectGls');
   const results = invalidObject.run(checkArgs);
   getAndCompareTimeResult("event box", results, expectOutput);
});
