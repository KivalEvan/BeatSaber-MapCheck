import JSZip from 'jszip';
import UILoading from './ui/loading';
import { disableInput } from './ui/input';
import UIInfo from './ui/info';
import UITools from './ui/tools';
import UIStats from './ui/stats';
import { parseInfo, parseMap } from './beatmap/parse';
import { BeatmapInfo } from './beatmap/info';
import { BeatmapData } from './beatmap/map';
import analyse from './tools/analyse';
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
        UILoading.status('info', err, 0);
        console.error(err);
        return;
    }

    disableInput(true);
    UILoading.status('info', 'Requesting download from link', 0);

    console.log(`downloading from ${url}`);
    try {
        // apparently i need cors proxy
        let res = await downloadMap('https://cors-anywhere.herokuapp.com/' + url);
        UIInfo.setCoverLink(url);
        UIInfo.switchHeader(true);
        extractZip(res);
        return res;
    } catch (err) {
        disableInput(false);
        UILoading.status('error', err, 100);
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
        UILoading.status('info', err, 0);
        console.error(err);
        throw new Error(err);
    }

    disableInput(true);
    UILoading.status('info', 'Requesting download from BeatSaver', 0);

    console.log(`downloading from BeatSaver for map ID ${id}`);
    const url = 'https://beatsaver.com/api/download/key/' + id;
    try {
        const res = await downloadMap(url);
        UIInfo.setCoverLink('https://beatsaver.com/beatmap/' + id, id);
        UIInfo.switchHeader(true);
        extractZip(res);
    } catch (err) {
        disableInput(false);
        UILoading.status('error', err, 100);
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

// TODO: error handling here
export const extractZip = async (data: ArrayBuffer) => {
    UILoading.status('info', 'Extracting zip', 0);
    let mapZip = new JSZip();
    try {
        mapZip = await JSZip.loadAsync(data);
        loadMap(mapZip);
    } catch (err) {
        // mapReset();
        disableInput(false);
        UILoading.status('error', err, 100);
        console.error(err);
    }
};

export const loadMap = async (mapZip: JSZip) => {
    UILoading.status('info', 'Parsing map info...', 0);
    console.log('loading map info');
    let fileInfo = mapZip.file('Info.dat') || mapZip.file('info.dat');
    if (fileInfo) {
        disableInput(true);
        let infoFileStr = await fileInfo.async('string');
        savedData._mapInfo = (await JSON.parse(infoFileStr)) as BeatmapInfo;

        parseInfo(savedData._mapInfo);
        UIInfo.setInfo(savedData._mapInfo);

        // load cover image
        UILoading.status('info', 'Loading image...', 10.4375);
        console.log('loading cover image');
        let imageFile = mapZip.file(savedData._mapInfo._coverImageFilename);
        if (!settings.load.image && imageFile) {
            let imgBase64 = await imageFile.async('base64');
            UIInfo.setCoverImage('data:image;base64,' + imgBase64);
            flag.map.load.image = true;
        } else {
            console.error(`${savedData._mapInfo._coverImageFilename} does not exists.`);
        }

        savedData._contributors = [];
        let counter = savedData._mapInfo._customData?._contributors?.length || 0;
        savedData._mapInfo._customData?._contributors?.forEach(async (elem) => {
            imageFile = mapZip.file(elem._iconPath);
            let contr = elem;
            if (!settings.load.image && imageFile) {
                contr._base64 = await imageFile.async('base64');
            } else {
                console.error(`${elem._iconPath} does not exists.`);
            }
            // how is this going to be undefined??? i just defined u up there
            savedData._contributors?.push(contr);
            counter--;
            if (counter === 0) {
                UIInfo.populateContributors(savedData._contributors);
            }
        });

        // load audio
        UILoading.status('info', 'Loading audio...', 20.875);
        console.log('loading audio');
        let audioFile = mapZip.file(savedData._mapInfo._songFilename);
        if (!settings.load.audio && audioFile) {
            let audioBuffer = await audioFile.async('arraybuffer');
            let audioContext = new AudioContext();
            await audioContext
                .decodeAudioData(audioBuffer)
                .then(function (buffer) {
                    let duration = buffer.duration;
                    UIInfo.setSongDuration(duration);
                    flag.map.load.audio = true;
                })
                .catch(function (err) {
                    console.error(err);
                });
        } else {
            console.error(`${savedData._mapInfo._songFilename} does not exist.`);
        }

        // load diff map
        UILoading.status('info', 'Parsing difficulty...', 70);
        savedData._mapData = [];
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
                        `loading ${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty}`
                    );
                    let diffFileStr: BeatmapData = JSON.parse(await diffFile.async('string'));
                    const mapData = parseMap(
                        diffFileStr,
                        diffInfo._difficulty,
                        savedData._mapInfo._beatsPerMinute
                    );
                    savedData._mapData?.push({
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

        UITools.populateSelect(savedData._mapInfo);
        UILoading.status('info', 'Adding map difficulty stats...', 80);
        console.log('adding map stats');
        UIStats.populate();

        UILoading.status('info', 'Analysing map...', 85);
        console.log('analysing map');
        analyse.general();

        UILoading.status('info', 'Analysing difficulty...', 90);
        analyse.difficulty();
        UITools.displayOutput();

        disableInput(false);
        UILoading.status('info', 'Map successfully loaded!');
    } else {
        throw new Error("Couldn't find Info.dat");
    }
};
