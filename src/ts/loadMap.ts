import JSZip from 'jszip';
import { loadingStatus } from './ui/loading';
import { disableInput } from './ui/input';
import UIInfo from './ui/info';
import UITools from './ui/tools';
import { parseInfo, parseMap } from './beatmap';
import { BeatmapInfo } from './beatmap/info';
import { BeatmapData } from './beatmap/map';
import { round, sanitizeBeatSaverID, sanitizeURL } from './utils';
import settings from './settings';
import flag from './flag';

export const downloadFromURL = async (input: string) => {
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
};

export const downloadFromID = async (input: string) => {
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
            loadingStatus(
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
    loadingStatus('info', 'Extracting zip', 0);
    let mapZip = new JSZip();
    try {
        mapZip = await JSZip.loadAsync(data);
        loadMap(mapZip);
    } catch (err) {
        // mapReset();
        disableInput(false);
        loadingStatus('error', err, 100);
        console.error(err);
    }
};

export const loadMap = async (mapZip: JSZip) => {
    loadingStatus('info', 'Loading map info...', 0);
    console.log('loading map info');
    let infoFile = mapZip.file('Info.dat') || mapZip.file('info.dat');
    if (infoFile) {
        disableInput(true);
        let infoFileStr = await infoFile.async('string');
        const mapInfo: BeatmapInfo = await JSON.parse(infoFileStr);
        parseInfo(mapInfo);

        UIInfo.updateInfo(mapInfo);

        // load cover image
        loadingStatus('info', 'Loading cover image...', 10.4375);
        console.log('loading cover image');
        let imageFile = mapZip.file(mapInfo._coverImageFilename);
        if (!settings.load.image && imageFile) {
            let imgBase64 = await imageFile.async('base64');
            UIInfo.updateCoverImage('data:image;base64,' + imgBase64);
            flag.map.load.image = true;
        } else {
            console.error(`${mapInfo._coverImageFilename} does not exists.`);
        }

        // load audio
        loadingStatus('info', 'Loading audio...', 20.875);
        console.log('loading audio');
        let audioFile = mapZip.file(mapInfo._songFilename);
        if (!settings.load.audio && audioFile) {
            let audioBuffer = await audioFile.async('arraybuffer');
            let audioContext = new AudioContext();
            await audioContext
                .decodeAudioData(audioBuffer)
                .then(function (buffer) {
                    let duration = buffer.duration;
                    UIInfo.updateSongDuration(duration);
                    flag.map.load.audio = true;
                })
                .catch(function (err) {
                    console.error(err);
                });
        } else {
            console.error(`${mapInfo._songFilename} does not exist.`);
        }

        // load diff map
        loadingStatus('info', 'Loading difficulty...', 70);
        const mapSet = mapInfo._difficultyBeatmapSets;
        for (let i = mapSet.length - 1; i >= 0; i--) {
            const mapDiff = mapSet[i]._difficultyBeatmaps;
            if (mapDiff.length === 0 || !mapDiff) {
                // how?
                console.error('Empty difficulty set, removing...');
                mapSet.splice(i, 1);
                continue;
            }

            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let diffFile = mapZip.file(diff._beatmapFilename);
                if (diffFile) {
                    console.log(
                        `loading ${mapSet[i]._beatmapCharacteristicName} ${diff._difficulty}`
                    );
                    let diffFileStr: BeatmapData = JSON.parse(await diffFile.async('string'));
                    mapSet[i]._difficultyBeatmaps[j]._data = parseMap(
                        diffFileStr,
                        diff._difficulty,
                        mapInfo._beatsPerMinute
                    );
                } else {
                    console.error(
                        `Missing ${diff._beatmapFilename} file for ${mapSet[i]._beatmapCharacteristicName} ${diff._difficulty}, ignoring.`
                    );
                    mapSet[i]._difficultyBeatmaps.splice(j, 1);
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

        // create & update UI
        // could prolly had done this on previous so i dont have to re-loop
        // but i need it to be sorted specifically
        UITools.populateSelectMode(mapInfo);
        loadingStatus('info', 'Adding map difficulty stats...', 80);
        console.log('adding map stats');
        for (let i = 0, len = mapSet.length; i < len; i++) {
            let mapDiff = mapSet[i]._difficultyBeatmaps;
            await UICreateDiffSet(mapSet[i]._beatmapCharacteristicName);
            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                await UICreateDiffInfo(mapSet[i]._beatmapCharacteristicName, diff);
            }
        }

        loadingStatus('info', 'Analysing map...', 85);
        console.log('analysing map');
        analyseMap();

        loadingStatus('info', 'Analysing difficulty...', 90);
        for (let i = 0, len = mapSet.length; i < len; i++) {
            let mapDiff = mapSet[i]._difficultyBeatmaps;
            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let mapObj = {
                    mapSet: mapSet[i]._beatmapCharacteristicName,
                };
                mapObj.diff = diff._difficulty;
                mapObj.text = await analyseDifficulty(mapSet[i]._beatmapCharacteristicName, diff);
                map.analysis.diff.push(mapObj);
            }
        }
        UITools.displayOutput(tool.select.char, tool.select.diff);

        disableInput(false);
        loadingStatus('info', 'Map successfully loaded!');
    } else {
        throw new Error("Couldn't find Info.dat");
    }
};
