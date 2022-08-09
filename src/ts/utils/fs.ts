import logger from '../logger';

const tag = (name: string) => {
    return `[utils::fs::${name}]`;
};

export function fixDirectory(dir: string) {
    dir = dir.trim();
    if (dir && !(dir.endsWith('\\') || dir.endsWith('/'))) {
        logger.debug(tag('fixDirectory'), `Adding missing end slash`);
        dir += '/';
    }
    if (!dir || dir === '/') {
        dir = './';
    }
    return dir;
}
