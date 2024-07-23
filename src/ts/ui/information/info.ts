import LoadedData from '../../loadedData';
import { removeOptions } from '../../utils/web';
import { IContributorB64 } from '../../types';
import { EnvironmentRename, types } from 'bsmap';

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

htmlInfoContributorsSelect.addEventListener('change', contributorsSelectHandler);

export function setLevelAuthor(mappers?: string[], lighters?: string[]): void {
   if (!mappers) {
      htmlInfoLevelAuthor.textContent = '';
      return;
   }
   if (!lighters?.length) {
      htmlInfoLevelAuthor.textContent = 'Mapped by ' + mappers.join(', ');
   } else {
      htmlInfoLevelAuthor.textContent =
         'Mapped by ' + mappers.join(', ') + ' and lit by ' + lighters.join(', ');
   }
}

export function setEnvironment(envs?:types. EnvironmentAllName[]): void {
   if (!envs) {
      htmlInfoEnvironment.textContent = '';
      return;
   }
   htmlInfoEnvironment.textContent = envs
      .map((v) => (EnvironmentRename[v] || `Unknown (${v})`) + ' Environment')
      .join(', ');
}

export function setEditors(obj?: types.v2.IEditor): void {
   if (!obj || !obj._lastEditedBy) {
      htmlInfoEditors.classList.add('hidden');
      return;
   }
   htmlInfoEditors.classList.remove('hidden');
   const lastEdited = obj._lastEditedBy || 'Undefined';
   let text = 'Last edited on ' + lastEdited;
   if (obj[lastEdited]) {
      const editor = obj[lastEdited] as types.v2.IEditorInfo;
      text += ' v' + editor.version;
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
   if (!arr || !arr.length) {
      htmlInfoContributors.classList.add('hidden');
      removeOptions(htmlInfoContributorsSelect);
      return;
   }
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

function contributorsSelectHandler(ev: Event): void {
   const target = ev.target as HTMLSelectElement;
   setContributors(LoadedData.contributors[parseInt(target.value)]);
}
