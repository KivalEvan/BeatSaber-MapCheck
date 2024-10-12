import { IContributorB64 } from '../../types';
import { EnvironmentRename } from 'bsmap';
import * as types from 'bsmap/types';

const htmlInfoLevelAuthor: HTMLElement = document.querySelector('.info__level-author')!;
const htmlInfoEnvironment: HTMLElement = document.querySelector('.info__environment')!;
const htmlInfoEditors: HTMLElement = document.querySelector('.info__editors')!;
const htmlInfoContributors: HTMLElement = document.querySelector('.info__contributors')!;
const htmlInfoContributorsImage: HTMLImageElement = document.querySelector(
   '.info__contributors-image',
)!;
const htmlInfoContributorsName: HTMLElement = document.querySelector('.info__contributors-name')!;
const htmlInfoContributorsRole: HTMLElement = document.querySelector('.info__contributors-role')!;
const htmlInfoContributorsList: HTMLElement = document.querySelector('.info__contributors-list')!;

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

export function setEnvironment(envs?: types.EnvironmentAllName[]): void {
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
   while (htmlInfoContributorsList.firstChild) {
      htmlInfoContributorsList.removeChild(htmlInfoContributorsList.firstChild);
   }
   if (!arr || !arr.length) {
      htmlInfoContributors.classList.add('hidden');
      // removeOptions(htmlInfoContributorsSelect);
      return;
   }
   htmlInfoContributors.classList.remove('hidden');
   arr.forEach((el, index) => {
      const htmlCard = document.createElement('div');
      htmlCard.classList.add('info__contributors-card');

      const htmlImg = document.createElement('img');
      htmlImg.classList.add('info__contributors-image');
      htmlImg.src = el._base64 ? 'data:image;base64,' + el._base64 : './img/unknown.jpg';
      htmlImg.alt = 'contributor image: ' + el._name;

      const htmlContent = document.createElement('div');
      htmlContent.classList.add('info__contributors-content');

      const htmlName = document.createElement('span');
      htmlName.classList.add('info__contributors-name');
      htmlName.textContent = el._name;

      const htmlRole = document.createElement('span');
      htmlRole.classList.add('info__contributors-role');
      htmlRole.textContent = el._role;

      htmlContent.appendChild(htmlName);
      htmlContent.appendChild(document.createElement('br'));
      htmlContent.appendChild(htmlRole);
      htmlCard.appendChild(htmlImg);
      htmlCard.appendChild(htmlContent);
      htmlInfoContributorsList.appendChild(htmlCard);
      // htmlInfoContributorsSelect.add(optCont);
   });
}
