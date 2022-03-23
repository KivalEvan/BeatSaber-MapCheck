import { round, isHex, sanitizeBeatSaverID, sanitizeURL } from './utils';
import { getIdZipURL, getHashZipURL } from './beatsaver';

export const downloadMap = async (url: string): Promise<ArrayBuffer> => {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = 5000;

        let startTime = Date.now();
        xhr.onprogress = (e) => {
            xhr.timeout += Date.now() - startTime;
            uiLoading.status(
                'download',
                `Downloading map: ${round(e.loaded / 1024 / 1024, 1)}MB / ${round(
                    e.total / 1024 / 1024,
                    1
                )}MB`,
                (e.loaded / e.total) * 100
            );
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
            if (xhr.status === 404) {
                reject('Error 404: Map/link does not exist');
            }
            if (xhr.status === 403) {
                reject('Error 403: Forbidden');
            }
            reject(`Error ${xhr.status}`);
        };

        xhr.onerror = () => {
            reject('Error downloading');
        };

        xhr.ontimeout = () => {
            reject('Connection timeout');
        };

        xhr.send();
    });
};

export const downloadFromID = async (input: string): Promise<void> => {
    // sanitize & validate id
    let id;
    try {
        id = sanitizeBeatSaverID(input);
    } catch (err) {
        uiLoading.status('info', err, 0);
        console.error(err);
        throw new Error(err);
    }

    try {
        disableInput(true);
        console.log(`fetching download URL from BeatSaver for map ID ${id}`);
        uiLoading.status('info', 'Fetching download URL from BeatSaver', 0);
        const url = await getIdZipURL(id);
        console.log(`downloading from BeatSaver for map ID ${id}`);
        uiLoading.status('info', 'Requesting download from BeatSaver', 0);
        const res = await downloadMap(url);
        uiHeader.setCoverLink('https://beatsaver.com/maps/' + id, id);
        extractZip(res);
    } catch (err) {
        disableInput(false);
        uiLoading.status('error', err, 100);
        console.error(err);
    }
};

export const downloadFromURL = async (input: string): Promise<void> => {
    // sanitize & validate url
    let url: string;
    try {
        url = sanitizeURL(input);
    } catch (err) {
        uiLoading.status('info', err, 0);
        console.error(err);
        return;
    }

    if (url.match(/^(https?:\/\/)?(www\.)?beatsaver\.com\/maps\//)) {
        downloadFromID(
            url
                .replace(/^https?:\/\/(www\.)?beatsaver\.com\/maps\//, '')
                .match(/[a-fA-F0-9]*/)![0]
        );
        return;
    }

    try {
        disableInput(true);
        uiLoading.status('info', 'Requesting download from link', 0);
        console.log(`downloading from ${url}`);
        // apparently i need cors proxy
        let res = await downloadMap(url);
        uiHeader.setCoverLink(url);
        extractZip(res);
    } catch (err) {
        disableInput(false);
        uiLoading.status('error', err, 100);
    }
};

export const downloadFromHash = async (input: string): Promise<void> => {
    // sanitize & validate id
    let hash;
    try {
        if (isHex(input.trim())) {
            hash = input.trim();
        } else {
            throw new Error('invalid hash');
        }
    } catch (err) {
        uiLoading.status('info', err, 0);
        console.error(err);
        throw new Error(err);
    }

    try {
        disableInput(true);
        console.log(`fetching download URL from BeatSaver for map hash ${hash}`);
        uiLoading.status('info', 'Fetching download URL from BeatSaver', 0);
        const url = await getHashZipURL(hash);
        console.log(`downloading from BeatSaver for map hash ${hash}`);
        uiLoading.status('info', 'Requesting download from BeatSaver', 0);
        const res = await downloadMap(url);
        extractZip(res);
    } catch (err) {
        disableInput(false);
        uiLoading.status('error', err, 100);
        console.error(err);
    }
};
