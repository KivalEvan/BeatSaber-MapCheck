import { expect } from 'vitest';
import { ICheckOutput, OutputType } from '../src/ts/types';

export function getAndCompareTimeResult(
   index: number,
   results: ICheckOutput[],
   expected: number[],
): void;
export function getAndCompareTimeResult(
   substring: string,
   results: ICheckOutput[],
   expected: number[],
): void;
export function getAndCompareTimeResult(
   index: number,
   results: ICheckOutput[],
   expected: number[][],
): void;
export function getAndCompareTimeResult(
   substring: string,
   results: ICheckOutput[],
   expected: number[][],
): void;
export function getAndCompareTimeResult(
   index: number | string,
   results: ICheckOutput[],
   expected: number[][] | number[],
): void {
   let result: ICheckOutput | undefined;
   if (typeof index === 'number') result = results[index];
   else result = results.find((o) => o.label.includes(index));

   if (Array.isArray(expected[0])) {
      expected = expected[0];
   }

   if (!result) {
      throw new Error(
         `map always intentionally add erroneous part, did the check fail or missing error?
expected: ${JSON.stringify(expected)}
results: ${JSON.stringify(results, null, 2)}`,
      );
   }
   if (result.type !== OutputType.TIME) {
      throw new Error('output type should be TIME');
   }
   expect(result.value.map((o) => o.time).toSorted((a, b) => a - b)).toEqual(
      expected.toSorted((a, b) => a - b),
   );
}

export function getAndCompareStringValue(
   index: number,
   results: ICheckOutput[],
   expected: string,
): void;
export function getAndCompareStringValue(
   substring: string,
   results: ICheckOutput[],
   expected: string,
): void;
export function getAndCompareStringValue(
   index: number | string,
   results: ICheckOutput[],
   expected: string,
): void {
   let result: ICheckOutput | undefined;
   if (typeof index === 'number') result = results[index];
   else result = results.find((o) => o.label.includes(index));

   if (!result) {
      throw new Error(
         `map always intentionally add erroneous part, did the check fail or missing error?
expected: ${JSON.stringify(expected)}
results: ${JSON.stringify(results, null, 2)}`,
      );
   }
   if (result.type !== OutputType.STRING) {
      throw new Error('output type should be TIME');
   }
   expect(result.value).toContain(expected);
}

export function getAndCompareStringLabel(
   index: number,
   results: ICheckOutput[],
   expected: string,
): void;
export function getAndCompareStringLabel(
   substring: string,
   results: ICheckOutput[],
   expected: string,
): void;
export function getAndCompareStringLabel(
   index: number | string,
   results: ICheckOutput[],
   expected: string,
): void {
   let result: ICheckOutput | undefined;
   if (typeof index === 'number') result = results[index];
   else result = results.find((o) => o.label.includes(index));

   if (!result) {
      throw new Error(
         `map always intentionally add erroneous part, did the check fail or missing error?
expected: ${JSON.stringify(expected)}
results: ${JSON.stringify(results, null, 2)}`,
      );
   }
   if (result.type !== OutputType.STRING) {
      throw new Error(`output type should be TIME, got ${result}`);
   }
   expect(result.label).toContain(expected);
}
