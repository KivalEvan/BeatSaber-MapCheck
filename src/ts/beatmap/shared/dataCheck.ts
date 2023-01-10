import { DataCheck, DataCheckNumber, DataCheckObject } from '../../types/beatmap/shared/dataCheck';
import logger from '../../logger';
import { Version } from '../../types/beatmap/shared/version';
import { compareVersion } from './version';

const tag = (name: string) => {
    return `[shared::dataCheck::${name}]`;
};

function handleError(text: string, throwError: boolean, error: string[]) {
    if (throwError) {
        throw Error(text);
    } else {
        logger.warn(tag('deepCheck'), text);
        error.push(text);
    }
}

export function deepCheck(
    // deno-lint-ignore no-explicit-any
    data: { [key: string]: any },
    check: { [key: string]: DataCheck },
    name: string,
    version: Version,
    throwError = true,
    error: string[] = [],
) {
    logger.verbose(tag('deepCheck'), `Looking up ${name}`);
    if (Array.isArray(data)) {
        data.forEach((d, i) => deepCheck(d, check, `${name}[${i}]`, version));
        return;
    }
    const dataCheckKey = Object.keys(check);
    for (const key in data) {
        if (!dataCheckKey.length) {
            break;
        }
        if (!dataCheckKey.includes(key)) {
            handleError(`Unused key ${key} found in ${name}`, false, error);
        }
    }
    for (const key in check) {
        if (typeof data[key] === 'undefined') {
            if (check[key].optional) {
                continue;
            }
            if (compareVersion(version, check[key].version) === 'old') {
                continue;
            }
            handleError(`Missing ${key} in object ${name}!`, throwError, error);
        }
        if (data[key] == null) {
            handleError(`${key} contain null value in object ${name}!`, throwError, error);
        }
        if (check[key].type === 'array') {
            if (!Array.isArray(data[key])) {
                handleError(`${key} is not an array in object ${name}!`, throwError, error);
            }
            deepCheck(data[key], (check[key] as DataCheckObject).check, `${name} ${key}`, version);
        }
        if (check[key].type === 'object') {
            if (!Array.isArray(data[key]) && !(typeof data[key] === 'object')) {
                handleError(`${key} is not an object in object ${name}!`, throwError, error);
            } else {
                deepCheck(data[key], (check[key] as DataCheckObject).check, `${name} ${key}`, version);
            }
        }
        if (
            check[key].array &&
            Array.isArray(data[key]) &&
            data[key].every(
                (n: unknown) =>
                    typeof n === check[key].type ||
                    (check[key].type === 'number' &&
                        typeof n === 'number' &&
                        ((check[key] as DataCheckNumber).int ? n % 1 !== 0 : true) &&
                        ((check[key] as DataCheckNumber).unsigned ? data[key] < 0 : true)),
            )
        ) {
            handleError(`${key} is not ${check[key].type} in object ${name}!`, throwError, error);
        }
        if (check[key].type !== 'array' && typeof data[key] !== check[key].type) {
            handleError(`${key} is not ${check[key].type} in object ${name}!`, throwError, error);
        }
        if (check[key].type === 'number' && typeof data[key] === 'number') {
            if ((check[key] as DataCheckNumber).int && data[key] % 1 !== 0) {
                handleError(`${name} ${key} cannot be float!`, false, error);
            }
            if ((check[key] as DataCheckNumber).unsigned && data[key] < 0) {
                handleError(`${name} ${key} cannot be negative!`, false, error);
            }
        }
    }
}
