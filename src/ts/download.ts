import { round, isHex, sanitizeBeatSaverID, sanitizeURL } from './utils';
import { getZipIdURL, getZipHashURL } from './beatsaver';
import UILoading from './ui/loading';
import UIHeader from './ui/header';

export const downloadMap = async (url: string): Promise<ArrayBuffer> => {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = 5000;

        let startTime = Date.now();
        xhr.onprogress = (e) => {
            xhr.timeout += Date.now() - startTime;
            UILoading.status(
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

export const downloadFromID = async (input: string): Promise<ArrayBuffer> => {
    // sanitize & validate id
    const id = sanitizeBeatSaverID(input);

    console.log(`fetching download URL from BeatSaver for map ID ${id}`);
    UILoading.status('info', 'Fetching download URL from BeatSaver', 0);
    const url = await getZipIdURL(id);
    console.log(`downloading from BeatSaver for map ID ${id}`);
    UILoading.status('info', 'Requesting download from BeatSaver', 0);
    const res = await downloadMap(url);
    UIHeader.setCoverLink('https://beatsaver.com/maps/' + id, id);
    return res;
};

export const downloadFromURL = async (input: string): Promise<ArrayBuffer> => {
    // sanitize & validate url
    const url = sanitizeURL(input);

    // check if URL is BeatSaver map URL
    if (url.match(/^(https?:\/\/)?(www\.)?beatsaver\.com\/maps\//)) {
        return downloadFromID(
            url
                .replace(/^https?:\/\/(www\.)?beatsaver\.com\/maps\//, '')
                .match(/[a-fA-F0-9]*/)![0]
        );
    }

    UILoading.status('info', 'Requesting download from link', 0);
    console.log(`downloading from ${url}`);
    // apparently i need cors proxy
    let res = await downloadMap(url);
    UIHeader.setCoverLink(url);
    return res;
};

export const downloadFromHash = async (input: string): Promise<ArrayBuffer> => {
    // sanitize & validate id
    let hash: string;
    if (isHex(input.trim())) {
        hash = input.trim();
    } else {
        throw new Error('invalid hash');
    }

    console.log(`fetching download URL from BeatSaver for map hash ${hash}`);
    UILoading.status('info', 'Fetching download URL from BeatSaver', 0);
    const url = await getZipHashURL(hash);
    console.log(`downloading from BeatSaver for map hash ${hash}`);
    UILoading.status('info', 'Requesting download from BeatSaver', 0);
    const res = await downloadMap(url);
    return res;
};
