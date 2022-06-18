import { ChromaDataEnvAbbr, IChromaEnvironment } from '../../types/beatmap/v3/chroma';
import { htmlTableEnvironmentEnhancement } from './constants';
import { displayTableRow, hideTableRow } from './helpers';

// this implementation looks hideous but whatever
export function setEnvironmentEnhancement(arr?: IChromaEnvironment[]): void {
    if (arr == null || !arr.length) {
        hideTableRow(htmlTableEnvironmentEnhancement);
        return;
    }
    const envEnhance = arr.map((elem, i) => {
        const keyArr = [];
        if (!elem.id) {
            return `Error parsing environment[${i}]`;
        }
        for (const key in elem) {
            if (key == '_lookupMethod' || key == '_id' || key == 'lookupMethod' || key == 'id') {
                continue;
            }
            const k = ChromaDataEnvAbbr[key as keyof typeof ChromaDataEnvAbbr];
            if (elem[key as keyof IChromaEnvironment] != null) {
                keyArr.push(k);
            }
        }
        return `${elem.lookupMethod} [${keyArr.join('')}]${elem.track ? `(${elem.track})` : ''} -> ${elem.id}`;
    });
    displayTableRow(htmlTableEnvironmentEnhancement, envEnhance);
}
