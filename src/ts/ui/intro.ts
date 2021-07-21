import uiLoading from './loading';
import { downloadFromID, downloadFromURL } from '../loadMap';

const logPrefix = 'UI Intro: ';

const htmlInputURL = document.querySelector<HTMLInputElement>('.input__intro-url');
const htmlInputID = document.querySelector<HTMLInputElement>('.input__intro-id');
const htmlInputSearchButton = document.querySelector<HTMLInputElement>('.input__search-button');
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
if (htmlInputFileZone) {
    htmlInputFileZone.addEventListener('change', inputFileHandler);
    htmlInputFileZone.addEventListener('dragover', dragOverHandler);
    htmlInputFileZone.addEventListener('drop', inputFileDropHandler);
} else {
    console.error(logPrefix + 'file zone is missing');
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
    if (file === undefined || file === null) {
        uiLoading.status('info', 'No file input', 0);
        throw new Error('No file input');
    }
    if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
        const fr = new FileReader();
        fr.readAsArrayBuffer(file);
        fr.addEventListener('load', function (e) {
            // extractZip(target.result);
        });
    } else {
        uiLoading.status('info', 'Unsupported file format, please enter zip file', 0);
    }
}

function inputFileDropHandler(ev: DragEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    try {
        if (ev.dataTransfer == null) {
            throw new Error('null');
        }
        if (ev.dataTransfer.items) {
            if (ev.dataTransfer.items[0].kind === 'file') {
                let file = ev.dataTransfer.items[0].getAsFile();
                if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
                    const fr = new FileReader();
                    fr.readAsArrayBuffer(file);
                    fr.addEventListener('load', function (e) {
                        // extractZip(e.target.result);
                    });
                } else {
                    uiLoading.status('info', 'Unsupported file format, please enter zip file', 0);
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}

function dragOverHandler(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
}

function clearStats(): void {}

function clearToolsOutput(): void {}
