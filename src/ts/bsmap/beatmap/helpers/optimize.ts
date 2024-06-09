import logger from '../../logger.ts';
import { round } from '../../utils/math.ts';
import type { IOptimizeOptions } from '../../types/beatmap/options/optimize.ts';

function tag(name: string): string[] {
   return ['helpers', name];
}

export function remapDedupe<T>(data: T[]): [T[], Map<number, number>] {
   const newData: string[] = [];
   const remapIdx = new Map<number, number>();
   for (let i = 0; i < data.length; i++) {
      const str = JSON.stringify(data[i]);
      let idx = newData.indexOf(str);
      if (idx === -1) {
         idx = newData.length;
         newData.push(str);
      }
      remapIdx.set(i, idx);
   }
   return [newData.map((d) => JSON.parse(d)), remapIdx];
}

// deno-lint-ignore no-explicit-any
export function purgeZeros(data: Record<string, any>) {
   for (const k in data) {
      if ((typeof data[k] === 'number' || typeof data[k] === 'boolean') && !data[k]) {
         delete data[k];
      }
   }
}

export function deepClean(
   // deno-lint-ignore no-explicit-any
   obj: { [key: string | number]: any } | any[],
   name: string,
   options: IOptimizeOptions,
) {
   for (const k in obj) {
      const d = obj[k];
      if (typeof d === 'number' && options.floatTrim) {
         obj[k] = round(d, options.floatTrim);
         continue;
      }

      if (typeof d === 'string' && options.stringTrim) {
         obj[k] = d.trim();
         continue;
      }

      if (typeof obj[k] === 'boolean') {
         continue;
      }

      // throw or default null to 0
      if (d === null) {
         if (options.throwNullish) {
            throw new Error(`null value found in object key ${name}.${k}.}`);
         } else {
            if (Array.isArray(obj)) {
               logger.tError(
                  tag('deepClean'),
                  `null value found in array ${name}[${k}], defaulting to 0...`,
               );
               obj[k] = 0;
            } else {
               logger.tError(
                  tag('deepClean'),
                  `null value found in object key ${name}.${k}, deleting...`,
               );
               delete obj[k];
            }
         }
         continue;
      }

      // recursion stuff
      if (typeof d === 'object') {
         // filter out undefined in array
         if (Array.isArray(d)) {
            const len = d.length;
            const newAry = d.filter((e: unknown) => e !== undefined);
            if (len !== newAry.length) {
               if (options.throwNullish) {
                  throw new Error(`undefined found in array key ${name}.${k}.}`);
               } else {
                  logger.tError(
                     tag('deepClean'),
                     `undefined found in array key ${name}.${k}, replacing array with no undefined...`,
                  );
                  obj[k] = newAry;
               }
            }
         }
         deepClean(
            // deno-lint-ignore ban-types
            d as {},
            Array.isArray(obj) ? `${name}[${k}]` : `${name}.${k}`,
            options,
         );
      }

      // remove unnecessary empty array/object property if exist and not part of data check
      if ((Array.isArray(d) && !d.length) || JSON.stringify(d) === '{}') {
         delete obj[k];
         continue;
      }
   }
}
