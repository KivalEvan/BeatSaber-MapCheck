import * as beatmap from '../beatmap';
import AnalysisComponents from './components';
import SavedData from '../savedData';
import { BeatPerMinute } from '../beatmap';
import { CharacteristicName, DifficultyName } from '../types';
import { IBeatmapSettings } from '../types/mapcheck/tools/tool';
import { Tool } from '../types/mapcheck';

export default new (class Analysis {
    toolList: Tool[];
    constructor() {
        this.toolList = AnalysisComponents.getAll().sort(
            (a, b) => a.order.input - b.order.input
        );
    }

    runGeneral = (): void => {
        const mapInfo = SavedData.beatmapInfo;
        if (!mapInfo) {
            console.error('could not analyse, missing map info');
            return;
        }

        const analysisExist = SavedData.analysis?.general;
        const spsSet = SavedData.analysis?.map.map((m) => m.sps);

        const bpm = beatmap.BeatPerMinute.create(mapInfo._beatsPerMinute);
        const njs = beatmap.NoteJumpSpeed.create(bpm);

        const mapSettings: IBeatmapSettings = {
            bpm: bpm,
            njs: njs,
            audioDuration: SavedData.duration ?? null,
            mapDuration: 0,
        };

        const toolList = AnalysisComponents.getGeneral().sort(
            (a, b) => a.order.output - b.order.output
        );
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

    runDifficulty = (mode: CharacteristicName, difficulty: DifficultyName): void => {
        const mapInfo = SavedData.beatmapInfo;
        if (!mapInfo) {
            console.error('could not analyse, missing map info');
            return;
        }

        const beatmapDifficulty = SavedData.beatmapDifficulty?.find(
            (set) => set.characteristic === mode && set.difficulty === difficulty
        );
        if (!beatmapDifficulty) {
            console.error('could not analyse, missing map data');
            return;
        }

        if (!SavedData.analysis) {
            init();
        }

        const analysisExist = SavedData.analysis?.mapSet.find(
            (set) => set.difficulty === difficulty && set.mode === mode
        );

        const bpm = beatmap.bpm.create(
            mapInfo._beatsPerMinute,
            beatmapDifficulty.data.customData?._BPMChanges ||
                beatmapDifficulty._data._customData?._bpmChanges,
            beatmapDifficulty.info._customData?._editorOffset
        );
        const njs = beatmap.njs.create(
            bpm,
            beatmapDifficulty.info._noteJumpMovementSpeed,
            beatmapDifficulty.info._noteJumpStartBeatOffset
        );

        const mapSettings: IBeatmapSettings = {
            bpm: bpm,
            njs: njs,
            audioDuration: SavedData.duration ?? null,
            mapDuration: bpm.toRealTime(
                beatmapDifficulty.data.getLastInteractiveTime()
            ),
        };

        const toolList = AnalysisComponents.getDifficulty().sort(
            (a, b) => a.order.output - b.order.output
        );
        console.log(`analysing ${mode} ${difficulty}`);
        const htmlArr: HTMLElement[] = [];
        toolList.forEach((tool) => {
            if (tool.input.enabled) {
                try {
                    tool.run(mapSettings, beatmapDifficulty, mapInfo);
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
            SavedData.analysis?.mapSet.push({
                mode: mode,
                difficulty: difficulty,
                html: htmlArr,
            });
        }
    };

    adjustTime = (bpm: BeatPerMinute): void => {
        const toolList = AnalysisComponents.getDifficulty().sort(
            (a, b) => a.order.output - b.order.output
        );
        toolList.forEach((tool) => {
            if (tool.input.adjustTime) {
                tool.input.adjustTime(bpm);
            }
        });
    };

    runSPS = (): void => {
        let mapInfo = SavedData.beatmapInfo;
        if (!mapInfo) {
            console.error('could not analyse, missing map info');
            return;
        }

        let bpm = BeatPerMinute.create(mapInfo._beatsPerMinute);
        if (!SavedData.analysis) {
            init();
        }

        SavedData.beatmapDifficulty.forEach((set) =>
            SavedData.analysis?.sps.push({
                mode: set.characteristic,
                difficulty: set.difficulty,
                sps: beatmap.open.swing.info(set.data, bpm),
            })
        );
    };

    applyAll = (): void => {
        SavedData.beatmapDifficulty?.forEach((set) =>
            this.runDifficulty(set.characteristic, set.difficulty)
        );
    };
})();
