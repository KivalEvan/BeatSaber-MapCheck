import { DataCheck } from '../../types/beatmap/shared/dataCheck';
import logger from '../../logger';
import { Version } from '../../types/beatmap/shared/version';
import { compareVersion } from './version';

function tag(name: string): string[] {
   return ['shared', 'dataCheck', name];
}

function handleError(text: string, throwError: boolean, errors: string[]): void {
   if (throwError) {
      throw Error(text);
   } else {
      logger.tWarn(tag('deepCheck'), text);
      errors.push(text);
   }
}

/**
 * Deeply check JSON schema given `Data Check` schema.
 *
 * Strict null policy. Return error logs as `string[]` for error inspection.
 */
export function deepCheck(
   // deno-lint-ignore no-explicit-any
   data: { [key: string]: any },
   check: { [key: string]: DataCheck },
   name: string,
   version: Version,
   throwError = true,
   errors: string[] = [],
): string[] {
   logger.tVerbose(tag('deepCheck'), `Looking up ${name}`);
   if (Array.isArray(data)) {
      data.forEach((d, i) => deepCheck(d, check, `${name}[${i}]`, version, throwError, errors));
      return errors;
   }

   // check for existing and/or unknown key
   const dck = Object.keys(check);
   if (dck.length) {
      for (const key in data) {
         if (!dck.includes(key)) {
            handleError(`Unused key ${key} found in ${name}`, false, errors);
            continue;
         }
      }
   }

   for (const key in check) {
      const ch = check[key];
      const d = data[key];

      if (d === undefined) {
         if (check[key].optional) {
            continue;
         }
         if (compareVersion(version, ch.version) === 'old') {
            continue;
         }
         handleError(`Missing ${key} in object ${name}!`, throwError, errors);
         continue;
      }

      if (d === null) {
         handleError(`${key} contain null value in object ${name}!`, throwError, errors);
         continue;
      }

      if (ch.type === 'array') {
         if (!Array.isArray(d)) {
            handleError(`${key} is not an array in object ${name}!`, throwError, errors);
         }
         deepCheck(d, ch.check, `${name}.${key}`, version, throwError, errors);
         continue;
      }

      if (ch.type === 'object') {
         if (!Array.isArray(d) && !(typeof d === 'object')) {
            handleError(`${key} is not an object in object ${name}!`, throwError, errors);
         } else {
            deepCheck(d, ch.check, `${name}.${key}`, version, throwError, errors);
         }
         continue;
      }

      if (
         ch.array &&
         Array.isArray(d) &&
         !d.every(
            (n: unknown) =>
               typeof n === ch.type ||
               (ch.type === 'number' &&
                  typeof n === 'number' &&
                  (isNaN(n) || ((ch.int ? n % 1 !== 0 : true) && (ch.unsigned ? n < 0 : true)))),
         )
      ) {
         handleError(`${key} is not ${ch.type} in object ${name}!`, throwError, errors);
         continue;
      }

      if (!ch.array && typeof d !== ch.type) {
         handleError(`${key} is not ${ch.type} in object ${name}!`, throwError, errors);
         continue;
      }

      if (ch.type === 'number') {
         if (isNaN(d)) {
            handleError(`${name}.${key} is NaN!`, throwError, errors);
            continue;
         }
         if (ch.int && d % 1 !== 0) {
            handleError(`${name}.${key} cannot be float!`, false, errors);
            continue;
         }
         if (ch.unsigned && d < 0) {
            handleError(`${name}.${key} cannot be negative!`, false, errors);
            continue;
         }
      }
   }
   return errors;
}
