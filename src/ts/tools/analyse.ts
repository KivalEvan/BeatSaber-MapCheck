import * as beatmap from '../beatmap';
import * as component from './component';
import savedData from '../savedData';
import { BeatPerMinute } from '../beatmap';
import { CharacteristicName, DifficultyName } from '../types';
import { IBeatmapSettings } from '../types/mapcheck/tools/tool';

export const general = (): void => {
    const mapInfo = savedData.beatmapInfo;
    if (!mapInfo) {
        console.error('could not analyse, missing map info');
        return;
    }

    const analysisExist = savedData.analysis?.general;
    const spsSet = savedData.analysis?.sps;

    const bpm = beatmap.BeatPerMinute.create(mapInfo._beatsPerMinute);
    const njs = beatmap.NoteJumpSpeed.create(bpm);

    const mapSettings: IBeatmapSettings = {
        bpm: bpm,
        njs: njs,
        audioDuration: savedData.duration ?? null,
        mapDuration: 0,
    };

    const toolList = component
        .getGeneral()
        .sort((a, b) => a.order.output - b.order.output);
    console.log(`analysing general`);
    const htmlArr: HTMLElement[] = [];
    toolList.forEach((tool) => {
        if (tool.input.enabled) {
            try {
                tool.run(mapSettings, undefined, mapInfo, spsSet);
                if (tool.output.html) {
                    htmlArr.push(tool.output.html);
                }
            } catch (err) {
                console.error(err);
            }
        }
    });

    if (analysisExist) {
        analysisExist.html = htmlArr;
    }
};

export const difficulty = (
    mode: CharacteristicName,
    difficulty: DifficultyName
): void => {
    const mapInfo = savedData.beatmapInfo;
    if (!mapInfo) {
        console.error('could not analyse, missing map info');
        return;
    }

    const mapSet = savedData.beatmapSet?.find(
        (set) => set._mode === mode && set._difficulty === difficulty
    );
    if (!mapSet) {
        console.error('could not analyse, missing map data');
        return;
    }

    if (!savedData.analysis) {
        init();
    }

    const analysisExist = savedData.analysis?.mapSet.find(
        (set) => set.difficulty === difficulty && set.mode === mode
    );

    const bpm = beatmap.bpm.create(
        mapInfo._beatsPerMinute,
        mapSet._data._customData?._BPMChanges || mapSet._data._customData?._bpmChanges,
        mapSet._info._customData?._editorOffset
    );
    const njs = beatmap.njs.create(
        bpm,
        mapSet._info._noteJumpMovementSpeed,
        mapSet._info._noteJumpStartBeatOffset
    );

    const mapSettings: IBeatmapSettings = {
        bpm: bpm,
        njs: njs,
        audioDuration: savedData.duration ?? null,
        mapDuration: bpm.toRealTime(
            beatmap.v2.difficulty.getLastInteractiveTime(mapSet._data)
        ),
    };

    const toolList = component
        .getDifficulty()
        .sort((a, b) => a.order.output - b.order.output);
    console.log(`analysing ${mode} ${difficulty}`);
    const htmlArr: HTMLElement[] = [];
    toolList.forEach((tool) => {
        if (tool.input.enabled) {
            try {
                tool.run(mapSettings, mapSet, mapInfo);
                if (tool.output.html) {
                    htmlArr.push(tool.output.html);
                }
            } catch (err) {
                console.error(err);
            }
        }
    });

    if (analysisExist) {
        analysisExist.html = htmlArr;
    } else {
        savedData.analysis?.mapSet.push({
            mode: mode,
            difficulty: difficulty,
            html: htmlArr,
        });
    }
};

export const adjustTime = (bpm: BeatPerMinute): void => {
    const toolList = component
        .getDifficulty()
        .sort((a, b) => a.order.output - b.order.output);
    toolList.forEach((tool) => {
        if (tool.input.adjustTime) {
            tool.input.adjustTime(bpm);
        }
    });
};

export const sps = (): void => {
    let mapInfo = savedData.beatmapInfo;
    if (!mapInfo) {
        console.error('could not analyse, missing map info');
        return;
    }

    let bpm = BeatPerMinute.create(mapInfo._beatsPerMinute);
    if (!savedData.analysis) {
        init();
    }

    savedData.beatmapSet?.forEach((set) =>
        savedData.analysis?.sps.push({
            mode: set._mode,
            difficulty: set._difficulty,
            sps: beatmap.open.swing.info(set._data, bpm),
        })
    );
};

export const all = (): void => {
    savedData.beatmapSet?.forEach((set) => difficulty(set._mode, set._difficulty));
};
