import SavedData from '../../savedData';
import { removeOptions } from '../../utils';
import { EnvironmentName, EnvironmentV3Name } from '../../types/beatmap/shared/environment';
import { IEditor, IEditorInfo } from '../../types/beatmap/shared/custom/editor';
import { IContributorB64 } from '../../types/mapcheck';
import { EnvironmentRename } from '../../beatmap/shared/environment';
import { logPrefix } from './constants';

const htmlInfoLevelAuthor: HTMLElement = document.querySelector('.info__level-author')!;
const htmlInfoEnvironment: HTMLElement = document.querySelector('.info__environment')!;
const htmlInfoEditors: HTMLElement = document.querySelector('.info__editors')!;
const htmlInfoContributors: HTMLElement = document.querySelector('.info__contributors')!;
const htmlInfoContributorsSelect: HTMLSelectElement = document.querySelector(
    '.info__contributors-select',
)!;
const htmlInfoContributorsImage: HTMLImageElement = document.querySelector(
    '.info__contributors-image',
)!;
const htmlInfoContributorsName: HTMLElement = document.querySelector('.info__contributors-name')!;
const htmlInfoContributorsRole: HTMLElement = document.querySelector('.info__contributors-role')!;

if (!htmlInfoLevelAuthor || !htmlInfoEnvironment || !htmlInfoEditors) {
    throw new Error(logPrefix + 'info component is missing part');
}
if (!htmlInfoContributors || !htmlInfoContributorsName || !htmlInfoContributorsRole) {
    throw new Error(logPrefix + 'contributors component is missing part');
}
if (htmlInfoContributorsSelect) {
    htmlInfoContributorsSelect.addEventListener('change', contributorsSelectHandler);
} else {
    throw new Error(logPrefix + 'contributors select is missing');
}

export function setLevelAuthor(str?: string): void {
    if (!str) {
        htmlInfoLevelAuthor.textContent = '';
        return;
    }
    htmlInfoLevelAuthor.textContent = 'Mapped by ' + str;
}

export function setEnvironment(str?: EnvironmentName | EnvironmentV3Name): void {
    if (!str) {
        htmlInfoEnvironment.textContent = '';
        return;
    }
    htmlInfoEnvironment.textContent = (EnvironmentRename[str] || 'Unknown') + ' Environment';
}

export function setEditors(obj?: IEditor): void {
    if (!obj || !obj._lastEditedBy) {
        htmlInfoEditors.classList.add('hidden');
        return;
    }
    htmlInfoEditors.classList.remove('hidden');
    const lastEdited = obj._lastEditedBy || 'Undefined';
    let text = 'Last edited on ' + lastEdited;
    if (obj[lastEdited]) {
        const mapper = obj[lastEdited] as IEditorInfo;
        text += ' v' + mapper.version;
    }
    htmlInfoEditors.textContent = text;
}

function setContributorsImage(src: string | null): void {
    htmlInfoContributorsImage.src = src || './img/unknown.jpg';
}

function setContributorsName(str: string): void {
    htmlInfoContributorsName.textContent = str;
}

function setContributorsRole(str: string): void {
    htmlInfoContributorsRole.textContent = str;
}

export function setContributors(obj: IContributorB64): void {
    setContributorsImage(obj._base64 ? 'data:image;base64,' + obj._base64 : null);
    setContributorsName(obj._name);
    setContributorsRole(obj._role);
}

export function populateContributors(arr?: IContributorB64[]): void {
    if (htmlInfoContributors && (!arr || !arr.length)) {
        htmlInfoContributors.classList.add('hidden');
        removeOptions(htmlInfoContributorsSelect);
        return;
    }
    if (arr) {
        htmlInfoContributors.classList.remove('hidden');
        let first = true;
        arr.forEach((el, index) => {
            if (first) {
                first = false;
                setContributors(el);
            }
            const optCont = document.createElement('option');
            optCont.value = index.toString();
            optCont.text = el._name + ' -- ' + el._role;
            htmlInfoContributorsSelect.add(optCont);
        });
    }
}

function contributorsSelectHandler(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    setContributors(SavedData.contributors[parseInt(target.value)]);
}
