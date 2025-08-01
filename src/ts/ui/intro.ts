import { main } from '../main';
import { PayloadType } from '../types/main';
import { LoadStatus, UILoading } from './loading';

export class UIIntro {
   static #htmlInputUrl: HTMLInputElement;
   static #htmlInputId: HTMLInputElement;
   static #htmlInputHash: HTMLInputElement;
   static #htmlInputSearchButton: HTMLInputElement;
   static #htmlInputFile: HTMLInputElement;
   static #htmlInputFileZone: HTMLInputElement;

   static init(): void {
      UIIntro.#htmlInputUrl = document.querySelector('.input__intro-url')!;
      UIIntro.#htmlInputId = document.querySelector('.input__intro-id')!;
      UIIntro.#htmlInputHash = document.querySelector('.input__intro-hash')!;
      UIIntro.#htmlInputSearchButton = document.querySelector('.input__search-button')!;
      UIIntro.#htmlInputFile = document.querySelector('.input__file')!;
      UIIntro.#htmlInputFileZone = document.querySelector('.input__file-zone')!;

      UIIntro.#htmlInputUrl.addEventListener('keydown', UIIntro.#introInputTextHandler);
      UIIntro.#htmlInputId.addEventListener('keydown', UIIntro.#introInputTextHandler);
      UIIntro.#htmlInputHash.addEventListener('keydown', UIIntro.#introInputTextHandler);
      UIIntro.#htmlInputSearchButton.addEventListener('click', UIIntro.#introButtonTextHandler);
      UIIntro.#htmlInputFile.addEventListener('change', UIIntro.#inputFileHandler);
      UIIntro.#htmlInputFileZone.addEventListener('drop', UIIntro.#inputFileDropHandler);
      UIIntro.#htmlInputFileZone.addEventListener('dragover', UIIntro.#dragOverHandler);
   }

   static async #introInputTextHandler(ev: KeyboardEvent): Promise<void> {
      const target = ev.target as HTMLInputElement;
      if (ev.key === 'Enter' && target.value !== '') {
         if (target.classList.contains('input__intro-url')) {
            return main({ type: PayloadType.Url, data: target.value });
         }
         if (target.classList.contains('input__intro-id')) {
            return main({ type: PayloadType.Id, data: target.value });
         }
         if (target.classList.contains('input__intro-hash')) {
            return main({ type: PayloadType.Hash, data: target.value });
         }
      }
   }

   static async #introButtonTextHandler(ev: Event): Promise<void> {
      if (UIIntro.#htmlInputUrl && UIIntro.#htmlInputUrl.value !== '') {
         return main({ type: PayloadType.Url, data: UIIntro.#htmlInputUrl.value });
      }
      if (UIIntro.#htmlInputId && UIIntro.#htmlInputId.value !== '') {
         return main({ type: PayloadType.Id, data: UIIntro.#htmlInputId.value });
      }
      if (UIIntro.#htmlInputHash && UIIntro.#htmlInputHash.value !== '') {
         return main({
            type: PayloadType.Hash,
            data: UIIntro.#htmlInputHash.value,
         });
      }
   }

   // TODO: maybe break up into individual function
   static async #inputFileHandler(ev: Event): Promise<void> {
      const target = ev.target as HTMLInputElement;
      UILoading.status(LoadStatus.INFO, 'Reading file input', 0);
      const file = target.files ? target.files[0] : null;
      try {
         if (file == null) {
            UILoading.status(LoadStatus.INFO, 'No file input', 0);
            throw new Error('No file input');
         }
         if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
            const fr = new FileReader();
            fr.readAsArrayBuffer(file);
            fr.addEventListener('load', async () => {
               return main({ type: PayloadType.File, data: file });
            });
         } else {
            throw new Error('Unsupported file format, please enter zip file');
         }
      } catch (err) {
         UILoading.status(LoadStatus.ERROR, err, 0);
         console.error(err);
      }
   }

   static async #inputFileDropHandler(ev: DragEvent): Promise<void> {
      ev.preventDefault();
      ev.stopPropagation();
      try {
         if (ev.dataTransfer == null) {
            throw new Error('No file input');
         }
         if (ev.dataTransfer.items) {
            if (!ev.dataTransfer.items[0]) {
               throw new Error('Failed to retrieve file from drag & drop');
            }
            if (ev.dataTransfer.items[0].kind === 'file') {
               let file = ev.dataTransfer.items[0].getAsFile() as File;
               if (
                  file &&
                  (file.name.substring(file.name.length - 4) === '.zip' ||
                     file.name.substring(file.name.length - 4) === '.bsl')
               ) {
                  const fr = new FileReader();
                  fr.readAsArrayBuffer(file);
                  fr.addEventListener('load', async () => {
                     await main({ type: PayloadType.File, data: file });
                  });
               } else {
                  throw new Error('Unsupported file format, please enter zip file');
               }
            }
         }
      } catch (err) {
         UILoading.status(LoadStatus.ERROR, err, 0);
         console.error(err);
      }
   }

   static async #dragOverHandler(ev: Event): Promise<void> {
      ev.preventDefault();
      ev.stopPropagation();
   }
}
