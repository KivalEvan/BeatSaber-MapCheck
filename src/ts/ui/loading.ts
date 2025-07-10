import { State } from '../state';

export const enum LoadStatus {
   INFO,
   DOWNLOAD,
   ERROR,
}

export class UILoading {
   static #htmlLoadingBarError = 'loading__bar--error';
   static #htmlLoadingBarDownload = 'loading__bar--download';
   static #htmlLoadingBar: HTMLElement;
   static #htmlLoadingText: HTMLElement;

   static init(): void {
      UILoading.#htmlLoadingBar = document.querySelector('.loading__bar')!;
      UILoading.#htmlLoadingText = document.querySelector('.loading__text')!;
   }

   static status(type: LoadStatus, text: string, percentage: number = 100): void {
      UILoading.#htmlLoadingText.textContent = text;
      UILoading.#htmlLoadingBar.style.width = `${percentage}%`;
      if (type === LoadStatus.ERROR)
         UILoading.#htmlLoadingBar.classList.add(UILoading.#htmlLoadingBarError);
      else UILoading.#htmlLoadingBar.classList.remove(UILoading.#htmlLoadingBarError);
      if (type === LoadStatus.DOWNLOAD)
         UILoading.#htmlLoadingBar.classList.add(UILoading.#htmlLoadingBarDownload);
      else UILoading.#htmlLoadingBar.classList.remove(UILoading.#htmlLoadingBarDownload);
   }

   static reset(): void {
      UILoading.status(LoadStatus.INFO, 'No map loaded', 0);
   }
}
