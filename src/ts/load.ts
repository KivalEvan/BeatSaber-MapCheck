import JSZip from 'jszip';
import * as swing from './analyzers/swing';
import { BeatPerMinute } from './beatmap';
import { V2toV3 } from './converter';
import {
    difficulty as parseDifficultyV3,
    difficultyLegacy as parseDifficultyV2,
    info as parseInfo,
} from './beatmap/parse';
import logger from './logger';
import { IInfoData } from './types';
import { IDifficultyData as IDifficultyDataV2 } from './types/beatmap/v2/difficulty';
import { IDifficultyData as IDifficultyDataV3 } from './types/beatmap/v3/difficulty';
import { IBeatmapItem } from './types/mapcheck/tools/beatmapItem';
import { Either } from './types/utils';

const tag = (name: string) => {
    return `[load::${name}]`;
};

export const loadInfo = async (zip: JSZip) => {
    const infoFile = zip.file('Info.dat') || zip.file('info.dat');
    if (!infoFile) {
        throw new Error("Couldn't find Info.dat");
    }
    logger.info(tag('loadInfo'), `loading info`);
    return parseInfo(JSON.parse(await infoFile.async('string')));
};

export const loadDifficulty = async (info: IInfoData, zip: JSZip) => {
    const beatmapItem: IBeatmapItem[] = [];
    const mapSet = info._difficultyBeatmapSets;
    for (let i = mapSet.length - 1; i >= 0; i--) {
        const mapDiff = mapSet[i]._difficultyBeatmaps;
        if (mapDiff.length === 0 || !mapDiff) {
            logger.error(tag('loadDifficulty'), 'Empty difficulty set, removing...');
            mapSet.splice(i, 1);
            continue;
        }
        for (let j = 0; j < mapDiff.length; j++) {
            const diffInfo = mapDiff[j];
            const diffFile = zip.file(diffInfo._beatmapFilename);
            if (diffFile) {
                logger.info(
                    tag('loadDifficulty'),
                    `Loading ${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty}`,
                );
                let diffJSON: Either<IDifficultyDataV2, IDifficultyDataV3>;
                try {
                    diffJSON = JSON.parse(await diffFile.async('string'));
                } catch (err) {
                    throw new Error(`${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty} ${err}`);
                }
                try {
                    // _notes in v2 and version in v3 is required, _version in v2 is patched via mod if does not exist
                    if (diffJSON._notes && diffJSON.version) {
                        logger.error(
                            tag('loadDifficulty'),
                            `${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty} contains 2 version of the map in the same file, attempting to load v3 instead`,
                        );
                    }
                    if (diffJSON.version) {
                        const data = parseDifficultyV3(diffJSON);
                        const bpm = BeatPerMinute.create(
                            info._beatsPerMinute,
                            data.customData.BPMChanges,
                            diffInfo._customData?._editorOffset,
                        );
                        beatmapItem.push({
                            info: diffInfo,
                            characteristic: mapSet[i]._beatmapCharacteristicName,
                            difficulty: diffInfo._difficulty,
                            bpm,
                            data,
                            noteContainer: data.getNoteContainer(),
                            eventContainer: data.getEventContainer(),
                            swingAnalysis: swing.info(
                                data,
                                bpm,
                                mapSet[i]._beatmapCharacteristicName,
                                diffInfo._difficulty,
                            ),
                            rawVersion: 3,
                            rawData: diffJSON,
                        });
                    } else {
                        const data = V2toV3(parseDifficultyV2(diffJSON), true);
                        const bpm = BeatPerMinute.create(
                            info._beatsPerMinute,
                            diffJSON._customData?._BPMChanges ?? diffJSON._customData?._bpmChanges,
                            diffInfo._customData?._editorOffset,
                        );
                        beatmapItem.push({
                            info: diffInfo,
                            characteristic: mapSet[i]._beatmapCharacteristicName,
                            difficulty: diffInfo._difficulty,
                            bpm,
                            data,
                            noteContainer: data.getNoteContainer(),
                            eventContainer: data.getEventContainer(),
                            swingAnalysis: swing.info(
                                data,
                                bpm,
                                mapSet[i]._beatmapCharacteristicName,
                                diffInfo._difficulty,
                            ),
                            rawVersion: 2,
                            rawData: diffJSON,
                        });
                    }
                } catch (err) {
                    throw new Error(`${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty} ${err}`);
                }
            } else {
                logger.error(
                    tag('loadDifficulty'),
                    `Missing ${diffInfo._beatmapFilename} file for ${mapSet[i]._beatmapCharacteristicName} ${diffInfo._difficulty}, ignoring.`,
                );
                mapSet[i]._difficultyBeatmaps.splice(j, 1);
                j--;
                if (mapSet[i]._difficultyBeatmaps.length < 1) {
                    logger.error(`${mapSet[i]._beatmapCharacteristicName} difficulty set now empty, ignoring.`);
                    mapSet.splice(i, 1);
                    continue;
                }
            }
        }
    }
    return beatmapItem;
};
