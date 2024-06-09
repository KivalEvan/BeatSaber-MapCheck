// deno-lint-ignore-file no-explicit-any
import type { IFilter } from './types/filter.ts';
import type { DeepPartialWrapper } from '../../types/utils.ts';
import type { IWrapBaseObject } from '../../types/beatmap/wrapper/baseObject.ts';

/**
 * Query function on class object array.
 * ```ts
 * const notesFilter = where(notes, { include: { x: 2, y: [1, 0] }, exclude: { customData: ['color'] } });
 * console.log(...notesFilter);
 * ```
 */
export function where<T extends IWrapBaseObject, U extends DeepPartialWrapper<T>>(
   objects: T[],
   filter: IFilter<U> = {},
): T[] {
   return objects
      .filter((o) => {
         let result = false;
         for (const k in filter.include) {
            const key = k as keyof T;
            const value = filter.include[k];
            if (key === 'customData' || key === '_customData') {
               if (o[key]) {
                  result = (value as string[]).some((p) =>
                     Object.keys((o as any)[key]).includes(p),
                  );
                  if (result) {
                     break;
                  }
               } else {
                  continue;
               }
            }
            if (Array.isArray(value)) {
               result = value.some((p) => o[key] === p);
            } else {
               result = o[key] === value;
            }
            if (result) {
               break;
            }
         }
         return result;
      })
      .filter((o) => {
         let result = false;
         for (const k in filter.exclude) {
            const key = k as keyof T;
            const value = filter.exclude[k];
            if (key === 'customData' || key === '_customData') {
               if (o[key]) {
                  result = (value as string[]).some((p) =>
                     Object.keys((o as any)[key]).includes(p),
                  );
                  if (result) {
                     break;
                  }
               } else {
                  continue;
               }
            }
            if (Array.isArray(value)) {
               result = value.some((p) => o[key] === p);
            } else {
               result = o[key] === value;
            }
            if (result) {
               break;
            }
         }
         return !result;
      });
}
