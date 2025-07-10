import { round, secToMmssms } from 'bsmap/utils';
import { State } from '../state';

export class UIHeader {
   static #htmlIntro: HTMLElement;
   static #htmlMetadata: HTMLElement;
   static #htmlCoverLink: HTMLLinkElement;
   static #htmlCoverImage: HTMLImageElement;
   static #htmlMetadataSongName: HTMLElement;
   static #htmlMetadataSongSubname: HTMLElement;
   static #htmlMetadataSongAuthor: HTMLElement;
   static #htmlMetadataSongBPM: HTMLElement;
   static #htmlMetadataSongDuration: HTMLElement;
   static #htmlAudio: HTMLAudioElement;

   static init(): void {
      UIHeader.#htmlIntro = document.querySelector('.intro')!;
      UIHeader.#htmlMetadata = document.querySelector('.metadata')!;
      UIHeader.#htmlCoverLink = document.querySelector('.cover__link')!;
      UIHeader.#htmlCoverImage = document.querySelector('.cover__image')!;
      UIHeader.#htmlMetadataSongName = document.querySelector('.metadata__song-name')!;
      UIHeader.#htmlMetadataSongSubname = document.querySelector('.metadata__song-subname')!;
      UIHeader.#htmlMetadataSongAuthor = document.querySelector('.metadata__song-author')!;
      UIHeader.#htmlMetadataSongBPM = document.querySelector('.metadata__song-bpm')!;
      UIHeader.#htmlMetadataSongDuration = document.querySelector('.metadata__song-duration')!;
      UIHeader.#htmlAudio = document.querySelector('.audio')!;

      UIHeader.reset();
   }

   static reset(): void {
      UIHeader.switchToIntro();
      UIHeader.setCoverImage(null);
      UIHeader.setCoverLink();
      UIHeader.setSongDuration(0);
      UIHeader.unloadAudio();
   }

   static switchToIntro(): void {
      UIHeader.#htmlIntro.classList.remove('hidden');
      UIHeader.#htmlMetadata.classList.add('hidden');
   }

   static switchToMetadata(): void {
      UIHeader.#htmlIntro.classList.add('hidden');
      UIHeader.#htmlMetadata.classList.remove('hidden');
   }

   static setCoverImage(src: string | null): void {
      UIHeader.#htmlCoverImage.src = src || './img/unknown.jpg';
   }

   static getCoverImage(): string | null {
      return UIHeader.#htmlCoverImage.src;
   }

   static setCoverLink(url?: string, id?: string): void {
      if (url == null && id == null) {
         UIHeader.#htmlCoverLink.textContent = '';
         UIHeader.#htmlCoverLink.href = '';
         UIHeader.#htmlCoverLink.classList.add('disabled');
         return;
      }
      if (url != null) {
         UIHeader.#htmlCoverLink.textContent = id ?? 'Download Link';
         UIHeader.#htmlCoverLink.href = url;
         UIHeader.#htmlCoverLink.classList.remove('disabled');
      }
   }

   static setSongName(str: string): void {
      UIHeader.#htmlMetadataSongName.textContent = str;
   }

   static setSongSubname(str: string): void {
      UIHeader.#htmlMetadataSongSubname.textContent = str;
   }

   static setSongAuthor(str: string): void {
      UIHeader.#htmlMetadataSongAuthor.textContent = str;
   }

   // TODO: some way to save bpm change
   static setSongBPM(num: number, minBPM?: number, maxBPM?: number): void {
      if ((minBPM === null || minBPM === undefined) && typeof maxBPM === 'number') {
         minBPM = Math.min(num, maxBPM);
      }
      if ((maxBPM === null || maxBPM === undefined) && typeof minBPM === 'number') {
         maxBPM = Math.max(num, minBPM);
      }
      let text = round(num, 2).toString() + 'BPM';
      if (minBPM && maxBPM && minBPM !== maxBPM) {
         text += ` (${round(minBPM, 2)}-${round(maxBPM, 2)})`;
      }
      UIHeader.#htmlMetadataSongBPM.textContent = text;
   }

   static setSongDuration(num?: string | number): void {
      if (typeof num === 'number') {
         UIHeader.#htmlMetadataSongDuration.textContent = secToMmssms(num);
      } else if (typeof num === 'string') {
         UIHeader.#htmlMetadataSongDuration.textContent = num;
      } else {
         UIHeader.#htmlMetadataSongDuration.textContent = 'No audio';
      }
   }

   static async setAudio(arrayBuffer: ArrayBuffer): Promise<void> {
      const blob = new Blob([arrayBuffer], { type: 'audio/ogg' });
      UIHeader.#htmlAudio.src = window.URL.createObjectURL(blob);
   }

   static unloadAudio(): void {
      UIHeader.#htmlAudio.src = '';
      window.URL.revokeObjectURL('');
   }
}
