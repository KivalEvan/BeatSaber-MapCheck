import { DataCheck, DataCheckObject } from '../../types/beatmap/shared/dataCheck';
import logger from '../../logger';
import { Version } from '../../types/beatmap/index';
import { compareVersion } from './version';

// deno-lint-ignore ban-types
const tag = (name: string) => {
    return `[shared::dataCheck::${name}]`;
};

export const deepCheck = (
    // deno-lint-ignore no-explicit-any
    data: { [key: string]: any },
    check: { [key: string]: DataCheck },
    name: string,
    version: Version
) => {
    logger.verbose(tag('deepCheck'), `Looking up ${name}`);
    if (Array.isArray(data)) {
        data.forEach((d, i) => deepCheck(d, check, name + i, version));
        return;
    }
    const dataCheckKey = Object.keys(check);
    for (const key in data) {
        if (!dataCheckKey.length) {
            break;
        }
        if (!dataCheckKey.includes(key)) {
            logger.warn(tag('deepCheck'), `Foreign property ${key} found in ${name}`);
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
            throw Error(`Missing ${key} in property ${name}!`);
        }
        if (data[key] == null) {
            throw Error(`${key} contain null value in property ${name}!`);
        }
        if (check[key].type === 'array') {
            if (!Array.isArray(data[key])) {
                throw Error(`${key} is not an array in property ${name}!`);
            }
            deepCheck(
                data[key],
                (check[key] as DataCheckObject).check,
                `${name} ${key}`,
                version
            );
        }
        if (check[key].type === 'object') {
            if (!Array.isArray(data[key]) && !(typeof data[key] === 'object')) {
                throw Error(`${key} is not an object in property ${name}!`);
            } else {
                deepCheck(
                    data[key],
                    (check[key] as DataCheckObject).check,
                    `${name} ${key}`,
                    version
                );
            }
        }
        if (check[key].type !== 'array' && typeof data[key] !== check[key].type) {
            throw Error(`${key} is not ${check[key].type} in property ${name}!`);
        }
    }
};
