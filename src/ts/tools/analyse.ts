import * as beatmap from '../beatmap';
import * as component from './component';
import * as template from './template';
import * as swing from './swing';
import savedData from '../savedData';

const init = (): void => {
    savedData._analysis = {
        general: {
            html: null,
        },
        mapSet: [],
        missing: [],
        sps: [],
    };
};

export const general = (): void => {
    const mapInfo = savedData._mapInfo;
    if (!mapInfo) {
        console.error('could not analyse, missing map info');
        return;
    }

    if (!savedData._analysis) {
        init();
    }

    const analysisExist = savedData._analysis?.general;
    const spsSet = savedData._analysis?.sps;

    const bpm = beatmap.bpm.create(mapInfo._beatsPerMinute);
    const njs = beatmap.njs.create(bpm);

    const mapSettings: template.BeatmapSettings = {
        _bpm: bpm,
        _njs: njs,
        _audioDuration: savedData._duration ?? null,
        _mapDuration: 0,
    };

    const toolList = component.getGeneral().sort((a, b) => a.order.output - b.order.output);
    console.log(`analysing general`);
    const htmlArr: HTMLElement[] = [];
    toolList.forEach((tool) => {
        if (tool.input.enabled) {
            try {
                tool.run(mapSettings, undefined, mapInfo, spsSet);
                if (tool.output.html) {
                    htmlArr.push(tool.output.html);
                }
                if (tool.output.console) {
                    console.log(tool.output.console);
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
    mode: beatmap.characteristic.CharacteristicName,
    difficulty: beatmap.difficulty.DifficultyName
): void => {
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
        _bpm: bpm,
        _njs: njs,
        _audioDuration: savedData._duration ?? null,
        _mapDuration: bpm.toRealTime(beatmap.map.getLastInteractiveTime(mapSet._data)),
    };

    const toolList = component.getDifficulty().sort((a, b) => a.order.output - b.order.output);
    console.log(`analysing ${mode} ${difficulty}`);
    const htmlArr: HTMLElement[] = [];
    toolList.forEach((tool) => {
        if (tool.input.enabled) {
            try {
                tool.run(mapSettings, mapSet, mapInfo);
                if (tool.output.html) {
                    htmlArr.push(tool.output.html);
                }
                if (tool.output.console) {
                    console.log(tool.output.console);
                }
            } catch (err) {
                console.error(err);
            }
        }
    });

    if (analysisExist) {
        analysisExist.html = htmlArr;
    } else {
        savedData._analysis?.mapSet.push({
            mode: mode,
            difficulty: difficulty,
            html: htmlArr,
        });
    }
};

export const adjustTime = (bpm: beatmap.bpm.BeatPerMinute): void => {
    const toolList = component.getDifficulty().sort((a, b) => a.order.output - b.order.output);
    toolList.forEach((tool) => {
        if (tool.input.adjustTime) {
            tool.input.adjustTime(bpm);
        }
    });
};

export const sps = (): void => {
    let mapInfo = savedData._mapInfo;
    if (!mapInfo) {
        console.error('could not analyse, missing map info');
        return;
    }

    let bpm = beatmap.bpm.create(mapInfo._beatsPerMinute);
    if (!savedData._analysis) {
        init();
    }

    savedData._mapSet?.forEach((set) =>
        savedData._analysis?.sps.push({
            mode: set._mode,
            difficulty: set._difficulty,
            sps: swing.info(set, bpm),
        })
    );
};

export const all = (): void => {
    savedData._mapSet?.forEach((set) => difficulty(set._mode, set._difficulty));
};
