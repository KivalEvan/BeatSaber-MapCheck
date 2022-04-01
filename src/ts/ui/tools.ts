import * as beatmap from '../beatmap';
import savedData from '../savedData';
import * as tools from '../tools';
import * as analyse from '../tools/analyse';
import uiLoading from './loading';
import uiInformation from './information';
import { removeOptions } from '../utils';
import { DifficultyRename } from '../beatmap';
import { CharacteristicRename } from '../beatmap/shared/characteristic';
import { CharacteristicName, DifficultyName, IInfoData, IInfoSetData } from '../types';

const logPrefix = 'UI Tools: ';

export default new (class UITools {
    private htmlToolsSelectMode: NodeListOf<HTMLSelectElement>;
    private htmlToolsSelectDifficulty: NodeListOf<HTMLSelectElement>;
    private htmlToolsDifficultyLabel: NodeListOf<HTMLElement>;
    private htmlToolsNote: HTMLElement;
    private htmlToolsObstacle: HTMLElement;
    private htmlToolsEvent: HTMLElement;
    private htmlToolsOther: HTMLElement;
    private htmlToolsOutputDifficulty: HTMLElement;
    private htmlToolsOutputGeneral: HTMLElement;
    private htmlToolsApplyThis: HTMLInputElement;
    private htmlToolsApplyAll: HTMLInputElement;

    constructor() {
        this.htmlToolsSelectMode = document.querySelectorAll('.tools__select-mode');
        this.htmlToolsSelectDifficulty = document.querySelectorAll(
            '.tools__select-difficulty'
        );
        this.htmlToolsDifficultyLabel =
            document.querySelectorAll('.difficulty__label')!;
        this.htmlToolsNote = document.querySelector('.tools__note-content')!;
        this.htmlToolsObstacle = document.querySelector('.tools__obstacle-content')!;
        this.htmlToolsEvent = document.querySelector('.tools__event-content')!;
        this.htmlToolsOther = document.querySelector('.tools__other-content')!;
        this.htmlToolsOutputDifficulty = document.querySelector('.tools__output-diff')!;
        this.htmlToolsOutputGeneral = document.querySelector('.tools__output-general')!;
        this.htmlToolsApplyThis = document.querySelector('.tools__apply-this')!;
        this.htmlToolsApplyAll = document.querySelector('.tools__apply-all')!;

        if (
            !this.htmlToolsNote ||
            !this.htmlToolsObstacle ||
            !this.htmlToolsEvent ||
            !this.htmlToolsOther
        ) {
            console.error(logPrefix + 'missing content element');
        }
        if (!this.htmlToolsOutputDifficulty || !this.htmlToolsOutputGeneral) {
            console.error(logPrefix + 'missing output element');
        }
        if (this.htmlToolsApplyThis && this.htmlToolsApplyAll) {
            this.htmlToolsApplyThis.addEventListener('click', this.applyThisHandler);
            this.htmlToolsApplyAll.addEventListener('click', this.applyAllHandler);
        } else {
            console.error(logPrefix + 'missing apply element');
        }

        this.htmlToolsSelectMode.forEach((elem) =>
            elem.addEventListener('change', this.selectModeHandler)
        );
        this.htmlToolsSelectDifficulty.forEach((elem) =>
            elem.addEventListener('change', this.selectDifficultyHandler)
        );
    }
    displayOutputGeneral = (): void => {
        const analysis = savedData.analysis?.general;
        if (!analysis) {
            this.htmlToolsOutputGeneral.textContent =
                'ERROR: could not find analysis for general';
            return;
        }
        if (!analysis.html) {
            this.htmlToolsOutputGeneral.textContent =
                'ERROR: could not find HTML for general';
            return;
        }
        this.htmlToolsOutputGeneral.innerHTML = '';
        analysis.html.forEach((h) => this.htmlToolsOutputGeneral.appendChild(h));
        if (!this.htmlToolsOutputGeneral.firstChild) {
            this.htmlToolsOutputGeneral.textContent = 'No issues found.';
        }
    };

    displayOutputDifficulty = (
        mode?: CharacteristicName,
        difficulty?: DifficultyName
    ): void => {
        if (!mode && !difficulty) {
            mode = this.htmlToolsSelectMode[0].value as CharacteristicName;
            difficulty = this.htmlToolsSelectDifficulty[0].value as DifficultyName;
        }
        if (!mode || !difficulty) {
            throw new Error(logPrefix + 'something went wrong!');
        }
        this.htmlToolsOutputDifficulty.innerHTML = '';
        const analysis = savedData.analysis?.map.find(
            (set) => set.difficulty === difficulty && set.mode === mode
        );
        if (!analysis) {
            this.htmlToolsOutputDifficulty.textContent =
                'ERROR: could not find analysis for ' + mode + ' ' + difficulty;
            return;
        }
        if (!analysis.html) {
            this.htmlToolsOutputDifficulty.textContent =
                'ERROR: could not find HTML for ' + mode + ' ' + difficulty;
            return;
        }
        analysis.html.forEach((h) => this.htmlToolsOutputDifficulty.appendChild(h));
        if (!this.htmlToolsOutputDifficulty.firstChild) {
            this.htmlToolsOutputDifficulty.textContent = 'No issues found.';
        }
    };

    setDifficultyLabel = (str: string): void => {
        this.htmlToolsDifficultyLabel.forEach((elem) => (elem.textContent = str));
    };

    private populateSelectDiff = (mapSet?: IInfoSetData): void => {
        if (!mapSet) {
            return;
        }
        this.htmlToolsSelectDifficulty.forEach((elem) => {
            for (let i = elem.options.length - 1; i >= 0; i--) {
                elem.remove(i);
            }
        });
        let first = true;
        mapSet._difficultyBeatmaps.forEach((diff) => {
            this.htmlToolsSelectDifficulty.forEach((elem) => {
                const optDiff = document.createElement('option');
                optDiff.value = diff._difficulty;
                optDiff.textContent =
                    DifficultyRename[diff._difficulty] +
                    (diff._customData?._difficultyLabel
                        ? ' -- ' + diff._customData?._difficultyLabel
                        : '');
                if (first) {
                    const diffData = savedData.beatmapDifficulty?.find(
                        (el) =>
                            el.difficulty === diff._difficulty &&
                            el.characteristic === mapSet._beatmapCharacteristicName
                    );
                    if (!diffData) {
                        throw new Error('missing _mapSetData');
                    }
                    uiInformation.setDiffInfoTable(diffData);
                    this.setDifficultyLabel(
                        diff._customData?._difficultyLabel ||
                            DifficultyRename[diff._difficulty]
                    );
                    this.displayOutputDifficulty(
                        mapSet._beatmapCharacteristicName,
                        diff._difficulty
                    );
                }
                first = false;
                elem.add(optDiff);
            });
        });
    };

    populateSelect = (mapInfo?: IInfoData): void => {
        if (!mapInfo) {
            this.htmlToolsSelectMode.forEach((elem) => removeOptions(elem));
            this.htmlToolsSelectDifficulty.forEach((elem) => removeOptions(elem));
            return;
        }
        let first = true;
        mapInfo._difficultyBeatmapSets.forEach((mode) => {
            this.htmlToolsSelectMode.forEach((elem) => {
                const optMode = document.createElement('option');
                optMode.value = mode._beatmapCharacteristicName;
                optMode.textContent =
                    CharacteristicRename[mode._beatmapCharacteristicName];
                elem.add(optMode);
            });
            if (first) {
                this.populateSelectDiff(mode);
            }
            first = false;
        });
    };

    adjustTime = (): void => {
        const mapInfo = savedData.beatmapInfo;
        if (!mapInfo) {
            throw new Error(logPrefix + 'could not find map info');
        }
        const bpm = beatmap.BeatPerMinute.create(mapInfo._beatsPerMinute);
        analyse.adjustTime(bpm);
    };

    private selectModeHandler(ev: Event): void {
        const target = ev.target as HTMLSelectElement;
        this.htmlToolsSelectMode.forEach((elem) => {
            if (elem !== target) {
                elem.value = target.value;
            }
        });
        const mode = savedData.beatmapInfo?._difficultyBeatmapSets.find(
            (elem) => elem._beatmapCharacteristicName === target.value
        );
        this.populateSelectDiff(mode);
    }

    private selectDifficultyHandler(ev: Event): void {
        const target = ev.target as HTMLSelectElement;
        this.htmlToolsSelectDifficulty.forEach((elem) => {
            if (elem !== target) {
                elem.value = target.value;
            }
        });
        const mode = savedData.beatmapInfo?._difficultyBeatmapSets.find(
            (elem) =>
                elem._beatmapCharacteristicName ===
                this.htmlToolsSelectMode.item(0).value
        );
        if (!mode) {
            throw new Error('aaaaaaaaaaaaaaaaaaa');
        }
        const diff = savedData.beatmapDifficulty?.find(
            (elem) =>
                elem.difficulty === target.value &&
                elem.characteristic === mode._beatmapCharacteristicName
        );
        if (diff) {
            uiInformation.setDiffInfoTable(diff);
            this.setDifficultyLabel(
                diff.info?._customData?._difficultyLabel ||
                    DifficultyRename[target.value as keyof typeof DifficultyRename]
            );
            this.displayOutputDifficulty(diff.characteristic, diff.difficulty);
        }
    }

    private applyThisHandler(): void {
        const mode = this.htmlToolsSelectMode[0].value as CharacteristicName;
        const difficulty = this.htmlToolsSelectDifficulty[0].value as DifficultyName;
        if (!mode || !difficulty) {
            throw new Error(logPrefix + 'mode/difficulty does not exist');
        }
        uiLoading.status('info', `Re-analysing ${mode} ${difficulty}`, 100);
        analyse.difficulty(mode, difficulty);
        uiLoading.status('info', `Re-analysed ${mode} ${difficulty}`, 100);
        this.displayOutputDifficulty(mode, difficulty);
    }

    private applyAllHandler(): void {
        const mode = this.htmlToolsSelectMode[0].value as CharacteristicName;
        const difficulty = this.htmlToolsSelectDifficulty[0].value as DifficultyName;
        if (!mode || !difficulty) {
            throw new Error(logPrefix + 'mode/difficulty does not exist');
        }
        uiLoading.status('info', `Re-analysing all difficulties`, 100);
        analyse.all();
        uiLoading.status('info', `Re-analysed all difficulties`, 100);
        this.displayOutputDifficulty(mode, difficulty);
    }

    populateTool = (): void => {
        const toolList = tools.component
            .getAll()
            .sort((a, b) => a.order.input - b.order.input);
        toolList.forEach((tl) => {
            if (tl.input.html) {
                switch (tl.type) {
                    case 'note': {
                        this.htmlToolsNote.appendChild(tl.input.html);
                        break;
                    }
                    case 'obstacle': {
                        this.htmlToolsObstacle.appendChild(tl.input.html);
                        break;
                    }
                    case 'event': {
                        this.htmlToolsEvent.appendChild(tl.input.html);
                        break;
                    }
                    case 'other': {
                        this.htmlToolsOther.appendChild(tl.input.html);
                        break;
                    }
                    case 'general': {
                        console.log(logPrefix + 'ignoring general tool for ' + tl.name);
                        break;
                    }
                    default: {
                        console.error(
                            logPrefix +
                                'could not recognise type ' +
                                tl.type +
                                ' for ' +
                                tl.name
                        );
                    }
                }
            }
        });
    };

    private clearOutput = (): void => {
        if (this.htmlToolsOutputGeneral) {
            this.htmlToolsOutputGeneral.innerHTML = 'No output.';
        }
        if (this.htmlToolsOutputDifficulty) {
            this.htmlToolsOutputDifficulty.innerHTML = 'No output.';
        }
    };

    reset = (): void => {
        this.clearOutput();
        this.setDifficultyLabel('Difficulty Label');
        this.populateSelect();
    };
})();
