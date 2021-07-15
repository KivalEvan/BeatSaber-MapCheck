import JSZip from 'jszip';
import { loadingStatus } from './ui/loading';
import { parseMap } from './beatmap';
import { disableInput } from './ui/input';
import { BeatmapInfo } from './beatmap/info';
import { updateCoverImage, updateInfo, updateSongDuration } from './ui/info';
import { toMMSS, round } from './utils';
import { BeatmapData } from './beatmap/map';

export const extractZip = async (data: Blob) => {
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

        updateInfo(mapInfo);

        // load cover image
        loadingStatus('info', 'Loading cover image...', 10.4375);
        console.log('loading cover image');
        let imageFile = mapZip.file(mapInfo._coverImageFilename);
        if (!flag.noImage && imageFile) {
            let imgBase64 = await imageFile.async('base64');
            updateCoverImage('data:image;base64,' + imgBase64);
            flag.map.load.image = true;
        } else {
            console.error(`${mapInfo._coverImageFilename} does not exists.`);
        }

        // load audio
        loadingStatus('info', 'Loading audio...', 20.875);
        console.log('loading audio');
        let audioFile = mapZip.file(mapInfo._songFilename);
        if (!flag.noAudio && audioFile) {
            let audioBuffer = await audioFile.async('arraybuffer');
            let audioContext = new AudioContext();
            await audioContext
                .decodeAudioData(audioBuffer)
                .then(function (buffer) {
                    let duration = buffer.duration;
                    updateSongDuration(duration);
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
        map.set = map.info._difficultyBeatmapSets;
        for (let i = map.set.length - 1; i >= 0; i--) {
            let mapDiff = map.set[i]._difficultyBeatmaps;
            if (mapDiff.length === 0 || !mapDiff) {
                // how?
                console.error('Empty difficulty set, removing...');
                map.set.splice(i, 1);
                continue;
            }

            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let diffFile = mapZip.file(diff._beatmapFilename);
                if (diffFile) {
                    console.log(
                        `loading ${map.set[i]._beatmapCharacteristicName} ${diff._difficulty}`
                    );
                    let diffFileStr: BeatmapData = await JSON.parse(diffFile.async('string'));
                    map.set[i]._difficultyBeatmaps[j]._data = parseMap(
                        diffFileStr,
                        diff._difficulty,
                        mapInfo._beatsPerMinute
                    );
                } else {
                    console.error(
                        `Missing ${diff._beatmapFilename} file for ${map.set[i]._beatmapCharacteristicName} ${diff._difficulty}, ignoring.`
                    );
                    map.set[i]._difficultyBeatmaps.splice(j, 1);
                    if (map.set[i]._difficultyBeatmaps.length < 1) {
                        console.error(
                            `${map.set[i]._beatmapCharacteristicName} difficulty set now empty, ignoring.`
                        );
                        map.set.splice(i, 1);
                        continue;
                    }
                }
            }
        }

        // create & update UI
        // could prolly had done this on previous so i dont have to re-loop
        // but i need it to be sorted specifically
        UIPopulateCharSelect();
        loadingStatus('info', 'Adding map difficulty stats...', 80);
        console.log('adding map stats');
        for (let i = 0, len = map.set.length; i < len; i++) {
            let mapDiff = map.set[i]._difficultyBeatmaps;
            await UICreateDiffSet(map.set[i]._beatmapCharacteristicName);
            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                await UICreateDiffInfo(map.set[i]._beatmapCharacteristicName, diff);
            }
        }

        loadingStatus('info', 'Analysing map...', 85);
        console.log('analysing map');
        analyseMap();

        loadingStatus('info', 'Analysing difficulty...', 90);
        for (let i = 0, len = map.set.length; i < len; i++) {
            let mapDiff = map.set[i]._difficultyBeatmaps;
            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let mapObj = {
                    mapSet: map.set[i]._beatmapCharacteristicName,
                };
                mapObj.diff = diff._difficulty;
                mapObj.text = await analyseDifficulty(map.set[i]._beatmapCharacteristicName, diff);
                map.analysis.diff.push(mapObj);
            }
        }
        UIOutputDisplay(tool.select.char, tool.select.diff);

        disableInput(false);
        loadingStatus('info', 'Map successfully loaded!');
    } else {
        throw new Error("Couldn't find Info.dat");
    }
};
