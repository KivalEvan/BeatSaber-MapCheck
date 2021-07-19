import version from '../version';
import UILoading from './loading';
import UISettings from './settings';
import settings from '../settings';
import { downloadFromID, downloadFromURL } from '../loadMap';

const htmlWatermark = document.querySelectorAll<HTMLElement>('.link__watermark');
const htmlVersion = document.querySelectorAll<HTMLElement>('.link__version');
const htmlInputIntroURL = document.querySelectorAll<HTMLInputElement>('.input__intro-url');
const htmlInputIntroID = document.querySelectorAll<HTMLInputElement>('.input__intro-id');
const htmlInputSearchButton = document.querySelectorAll<HTMLInputElement>('.input__search-button');
const htmlInputFileZone = document.querySelectorAll<HTMLInputElement>('.input__file-zone');
const htmlAccordion = document.querySelectorAll<HTMLInputElement>('.accordion__button');

export const init = (function () {
    let executed = false;
    return function () {
        if (!executed) {
            console.log('user interface initialised');
            executed = true;
            htmlWatermark.forEach((elem) => (elem.innerText = version.watermark));
            htmlVersion.forEach((elem) => (elem.innerText = version.value));
            htmlInputIntroURL.forEach((elem) =>
                elem.addEventListener('keydown', introInputTextHandler)
            );
            htmlInputIntroID.forEach((elem) =>
                elem.addEventListener('keydown', introInputTextHandler)
            );
            htmlInputFileZone.forEach((elem) => {
                elem.addEventListener('change', inputFileHandler);
                elem.addEventListener('dragover', dragOverHandler);
                elem.addEventListener('drop', inputFileDropHandler);
            });
            htmlInputSearchButton.forEach((elem) =>
                elem.addEventListener('click', introButtonTextHandler)
            );
            UISettings.setTheme(settings.theme);
            htmlAccordion.forEach((elem) => {
                for (const id in settings.show) {
                    if (elem.id.endsWith(id)) {
                        elem.checked = settings.show[id];
                        UISettings.setShowCheck(id, settings.show[id]);
                    }
                }
            });
        }
    };
})();

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
    for (const elem of htmlInputIntroURL) {
        if (elem.value !== '') {
            downloadFromURL(elem.value);
            return;
        }
    }
    for (const elem of htmlInputIntroID) {
        if (elem.value !== '') {
            downloadFromID(elem.value);
            return;
        }
    }
}

// TODO: maybe break up into individual function
function inputFileHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    UILoading.status('info', 'Reading file input', 0);
    const file = target.files ? target.files[0] : null;
    if (file === undefined || file === null) {
        UILoading.status('info', 'No file input', 0);
        throw new Error('No file input');
    }
    if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
        const fr = new FileReader();
        fr.readAsArrayBuffer(file);
        fr.addEventListener('load', function (e) {
            // extractZip(target.result);
        });
    } else {
        UILoading.status('info', 'Unsupported file format, please enter zip file', 0);
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
                    UILoading.status('info', 'Unsupported file format, please enter zip file', 0);
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
