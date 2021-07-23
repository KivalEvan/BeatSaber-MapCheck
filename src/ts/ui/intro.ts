import uiLoading from './loading';
import { downloadFromID, downloadFromURL, extractZip } from '../loadMap';

const logPrefix = 'UI Intro: ';

const htmlInputURL = document.querySelector<HTMLInputElement>('.input__intro-url');
const htmlInputID = document.querySelector<HTMLInputElement>('.input__intro-id');
const htmlInputSearchButton = document.querySelector<HTMLInputElement>('.input__search-button');
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
}

// TODO: maybe break up into individual function
function inputFileHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    uiLoading.status('info', 'Reading file input', 0);
    const file = target.files ? target.files[0] : null;
    try {
        if (file == null) {
            uiLoading.status('info', 'No file input', 0);
            throw new Error('No file input');
        }
        if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
            const fr = new FileReader();
            fr.readAsArrayBuffer(file);
            fr.addEventListener('load', () => {
                extractZip(file);
            });
        } else {
            throw new Error('Unsupported file format, please enter zip file');
        }
    } catch (err) {
        uiLoading.status('error', err, 0);
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
                if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
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
        uiLoading.status('error', err, 0);
        console.error(err);
    }
}

function dragOverHandler(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
}

function clearStats(): void {}

function clearToolsOutput(): void {}