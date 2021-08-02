import * as beatmap from '../beatmap';
import * as component from './component';
import * as template from './template';
import savedData from '../savedData';

const init = (): void => {
    savedData._analysis = {
        general: {
            html: null,
        },
        mapSet: [],
        missing: [],
    };
};

export const general = (): void => {};

export const difficulty = (
    mode: beatmap.characteristic.CharacteristicName,
    difficulty: beatmap.difficulty.DifficultyName
): void => {
    const toolList = component.getDifficulty().sort((a, b) => a.order.output - b.order.output);

    const mapInfo = savedData._mapInfo;
    if (!mapInfo) {
        console.error('could not analyse, missing map info');
        return;
    }

    const mapSet = savedData._mapSet?.find(
        (set) => set._mode === mode && set._difficulty === difficulty
    );
    if (!mapSet) {
        console.error('could not analyse, missing map data');
        return;
    }

    if (!savedData._analysis) {
        init();
    }

    const analysisExist = savedData._analysis?.mapSet.find(
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

    const mapSettings: template.BeatmapSettings = {
        _mode: mode,
        _difficulty: difficulty,
        _bpm: bpm,
        _njs: njs,
        _audioDuration: savedData._duration ?? null,
        _mapDuration: bpm.toRealTime(beatmap.map.getLastInteractiveTime(mapSet._data)),
    };

    const htmlArr: HTMLElement[] = [];
    toolList.forEach((tool) => {
        tool.run(mapSettings, mapSet, mapInfo);
        if (tool.output.html) {
            htmlArr.push(tool.output.html);
        }
        if (tool.output.console) {
            console.log(tool.output.console);
        }
    });

    if (analysisExist) {
        analysisExist.html = htmlArr;
    } else {
        savedData._analysis?.mapSet.push({
            mode: mode,
            difficulty: difficulty,
            html: htmlArr,
            sps: 0,
        });
    }
};

export const clear = (): void => {};

export const all = (): void => {
    savedData._mapSet?.forEach((set) => difficulty(set._mode, set._difficulty));
};
