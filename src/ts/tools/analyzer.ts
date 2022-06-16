import * as beatmap from '../beatmap';
import AnalysisComponents from './components';
import SavedData from '../savedData';
import { BeatPerMinute, NoteJumpSpeed } from '../beatmap';
import { CharacteristicName, DifficultyName } from '../types';
import { IBeatmapSettings } from '../types/mapcheck/tools/tool';
import { Tool } from '../types/mapcheck';
import Logger from '../logger';

const tag = (name: string) => {
    return `[analyzer::${name}]`;
};

const toolListInput: ReadonlyArray<Tool> = AnalysisComponents.getAll().sort((a, b) => a.order.input - b.order.input);

const toolListOutput: ReadonlyArray<Tool> = [...toolListInput].sort((a, b) => a.order.output - b.order.output);

function init(): void {
    SavedData.analysis = {
        general: {
            html: null,
        },
        map: [],
    };
}

function runGeneral(): void {
    const mapInfo = SavedData.beatmapInfo;
    if (!mapInfo) {
        Logger.error(tag('runGeneral'), 'Could not analyse, missing map info');
        return;
    }

    if (!SavedData.analysis) {
        init();
    }

    const analysisExist = SavedData.analysis?.general;

    const bpm = beatmap.BeatPerMinute.create(mapInfo._beatsPerMinute);
    const njs = beatmap.NoteJumpSpeed.create(bpm);

    const mapSettings: IBeatmapSettings = {
        bpm: bpm,
        njs: njs,
        audioDuration: SavedData.duration ?? null,
        mapDuration: 0,
    };

    Logger.info(tag('runGeneral'), `Analysing general`);
    const htmlArr: HTMLElement[] = [];
    toolListOutput
        .filter((tool) => tool.type === 'general')
        .forEach((tool) => {
            if (tool.input.enabled) {
                try {
                    tool.run({
                        settings: mapSettings,
                        difficulties: SavedData.beatmapDifficulty,
                        info: mapInfo,
                    });
                    if (tool.output.html) {
                        htmlArr.push(tool.output.html);
                    }
                } catch (err) {
                    Logger.error(tag('runGeneral'), err);
                }
            }
        });

    if (analysisExist) {
        analysisExist.html = htmlArr;
    }
}

function runDifficulty(characteristic: CharacteristicName, difficulty: DifficultyName): void {
    const mapInfo = SavedData.beatmapInfo;
    if (!mapInfo) {
        Logger.error(tag('runDifficulty'), 'Could not analyse, missing map info');
        return;
    }

    if (!SavedData.analysis) {
        init();
    }

    const beatmapDifficulty = SavedData.beatmapDifficulty?.find(
        (set) => set.characteristic === characteristic && set.difficulty === difficulty,
    );
    if (!beatmapDifficulty) {
        Logger.error(tag('runDifficulty'), 'Could not analyse, missing map data');
        return;
    }

    const analysisExist = SavedData.analysis?.map.find(
        (set) => set.difficulty === difficulty && set.mode === characteristic,
    );

    const bpm = BeatPerMinute.create(
        mapInfo._beatsPerMinute,
        beatmapDifficulty.data.customData._BPMChanges ||
            beatmapDifficulty.data.customData._bpmChanges ||
            beatmapDifficulty.data.customData.BPMChanges,
        beatmapDifficulty.info._customData?._editorOffset,
    );
    const njs = NoteJumpSpeed.create(
        bpm,
        beatmapDifficulty.info._noteJumpMovementSpeed,
        beatmapDifficulty.info._noteJumpStartBeatOffset,
    );

    const mapSettings: IBeatmapSettings = {
        bpm: bpm,
        njs: njs,
        audioDuration: SavedData.duration ?? null,
        mapDuration: bpm.toRealTime(beatmapDifficulty.data.getLastInteractiveTime()),
    };

    Logger.info(tag('runDifficulty'), `Analysing ${characteristic} ${difficulty}`);
    const htmlArr: HTMLElement[] = [];
    toolListOutput
        .filter((tool) => tool.type !== 'general')
        .forEach((tool) => {
            if (tool.input.enabled) {
                try {
                    tool.run({
                        settings: mapSettings,
                        difficulty: beatmapDifficulty,
                        info: mapInfo,
                    });
                    if (tool.output.html) {
                        htmlArr.push(tool.output.html);
                    }
                } catch (err) {
                    Logger.error(tag('runDifficulty'), err);
                }
            }
        });

    if (analysisExist) {
        analysisExist.html = htmlArr;
    } else {
        SavedData.analysis?.map.push({
            mode: characteristic,
            difficulty: difficulty,
            html: htmlArr,
        });
    }
}

function adjustTime(bpm: BeatPerMinute): void {
    const toolList = AnalysisComponents.getDifficulty().sort((a, b) => a.order.output - b.order.output);
    toolList.forEach((tool) => {
        if (tool.input.adjustTime) {
            tool.input.adjustTime(bpm);
        }
    });
}

function applyAll(): void {
    SavedData.beatmapDifficulty?.forEach((set) => runDifficulty(set.characteristic, set.difficulty));
}

export default {
    toolListInput,
    runGeneral,
    runDifficulty,
    adjustTime,
    applyAll,
};
