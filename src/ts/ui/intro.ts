import * as uiLoading from './loading';
import { downloadFromID, downloadFromURL, downloadFromHash } from '../download';
import { extractZip } from '../extract';

const logPrefix = 'UI Intro: ';

const htmlInputURL = document.querySelector<HTMLInputElement>('.input__intro-url');
const htmlInputID = document.querySelector<HTMLInputElement>('.input__intro-id');
const htmlInputHash = document.querySelector<HTMLInputElement>('.input__intro-hash');
const htmlInputSearchButton = document.querySelector<HTMLInputElement>(
    '.input__search-button'
);
const htmlInputFile = document.querySelector<HTMLInputElement>('.input__file');
const htmlInputFileZone = document.querySelector<HTMLInputElement>('.input__file-zone');

if (htmlInputURL) {
    htmlInputURL.addEventListener('keydown', introInputTextHandler);
} else {
    console.error(logPrefix + 'URL input is missing');
}
if (htmlInputID) {
    htmlInputID.addEventListener('keydown', introInputTextHandler);
} else {
    console.error(logPrefix + 'ID input is missing');
}
if (htmlInputHash) {
    htmlInputHash.addEventListener('keydown', introInputTextHandler);
} else {
    console.error(logPrefix + 'Hash input is missing');
}
if (htmlInputSearchButton) {
    htmlInputSearchButton.addEventListener('click', introButtonTextHandler);
} else {
    console.error(logPrefix + 'search button is missing');
}
if (htmlInputFile) {
    htmlInputFile.addEventListener('change', inputFileHandler);
} else {
    console.error(logPrefix + 'file input is missing');
}
if (htmlInputFileZone) {
    htmlInputFileZone.addEventListener('drop', inputFileDropHandler);
    htmlInputFileZone.addEventListener('dragover', dragOverHandler);
} else {
    console.error(logPrefix + 'file drop zone is missing');
}

function introInputTextHandler(ev: KeyboardEvent): void {
    const target = ev.target as HTMLInputElement;
    if (ev.key === 'Enter' && target.value !== '') {
        if (target.classList.contains('input__intro-url')) {
            downloadFromURL(target.value);
        }
        if (target.classList.contains('input__intro-id')) {
            downloadFromID(target.value);
        }
    }
}

function introButtonTextHandler(ev: Event): void {
    if (htmlInputURL && htmlInputURL.value !== '') {
        downloadFromURL(htmlInputURL.value);
        return;
    }
    if (htmlInputID && htmlInputID.value !== '') {
        downloadFromID(htmlInputID.value);
        return;
    }
    if (htmlInputHash && htmlInputHash.value !== '') {
        downloadFromHash(htmlInputHash.value);
        return;
    }
}

// TODO: maybe break up into individual function
function inputFileHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    uiLoading.loadingStatus('info', 'Reading file input', 0);
    const file = target.files ? target.files[0] : null;
    try {
        if (file == null) {
            uiLoading.loadingStatus('info', 'No file input', 0);
            throw new Error('No file input');
        }
        if (
            file &&
            (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')
        ) {
            const fr = new FileReader();
            fr.readAsArrayBuffer(file);
            fr.addEventListener('load', () => {
                extractZip(file);
            });
        } else {
            throw new Error('Unsupported file format, please enter zip file');
        }
    } catch (err) {
        uiLoading.loadingStatus('error', err, 0);
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
            if (ev.dataTransfer.items[0].kind === 'file') {
                let file = ev.dataTransfer.items[0].getAsFile() as File;
                if (
                    file &&
                    (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')
                ) {
                    const fr = new FileReader();
                    fr.readAsArrayBuffer(file);
                    fr.addEventListener('load', () => {
                        extractZip(file);
                    });
                } else {
                    throw new Error('Unsupported file format, please enter zip file');
                }
            }
        }
    } catch (err) {
        uiLoading.loadingStatus('error', err, 0);
        console.error(err);
    }
}

function dragOverHandler(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
}
