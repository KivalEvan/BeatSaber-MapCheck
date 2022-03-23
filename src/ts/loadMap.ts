import JSZip from 'jszip';
import * as uiHeader from './ui/header';
import * as uiLoading from './ui/loading';
import * as uiInfo from './ui/information';
import * as uiTools from './ui/tools';
import * as uiStats from './ui/stats';
import { disableInput } from './ui/input';
import * as beatmap from './beatmap';
import * as analyse from './tools/analyse';
import settings from './settings';
import flag from './flag';
import SavedData from './SavedData';
import { IInfoData } from './types/beatmap/shared/info';

// TODO: break these to smaller functions, and probably slap in async while at it
// TODO: possibly do more accurate & predictive loading bar based on the amount of file available (may be farfetched and likely not be implemented)
export const loadMap = async (mapZip: JSZip) => {
    uiLoading.status('info', 'Parsing map info...', 0);
    console.log('parsing map info');
    const fileInfo = mapZip.file('Info.dat') || mapZip.file('info.dat');
    if (fileInfo) {
        disableInput(true);
        let infoFileStr = await fileInfo.async('string');
        SavedData.beatmapInfo = (await JSON.parse(infoFileStr)) as IInfoData;

        beatmap.parse.info(SavedData.beatmapInfo);
        uiInfo.setInfo(SavedData.beatmapInfo);

        // load cover image
        uiLoading.status('info', 'Loading image...', 10.4375);
        console.log('loading cover image');
        let imageFile = mapZip.file(SavedData.beatmapInfo._coverImageFilename);
        if (settings.load.imageCover && imageFile) {
            let imgBase64 = await imageFile.async('base64');
            uiHeader.setCoverImage('data:image;base64,' + imgBase64);
            flag.loading.coverImage = true;
        } else {
            console.error(
                `${SavedData.beatmapInfo._coverImageFilename} does not exists.`
            );
        }

        SavedData.contributors = [];
        if (SavedData.beatmapInfo?._customData?._contributors) {
            for (const contr of SavedData.beatmapInfo._customData._contributors) {
                console.log('loading contributor image ' + contr._name);
                imageFile = mapZip.file(contr._iconPath);
                if (settings.load.imageContributor && imageFile) {
                    contr._base64 = await imageFile.async('base64');
                } else {
                    console.error(`${contr._iconPath} does not exists.`);
                }
                SavedData.contributors.push(contr);
            }
        }

        // load audio
        uiLoading.status('info', 'Loading audio...', 20.875);
        console.log('loading audio');
        let audioFile = mapZip.file(SavedData.beatmapInfo._songFilename);
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
                    SavedData.duration = duration;
                    uiHeader.setSongDuration(duration);
                    flag.map.load.audio = true;
                })
                .catch(function (err) {
                    uiHeader.setSongDuration();
                    console.error(err);
                });
        } else {
            uiHeader.setSongDuration();
            console.error(`${SavedData.beatmapInfo._songFilename} does not exist.`);
        }

        // load diff map
        uiLoading.status('info', 'Parsing difficulty...', 70);
        SavedData.beatmapDifficulty = [];
        const mapSet = SavedData.beatmapInfo._difficultyBeatmapSets;
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
                    SavedData.beatmapDifficulty.push({
                        _mode: mapSet[i]._beatmapCharacteristicName,
                        _difficulty: diffInfo._difficulty,
                        _info: diffInfo,
                        _data: mapData,
                        _environment: SavedData.beatmapInfo._environmentName,
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
        uiInfo.populateContributors(SavedData.contributors);

        uiLoading.status('info', 'Analysing map...', 85);
        console.log('analysing map');
        analyse.sps();
        analyse.general();
        uiTools.displayOutputGeneral();

        uiLoading.status('info', 'Analysing difficulty...', 90);
        analyse.all();
        uiTools.populateSelect(SavedData.beatmapInfo);
        uiTools.displayOutputDifficulty();

        disableInput(false);
        uiLoading.status('info', 'Map successfully loaded!');
    } else {
        throw new Error("Couldn't find Info.dat");
    }
};
