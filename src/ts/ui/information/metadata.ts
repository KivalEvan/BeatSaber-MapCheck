import { IContributorB64 } from '../../types';
import { EnvironmentRename } from 'bsmap';
import * as types from 'bsmap/types';
import { State } from '../../state';

export class UIInfoMetadata {
   static #htmlInfoLevelAuthor: HTMLElement;
   static #htmlInfoEnvironment: HTMLElement;
   static #htmlInfoEditors: HTMLElement;
   static #htmlInfoContributors: HTMLElement;
   static #htmlInfoContributorsImage: HTMLImageElement;
   static #htmlInfoContributorsName: HTMLElement;
   static #htmlInfoContributorsRole: HTMLElement;
   static #htmlInfoContributorsList: HTMLElement;

   static init(): void {
      UIInfoMetadata.#htmlInfoLevelAuthor = document.querySelector('.info__level-author')!;
      UIInfoMetadata.#htmlInfoEnvironment = document.querySelector('.info__environment')!;
      UIInfoMetadata.#htmlInfoEditors = document.querySelector('.info__editors')!;
      UIInfoMetadata.#htmlInfoContributors = document.querySelector('.info__contributors')!;
      UIInfoMetadata.#htmlInfoContributorsImage = document.querySelector(
         '.info__contributors-image',
      )!;
      UIInfoMetadata.#htmlInfoContributorsName = document.querySelector(
         '.info__contributors-name',
      )!;
      UIInfoMetadata.#htmlInfoContributorsRole = document.querySelector(
         '.info__contributors-role',
      )!;
      UIInfoMetadata.#htmlInfoContributorsList = document.querySelector(
         '.info__contributors-list',
      )!;
   }

   static reset(): void {
      UIInfoMetadata.setLevelAuthor();
      UIInfoMetadata.setEnvironment();
      UIInfoMetadata.setEditors();
      UIInfoMetadata.populateContributors();
   }

   static setLevelAuthor(mappers?: string[], lighters?: string[]): void {
      if (!mappers) {
         UIInfoMetadata.#htmlInfoLevelAuthor.textContent = '';
         return;
      }
      if (!lighters?.length) {
         UIInfoMetadata.#htmlInfoLevelAuthor.textContent = 'Mapped by ' + mappers.join(', ');
      } else {
         UIInfoMetadata.#htmlInfoLevelAuthor.textContent =
            'Mapped by ' + mappers.join(', ') + ' and lit by ' + lighters.join(', ');
      }
   }

   static setEnvironment(envs?: types.EnvironmentAllName[]): void {
      if (!envs) {
         UIInfoMetadata.#htmlInfoEnvironment.textContent = '';
         return;
      }
      UIInfoMetadata.#htmlInfoEnvironment.textContent = envs
         .map((v) => (EnvironmentRename[v] || `Unknown (${v})`) + ' Environment')
         .join(', ');
   }

   static setEditors(obj?: types.v2.IEditor): void {
      if (!obj || !obj._lastEditedBy) {
         UIInfoMetadata.#htmlInfoEditors.classList.add('hidden');
         return;
      }
      UIInfoMetadata.#htmlInfoEditors.classList.remove('hidden');
      const lastEdited = obj._lastEditedBy || 'Undefined';
      let text = 'Last edited on ' + lastEdited;
      if (obj[lastEdited]) {
         const editor = obj[lastEdited] as types.v2.IEditorInfo;
         text += ' v' + editor.version;
      }
      UIInfoMetadata.#htmlInfoEditors.textContent = text;
   }

   static setContributors(obj: IContributorB64): void {
      UIInfoMetadata.#setContributorsImage(obj._base64 ? 'data:image;base64,' + obj._base64 : null);
      UIInfoMetadata.#setContributorsName(obj._name);
      UIInfoMetadata.#setContributorsRole(obj._role);
   }

   static populateContributors(arr?: IContributorB64[]): void {
      while (UIInfoMetadata.#htmlInfoContributorsList.firstChild) {
         UIInfoMetadata.#htmlInfoContributorsList.removeChild(
            UIInfoMetadata.#htmlInfoContributorsList.firstChild,
         );
      }
      if (!arr || !arr.length) {
         UIInfoMetadata.#htmlInfoContributors.classList.add('hidden');
         // removeOptions(htmlInfoContributorsSelect);
         return;
      }
      UIInfoMetadata.#htmlInfoContributors.classList.remove('hidden');
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
         UIInfoMetadata.#htmlInfoContributorsList.appendChild(htmlCard);
         // htmlInfoContributorsSelect.add(optCont);
      });
   }

   static #setContributorsImage(src: string | null): void {
      UIInfoMetadata.#htmlInfoContributorsImage.src = src || './img/unknown.jpg';
   }

   static #setContributorsName(str: string): void {
      UIInfoMetadata.#htmlInfoContributorsName.textContent = str;
   }

   static #setContributorsRole(str: string): void {
      UIInfoMetadata.#htmlInfoContributorsRole.textContent = str;
   }
}
