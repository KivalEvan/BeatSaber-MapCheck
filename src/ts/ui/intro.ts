import main from '../main';
import UILoading from './loading';

const logPrefix = 'UI Intro: ';

const htmlInputURL: HTMLInputElement = document.querySelector('.input__intro-url')!;
const htmlInputID: HTMLInputElement = document.querySelector('.input__intro-id')!;
const htmlInputHash: HTMLInputElement = document.querySelector('.input__intro-hash')!;
const htmlInputSearchButton: HTMLInputElement = document.querySelector(
    '.input__search-button'
)!;
const htmlInputFile: HTMLInputElement = document.querySelector('.input__file')!;
const htmlInputFileZone: HTMLInputElement =
    document.querySelector('.input__file-zone')!;

if (htmlInputURL) {
    htmlInputURL.addEventListener('keydown', introInputTextHandler);
} else {
    throw new Error(logPrefix + 'URL input is missing');
}
if (htmlInputID) {
    htmlInputID.addEventListener('keydown', introInputTextHandler);
} else {
    throw new Error(logPrefix + 'ID input is missing');
}
if (htmlInputHash) {
    htmlInputHash.addEventListener('keydown', introInputTextHandler);
} else {
    throw new Error(logPrefix + 'Hash input is missing');
}
if (htmlInputSearchButton) {
    htmlInputSearchButton.addEventListener('click', introButtonTextHandler);
} else {
    throw new Error(logPrefix + 'search button is missing');
}
if (htmlInputFile) {
    htmlInputFile.addEventListener('change', inputFileHandler);
} else {
    throw new Error(logPrefix + 'file input is missing');
}
if (htmlInputFileZone) {
    htmlInputFileZone.addEventListener('drop', inputFileDropHandler);
    htmlInputFileZone.addEventListener('dragover', dragOverHandler);
} else {
    throw new Error(logPrefix + 'file drop zone is missing');
}

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
        if (
            file &&
            (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')
        ) {
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
            if (ev.dataTransfer.items[0].kind === 'file') {
                let file = ev.dataTransfer.items[0].getAsFile() as File;
                if (
                    file &&
                    (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')
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
