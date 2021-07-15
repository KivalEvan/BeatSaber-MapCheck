import version from '../version';
import { round, sanitizeBeatSaverID, sanitizeURL } from '../utils';
import { loadingStatus } from './loading';
import { disableInput } from './input';
import settings from '../settings';

const htmlWatermark = document.querySelectorAll<HTMLElement>('.link__watermark');
const htmlVersion = document.querySelectorAll<HTMLElement>('.link__version');
const htmlCoverLink = document.querySelectorAll<HTMLLinkElement>('.cover__link');
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
            htmlAccordion.forEach((elem) => {
                for (const id in settings.show) {
                    if (elem.id.endsWith(id)) {
                        elem.checked = settings.show[id];
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
function inputFileHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    loadingStatus('info', 'Reading file input', 0);
    const file = target.files ? target.files[0] : null;
    if (file === undefined || file === null) {
        loadingStatus('info', 'No file input', 0);
        throw new Error('No file input');
    }
    if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
        const fr = new FileReader();
        fr.readAsArrayBuffer(file);
        fr.addEventListener('load', function (e) {
            // extractZip(e.target.result);
        });
    } else {
        loadingStatus('info', 'Unsupported file format, please enter zip file', 0);
    }
}
function inputFileDropHandler(ev: DragEvent): void {
    ev.preventDefault();
    ev.stopPropagation();
    console.log('test');
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
                    loadingStatus('info', 'Unsupported file format, please enter zip file', 0);
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
export async function downloadFromURL(input: string) {
    // sanitize & validate url
    let url: string;
    try {
        url = sanitizeURL(input);
    } catch (err) {
        loadingStatus('info', err, 0);
        console.error(err);
        return;
    }

    disableInput(true);
    loadingStatus('info', 'Requesting download from link', 0);

    console.log(`downloading from ${url}`);
    try {
        // apparently i need cors proxy
        let res = await downloadMap('https://cors-anywhere.herokuapp.com/' + url);
        // map.url = url;
        return res;
        // extractZip(res);
    } catch (err) {
        disableInput(false);
        loadingStatus('error', err, 100);
        // setTimeout(function () {
        //     if (!flag.loading)
        //         $('#loadingbar').css('background-color', '#111').css('width', '0%');
        // }, 3000);
    }
}
export async function downloadFromID(input: string) {
    // sanitize & validate id
    let id;
    try {
        id = sanitizeBeatSaverID(input);
    } catch (err) {
        loadingStatus('info', err, 0);
        console.error(err);
        throw new Error(err);
    }

    disableInput(true);
    loadingStatus('info', 'Requesting download from BeatSaver', 0);

    console.log(`downloading from BeatSaver for map ID ${id}`);
    let url = 'https://beatsaver.com/api/download/key/' + id;
    try {
        let res = await downloadMap(url);
        // map.id = id;
        // map.url = 'https://beatsaver.com/beatmap/' + id;
        // extractZip(res);
    } catch (err) {
        disableInput(false);
        loadingStatus('error', err, 100);
        console.error(err);
        // setTimeout(function () {
        //     if (!flag.loading)
        //         $('#loadingbar').css('background-color', '#111').css('width', '0%');
        // }, 3000);
    }
}
async function downloadMap(url: string): Promise<Blob> {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = 5000;

        let startTime = Date.now();
        xhr.onprogress = function (e) {
            xhr.timeout += Date.now() - startTime;
            loadingStatus(
                'download',
                `Downloading map: ${round(e.loaded / 1024 / 1024, 1)}MB / ${round(
                    e.total / 1024 / 1024,
                    1
                )}MB`,
                (e.loaded / e.total) * 100
            );
        };

        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else if (xhr.status === 404) {
                reject('Error 404: Map does not exist');
            } else if (xhr.status === 403) {
                reject('Error 403: Forbidden');
            } else {
                reject(`Error ${xhr.status}`);
            }
        };

        xhr.onerror = function () {
            reject('Error downloading map');
        };

        xhr.ontimeout = function () {
            reject('Connection timeout');
        };

        xhr.send();
    });
}
function clearStats(): void {}
function clearToolsOutput(): void {}

// if (map.url !== null) {
//     if (map.id !== null) {
//         $('#map-link').text(`${map.id}`);
//     } else {
//         $('#map-link').text('Download Link');
//     }
//     $('#map-link').attr('href', map.url).css('display', 'block');
// }
