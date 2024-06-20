import main from '../main';
import UILoading from './loading';

const htmlInputURL: HTMLInputElement = document.querySelector('.input__intro-url')!;
const htmlInputID: HTMLInputElement = document.querySelector('.input__intro-id')!;
const htmlInputHash: HTMLInputElement = document.querySelector('.input__intro-hash')!;
const htmlInputSearchButton: HTMLInputElement = document.querySelector('.input__search-button')!;
const htmlInputFile: HTMLInputElement = document.querySelector('.input__file')!;
const htmlInputFileZone: HTMLInputElement = document.querySelector('.input__file-zone')!;

htmlInputURL.addEventListener('keydown', introInputTextHandler);
htmlInputID.addEventListener('keydown', introInputTextHandler);
htmlInputHash.addEventListener('keydown', introInputTextHandler);
htmlInputSearchButton.addEventListener('click', introButtonTextHandler);
htmlInputFile.addEventListener('change', inputFileHandler);
htmlInputFileZone.addEventListener('drop', inputFileDropHandler);
htmlInputFileZone.addEventListener('dragover', dragOverHandler);

function introInputTextHandler(ev: KeyboardEvent): void {
   const target = ev.target as HTMLInputElement;
   if (ev.key === 'Enter' && target.value !== '') {
      if (target.classList.contains('input__intro-url')) {
         main({ link: target.value });
      }
      if (target.classList.contains('input__intro-id')) {
         main({ id: target.value });
      }
      if (target.classList.contains('input__intro-hash')) {
         main({ hash: target.value });
      }
   }
}

function introButtonTextHandler(ev: Event): void {
   if (htmlInputURL && htmlInputURL.value !== '') {
      main({ link: htmlInputURL.value });
      return;
   }
   if (htmlInputID && htmlInputID.value !== '') {
      main({ id: htmlInputID.value });
      return;
   }
   if (htmlInputHash && htmlInputHash.value !== '') {
      main({ hash: htmlInputHash.value });
      return;
   }
}

// TODO: maybe break up into individual function
function inputFileHandler(ev: Event): void {
   const target = ev.target as HTMLInputElement;
   UILoading.status('info', 'Reading file input', 0);
   const file = target.files ? target.files[0] : null;
   try {
      if (file == null) {
         UILoading.status('info', 'No file input', 0);
         throw new Error('No file input');
      }
      if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
         const fr = new FileReader();
         fr.readAsArrayBuffer(file);
         fr.addEventListener('load', () => {
            main({ file });
         });
      } else {
         throw new Error('Unsupported file format, please enter zip file');
      }
   } catch (err) {
      UILoading.status('error', err, 0);
      console.error(err);
   }
}

function inputFileDropHandler(ev: DragEvent): void {
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
               fr.addEventListener('load', () => {
                  main({ file });
               });
            } else {
               throw new Error('Unsupported file format, please enter zip file');
            }
         }
      }
   } catch (err) {
      UILoading.status('error', err, 0);
      console.error(err);
   }
}

function dragOverHandler(ev: Event): void {
   ev.preventDefault();
   ev.stopPropagation();
}
