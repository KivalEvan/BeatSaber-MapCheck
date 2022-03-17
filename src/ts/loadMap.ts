import JSZip from 'jszip';
import * as uiHeader from './ui/header';
import * as uiLoading from './ui/loading';
import * as uiInfo from './ui/information';
import * as uiTools from './ui/tools';
import * as uiStats from './ui/stats';
import { disableInput } from './ui/input';
import * as beatmap from './beatmap';
import * as analyse from './tools/analyse';
import { round, isHex, sanitizeBeatSaverID, sanitizeURL } from './utils';
import settings from './settings';
import flag from './flag';
import savedData, { clearData } from './savedData';
import { getIdZipURL, getHashZipURL } from './beatsaver';

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

// TODO: error handling here
export const extractZip = async (data: ArrayBuffer | File) => {
    uiLoading.status('info', 'Extracting zip', 0);
    let mapZip = new JSZip();
    console.time('loading time');
    try {
        uiHeader.switchHeader(true);
        mapZip = await JSZip.loadAsync(data);
        await loadMap(mapZip);
    } catch (err) {
        clearData();
        disableInput(false);
        uiHeader.switchHeader(false);
        uiLoading.status('error', err, 100);
        console.error(err);
    }
    console.timeEnd('loading time');
};

// TODO: break these to smaller functions, and probably slap in async while at it
// TODO: possibly do more accurate & predictive loading bar based on the amount of file available (may be farfetched and likely not be implemented)
export const loadMap = async (mapZip: JSZip) => {
    uiLoading.status('info', 'Parsing map info...', 0);
    console.log('parsing map info');
    const fileInfo = mapZip.file('Info.dat') || mapZip.file('info.dat');
    if (fileInfo) {
        disableInput(true);
        let infoFileStr = await fileInfo.async('string');
        savedData.beatmapInfo = (await JSON.parse(
            infoFileStr
        )) as beatmap.types.InfoData;

        beatmap.parse.info(savedData.beatmapInfo);
        uiInfo.setInfo(savedData.beatmapInfo);

        // load cover image
        uiLoading.status('info', 'Loading image...', 10.4375);
        console.log('loading cover image');
        let imageFile = mapZip.file(savedData.beatmapInfo._coverImageFilename);
        if (settings.load.imageCover && imageFile) {
            let imgBase64 = await imageFile.async('base64');
            uiHeader.setCoverImage('data:image;base64,' + imgBase64);
            flag.map.load.image = true;
        } else {
            console.error(
                `${savedData.beatmapInfo._coverImageFilename} does not exists.`
            );
        }

        savedData.contributors = [];
        if (savedData.beatmapInfo?._customData?._contributors) {
            for (const contr of savedData.beatmapInfo._customData._contributors) {
                console.log('loading contributor image ' + contr._name);
                imageFile = mapZip.file(contr._iconPath);
                if (settings.load.imageContributor && imageFile) {
                    contr._base64 = await imageFile.async('base64');
                } else {
                    console.error(`${contr._iconPath} does not exists.`);
                }
                savedData.contributors.push(contr);
            }
        }

        // load audio
        uiLoading.status('info', 'Loading audio...', 20.875);
        console.log('loading audio');
        let audioFile = mapZip.file(savedData.beatmapInfo._songFilename);
        if (settings.load.audio && audioFile) {
            let loaded = false;
            setTimeout(() => {
                if (!loaded)
                    uiLoading.status(
                        'info',
                        'Loading audio... (this may take a while)',
                        20.875
                    );
            }, 10000);
            let arrayBuffer = await audioFile.async('arraybuffer');
            uiHeader.setAudio(arrayBuffer);
            let audioContext = new AudioContext();
            await audioContext
                .decodeAudioData(arrayBuffer)
                .then((buffer) => {
                    loaded = true;
                    let duration = buffer.duration;
                    savedData.duration = duration;
                    uiHeader.setSongDuration(duration);
                    flag.map.load.audio = true;
                })
                .catch(function (err) {
                    uiHeader.setSongDuration();
                    console.error(err);
                });
        } else {
            uiHeader.setSongDuration();
            console.error(`${savedData.beatmapInfo._songFilename} does not exist.`);
        }

        // load diff map
        uiLoading.status('info', 'Parsing difficulty...', 70);
        savedData.beatmapSet = [];
        const mapSet = savedData.beatmapInfo._difficultyBeatmapSets;
        for (let i = mapSet.length - 1; i >= 0; i--) {
            const mapDiff = mapSet[i]._difficultyBeatmaps;
            if (mapDiff.length === 0 || !mapDiff) {
                console.error('Empty difficulty set, removing...');
                mapSet.splice(i, 1);
                continue;
            }
            for (let j = 0; j < mapDiff.length; j++) {
                const diffInfo = mapDiff[j];
                const diffFile = mapZip.file(diffInfo._beatmapFilename);
                if (diffFile) {
                    console.log(
                        `parsing ${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty}`
                    );
                    let diffFileStr: beatmap.v2.types.DifficultyData = JSON.parse(
                        await diffFile.async('string')
                    );
                    let mapData: beatmap.v2.types.DifficultyData;
                    try {
                        mapData = beatmap.parse.difficultyLegacy(diffFileStr);
                    } catch (err) {
                        throw new Error(
                            `${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty} ${err}`
                        );
                    }
                    savedData.beatmapSet?.push({
                        _mode: mapSet[i]._beatmapCharacteristicName,
                        _difficulty: diffInfo._difficulty,
                        _info: diffInfo,
                        _data: mapData,
                        _environment: savedData.beatmapInfo._environmentName,
                    });
                } else {
                    console.error(
                        `Missing ${diffInfo._beatmapFilename} file for ${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty}, ignoring.`
                    );
                    mapSet[i]._difficultyBeatmaps.splice(j, 1);
                    j--;
                    if (mapSet[i]._difficultyBeatmaps.length < 1) {
                        console.error(
                            `${mapSet[i]._beatmapCharacteristicName} difficulty set now empty, ignoring.`
                        );
                        mapSet.splice(i, 1);
                        continue;
                    }
                }
            }
        }

        uiTools.adjustTime();
        uiLoading.status('info', 'Adding map difficulty stats...', 80);
        console.log('adding map stats');
        uiStats.populate();
        uiInfo.populateContributors(savedData.contributors);

        uiLoading.status('info', 'Analysing map...', 85);
        console.log('analysing map');
        analyse.sps();
        analyse.general();
        uiTools.displayOutputGeneral();

        uiLoading.status('info', 'Analysing difficulty...', 90);
        analyse.all();
        uiTools.populateSelect(savedData.beatmapInfo);
        uiTools.displayOutputDifficulty();

        disableInput(false);
        uiLoading.status('info', 'Map successfully loaded!');
    } else {
        throw new Error("Couldn't find Info.dat");
    }
};
