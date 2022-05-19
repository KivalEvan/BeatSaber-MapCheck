import * as beatmap from '../beatmap';
import AnalysisComponents from './components';
import SavedData from '../savedData';
import { BeatPerMinute, NoteJumpSpeed } from '../beatmap';
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

    private init = (): void => {
        SavedData.analysis = {
            general: {
                html: null,
            },
            map: [],
        };
    };

    runGeneral = (): void => {
        const mapInfo = SavedData.beatmapInfo;
        if (!mapInfo) {
            console.error('could not analyse, missing map info');
            return;
        }

        if (!SavedData.analysis) {
            this.init();
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

        const toolList = AnalysisComponents.getGeneral().sort(
            (a, b) => a.order.output - b.order.output
        );
        console.log(`analysing general`);
        const htmlArr: HTMLElement[] = [];
        toolList.forEach((tool) => {
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
                    console.error(err);
                }
            }
        });

        if (analysisExist) {
            analysisExist.html = htmlArr;
        }
    };

    runDifficulty = (
        characteristic: CharacteristicName,
        difficulty: DifficultyName
    ): void => {
        const mapInfo = SavedData.beatmapInfo;
        if (!mapInfo) {
            console.error('could not analyse, missing map info');
            return;
        }

        if (!SavedData.analysis) {
            this.init();
        }

        const beatmapDifficulty = SavedData.beatmapDifficulty?.find(
            (set) =>
                set.characteristic === characteristic && set.difficulty === difficulty
        );
        if (!beatmapDifficulty) {
            console.error('could not analyse, missing map data');
            return;
        }

        const analysisExist = SavedData.analysis?.map.find(
            (set) => set.difficulty === difficulty && set.mode === characteristic
        );

        const bpm = BeatPerMinute.create(
            mapInfo._beatsPerMinute,
            beatmapDifficulty.data.customData?._BPMChanges ||
                beatmapDifficulty.data.customData?._bpmChanges,
            beatmapDifficulty.info._customData?._editorOffset
        );
        const njs = NoteJumpSpeed.create(
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
        console.log(`analysing ${characteristic} ${difficulty}`);
        const htmlArr: HTMLElement[] = [];
        toolList.forEach((tool) => {
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
                    console.error(err);
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

    applyAll = (): void => {
        SavedData.beatmapDifficulty?.forEach((set) =>
            this.runDifficulty(set.characteristic, set.difficulty)
        );
    };
})();
