import { DataCheck, DataCheckObject } from '../../types/beatmap/shared/dataCheck';
import Logger from '../../logger';
import { Version } from '../../types/beatmap/shared/version';
import { compareVersion } from './version';

const tag = (name: string) => {
    return `[shared::dataCheck::${name}]`;
};

export function deepCheck(
    // deno-lint-ignore no-explicit-any
    data: { [key: string]: any },
    check: { [key: string]: DataCheck },
    name: string,
    version: Version,
) {
    Logger.verbose(tag('deepCheck'), `Looking up ${name}`);
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
            Logger.warn(tag('deepCheck'), `Unused key ${key} found in ${name}`);
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
            throw Error(`Missing ${key} in object ${name}!`);
        }
        if (data[key] == null) {
            throw Error(`${key} contain null value in object ${name}!`);
        }
        if (check[key].type === 'array') {
            if (!Array.isArray(data[key])) {
                throw Error(`${key} is not an array in object ${name}!`);
            }
            deepCheck(data[key], (check[key] as DataCheckObject).check, `${name} ${key}`, version);
        }
        if (check[key].type === 'object') {
            if (!Array.isArray(data[key]) && !(typeof data[key] === 'object')) {
                throw Error(`${key} is not an object in object ${name}!`);
            } else {
                deepCheck(data[key], (check[key] as DataCheckObject).check, `${name} ${key}`, version);
            }
        }
        if (check[key].type !== 'array' && typeof data[key] !== check[key].type) {
            throw Error(`${key} is not ${check[key].type} in object ${name}!`);
        }
    }
}
