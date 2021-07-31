import JSZip from 'jszip';
import * as uiHeader from './ui/header';
import * as uiLoading from './ui/loading';
import * as uiInfo from './ui/info';
import * as uiTools from './ui/tools';
import * as uiStats from './ui/stats';
import { disableInput } from './ui/input';
import * as beatmap from './beatmap';
import * as analyse from './tools/analyse';
import { round, sanitizeBeatSaverID, sanitizeURL } from './utils';
import settings from './settings';
import flag from './flag';
import savedData from './savedData';

export const downloadFromURL = async (input: string) => {
    // sanitize & validate url
    let url: string;
    try {
        url = sanitizeURL(input);
    } catch (err) {
        uiLoading.status('info', err, 0);
        console.error(err);
        return;
    }

    disableInput(true);
    uiLoading.status('info', 'Requesting download from link', 0);

    console.log(`downloading from ${url}`);
    try {
        // apparently i need cors proxy
        let res = await downloadMap('https://cors-anywhere.herokuapp.com/' + url);
        uiHeader.setCoverLink(url);
        extractZip(res);
        return res;
    } catch (err) {
        disableInput(false);
        uiLoading.status('error', err, 100);
        // setTimeout(function () {
        //     if (!flag.loading)
        //         $('#loadingbar').css('background-color', '#111').css('width', '0%');
        // }, 3000);
    }
    return;
};

export const downloadFromID = async (input: string) => {
    // sanitize & validate id
    let id;
    try {
        id = sanitizeBeatSaverID(input);
    } catch (err) {
        uiLoading.status('info', err, 0);
        console.error(err);
        throw new Error(err);
    }

    disableInput(true);
    uiLoading.status('info', 'Requesting download from BeatSaver', 0);

    console.log(`downloading from BeatSaver for map ID ${id}`);
    const url = 'https://beatsaver.com/api/download/key/' + id;
    try {
        const res = await downloadMap(url);
        uiHeader.setCoverLink('https://beatsaver.com/beatmap/' + id, id);
        extractZip(res);
    } catch (err) {
        disableInput(false);
        uiLoading.status('error', err, 100);
        console.error(err);
        // setTimeout(function () {
        //     if (!flag.loading)
        //         $('#loadingbar').css('background-color', '#111').css('width', '0%');
        // }, 3000);
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
    try {
        uiHeader.switchHeader(true);
        mapZip = await JSZip.loadAsync(data);
        await loadMap(mapZip);
    } catch (err) {
        // mapReset();
        disableInput(false);
        uiHeader.switchHeader(false);
        uiLoading.status('error', err, 100);
        console.error(err);
    }
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
        savedData._mapInfo = (await JSON.parse(infoFileStr)) as beatmap.info.BeatmapInfo;

        beatmap.parse.info(savedData._mapInfo);
        uiInfo.setInfo(savedData._mapInfo);

        // load cover image
        uiLoading.status('info', 'Loading image...', 10.4375);
        console.log('loading cover image');
        let imageFile = mapZip.file(savedData._mapInfo._coverImageFilename);
        if (settings.load.imageCover && imageFile) {
            let imgBase64 = await imageFile.async('base64');
            uiHeader.setCoverImage('data:image;base64,' + imgBase64);
            flag.map.load.image = true;
        } else {
            console.error(`${savedData._mapInfo._coverImageFilename} does not exists.`);
        }

        savedData._contributors = [];
        if (savedData._mapInfo?._customData?._contributors) {
            for (const contr of savedData._mapInfo._customData._contributors) {
                console.log('loading contributor image ' + contr._name);
                imageFile = mapZip.file(contr._iconPath);
                if (settings.load.imageContributor && imageFile) {
                    contr._base64 = await imageFile.async('base64');
                } else {
                    console.error(`${contr._iconPath} does not exists.`);
                }
                savedData._contributors.push(contr);
            }
        }

        // load audio
        uiLoading.status('info', 'Loading audio...', 20.875);
        console.log('loading audio');
        let audioFile = mapZip.file(savedData._mapInfo._songFilename);
        if (settings.load.audio && audioFile) {
            let audioBuffer = await audioFile.async('arraybuffer');
            let audioContext = new AudioContext();
            await audioContext
                .decodeAudioData(audioBuffer)
                .then(function (buffer) {
                    let duration = buffer.duration;
                    savedData._duration = duration;
                    uiHeader.setSongDuration(duration);
                    flag.map.load.audio = true;
                })
                .catch(function (err) {
                    console.error(err);
                });
        } else {
            console.error(`${savedData._mapInfo._songFilename} does not exist.`);
        }

        // load diff map
        uiLoading.status('info', 'Parsing difficulty...', 70);
        savedData._mapSet = [];
        const mapSet = savedData._mapInfo._difficultyBeatmapSets;
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
                    let diffFileStr: beatmap.map.BeatmapData = JSON.parse(
                        await diffFile.async('string')
                    );
                    let mapData: beatmap.map.BeatmapData;
                    try {
                        mapData = beatmap.parse.difficulty(diffFileStr);
                    } catch (err) {
                        throw new Error(
                            `${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty} ${err}`
                        );
                    }
                    savedData._mapSet?.push({
                        _mode: mapSet[i]._beatmapCharacteristicName,
                        _difficulty: diffInfo._difficulty,
                        _info: diffInfo,
                        _data: mapData,
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

        uiTools.populateSelect(savedData._mapInfo);
        uiLoading.status('info', 'Adding map difficulty stats...', 80);
        console.log('adding map stats');
        uiStats.populate();
        uiInfo.populateContributors(savedData._contributors);

        uiLoading.status('info', 'Analysing map...', 85);
        console.log('analysing map');
        analyse.general();
        uiTools.displayOutputGeneral();

        uiLoading.status('info', 'Analysing difficulty...', 90);
        analyse.difficulty();
        uiTools.displayOutputDifficulty();

        disableInput(false);
        uiLoading.status('info', 'Map successfully loaded!');
    } else {
        throw new Error("Couldn't find Info.dat");
    }
};
