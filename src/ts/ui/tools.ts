import * as beatmap from '../beatmap';
import SavedData from '../savedData';
import Analyser from '../tools/analyzer';
import UILoading from './loading';
import UIInformation from './information';
import { removeOptions } from '../utils';
import { DifficultyRename, CharacteristicRename } from '../beatmap/shared';
import { CharacteristicName, DifficultyName, IInfoData, IInfoSetData } from '../types';

const logPrefix = 'UI Tools: ';

const htmlToolsSelectMode: NodeListOf<HTMLSelectElement> =
    document.querySelectorAll('.tools__select-mode');
const htmlToolsSelectDifficulty: NodeListOf<HTMLSelectElement> =
    document.querySelectorAll('.tools__select-difficulty');
const htmlToolsDifficultyLabel: NodeListOf<HTMLElement> =
    document.querySelectorAll('.difficulty__label');
const htmlToolsNote: HTMLElement = document.querySelector('.tools__note-content')!;
const htmlToolsObstacle: HTMLElement = document.querySelector(
    '.tools__obstacle-content'
)!;
const htmlToolsEvent: HTMLElement = document.querySelector('.tools__event-content')!;
const htmlToolsOther: HTMLElement = document.querySelector('.tools__other-content')!;
const htmlToolsOutputDifficulty: HTMLElement =
    document.querySelector('.tools__output-diff')!;
const htmlToolsOutputGeneral: HTMLElement = document.querySelector(
    '.tools__output-general'
)!;
const htmlToolsApplyThis: HTMLInputElement =
    document.querySelector('.tools__apply-this')!;
const htmlToolsApplyAll: HTMLInputElement =
    document.querySelector('.tools__apply-all')!;

if (!htmlToolsNote || !htmlToolsObstacle || !htmlToolsEvent || !htmlToolsOther) {
    throw new Error(logPrefix + 'missing content element');
}
if (!htmlToolsOutputDifficulty || !htmlToolsOutputGeneral) {
    throw new Error(logPrefix + 'missing output element');
}
if (htmlToolsApplyThis && htmlToolsApplyAll) {
    htmlToolsApplyThis.addEventListener('click', applyThisHandler);
    htmlToolsApplyAll.addEventListener('click', applyAllHandler);
} else {
    throw new Error(logPrefix + 'missing apply element');
}

htmlToolsSelectMode.forEach((elem) =>
    elem.addEventListener('change', selectModeHandler)
);
htmlToolsSelectDifficulty.forEach((elem) =>
    elem.addEventListener('change', selectDifficultyHandler)
);

const displayOutputGeneral = (): void => {
    const analysis = SavedData.analysis?.general;
    if (!analysis) {
        htmlToolsOutputGeneral.textContent =
            'ERROR: could not find analysis for general';
        return;
    }
    if (!analysis.html) {
        htmlToolsOutputGeneral.textContent = 'ERROR: could not find HTML for general';
        return;
    }
    htmlToolsOutputGeneral.innerHTML = '';
    analysis.html.forEach((h) => htmlToolsOutputGeneral.appendChild(h));
    if (!htmlToolsOutputGeneral.firstChild) {
        htmlToolsOutputGeneral.textContent = 'No issues found.';
    }
};

const displayOutputDifficulty = (
    mode?: CharacteristicName,
    difficulty?: DifficultyName
): void => {
    if (!mode && !difficulty) {
        mode = htmlToolsSelectMode[0].value as CharacteristicName;
        difficulty = htmlToolsSelectDifficulty[0].value as DifficultyName;
    }
    if (!mode || !difficulty) {
        throw new Error(logPrefix + 'something went wrong!');
    }
    htmlToolsOutputDifficulty.innerHTML = '';
    const analysis = SavedData.analysis?.map.find(
        (set) => set.difficulty === difficulty && set.mode === mode
    );
    if (!analysis) {
        htmlToolsOutputDifficulty.textContent =
            'ERROR: could not find analysis for ' + mode + ' ' + difficulty;
        return;
    }
    if (!analysis.html) {
        htmlToolsOutputDifficulty.textContent =
            'ERROR: could not find HTML for ' + mode + ' ' + difficulty;
        return;
    }
    analysis.html.forEach((h) => htmlToolsOutputDifficulty.appendChild(h));
    if (!htmlToolsOutputDifficulty.firstChild) {
        htmlToolsOutputDifficulty.textContent = 'No issues found.';
    }
};

const setDifficultyLabel = (str: string): void => {
    htmlToolsDifficultyLabel.forEach((elem) => (elem.textContent = str));
};

const populateSelectDiff = (mapSet?: IInfoSetData): void => {
    if (!mapSet) {
        return;
    }
    htmlToolsSelectDifficulty.forEach((elem) => {
        for (let i = elem.options.length - 1; i >= 0; i--) {
            elem.remove(i);
        }
    });
    let first = true;
    for (let i = mapSet._difficultyBeatmaps.length - 1; i >= 0; i--) {
        const diff = mapSet._difficultyBeatmaps[i];
        htmlToolsSelectDifficulty.forEach((elem) => {
            const optDiff = document.createElement('option');
            optDiff.value = diff._difficulty;
            optDiff.textContent =
                DifficultyRename[diff._difficulty] +
                (diff._customData?._difficultyLabel
                    ? ' -- ' + diff._customData?._difficultyLabel
                    : '');
            if (first) {
                const diffData = SavedData.beatmapDifficulty?.find(
                    (el) =>
                        el.difficulty === diff._difficulty &&
                        el.characteristic === mapSet._beatmapCharacteristicName
                );
                if (!diffData) {
                    throw new Error('missing _mapSetData');
                }
                UIInformation.setDiffInfoTable(diffData);
                setDifficultyLabel(
                    diff._customData?._difficultyLabel ||
                        DifficultyRename[diff._difficulty]
                );
                displayOutputDifficulty(
                    mapSet._beatmapCharacteristicName,
                    diff._difficulty
                );
            }
            first = false;
            elem.add(optDiff);
        });
    }
};

const populateSelect = (mapInfo?: IInfoData): void => {
    if (!mapInfo) {
        htmlToolsSelectMode.forEach((elem) => removeOptions(elem));
        htmlToolsSelectDifficulty.forEach((elem) => removeOptions(elem));
        return;
    }
    let first = true;
    mapInfo._difficultyBeatmapSets.forEach((mode) => {
        htmlToolsSelectMode.forEach((elem) => {
            const optMode = document.createElement('option');
            optMode.value = mode._beatmapCharacteristicName;
            optMode.textContent = CharacteristicRename[mode._beatmapCharacteristicName];
            elem.add(optMode);
        });
        if (first) {
            populateSelectDiff(mode);
        }
        first = false;
    });
};

const adjustTime = (): void => {
    const mapInfo = SavedData.beatmapInfo;
    if (!mapInfo) {
        throw new Error(logPrefix + 'could not find map info');
    }
    const bpm = beatmap.BeatPerMinute.create(mapInfo._beatsPerMinute);
    Analyser.adjustTime(bpm);
};

const populateTool = (): void => {
    Analyser.toolListInput.forEach((tl) => {
        if (tl.input.html) {
            switch (tl.type) {
                case 'note': {
                    htmlToolsNote.appendChild(tl.input.html);
                    break;
                }
                case 'obstacle': {
                    htmlToolsObstacle.appendChild(tl.input.html);
                    break;
                }
                case 'event': {
                    htmlToolsEvent.appendChild(tl.input.html);
                    break;
                }
                case 'other': {
                    htmlToolsOther.appendChild(tl.input.html);
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

const clearOutput = (): void => {
    if (htmlToolsOutputGeneral) {
        htmlToolsOutputGeneral.innerHTML = 'No output.';
    }
    if (htmlToolsOutputDifficulty) {
        htmlToolsOutputDifficulty.innerHTML = 'No output.';
    }
};

const reset = (): void => {
    clearOutput();
    setDifficultyLabel('Difficulty Label');
    populateSelect();
};

function selectModeHandler(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    htmlToolsSelectMode.forEach((elem) => {
        if (elem !== target) {
            elem.value = target.value;
        }
    });
    const mode = SavedData.beatmapInfo?._difficultyBeatmapSets.find(
        (elem) => elem._beatmapCharacteristicName === target.value
    );
    populateSelectDiff(mode);
}

function selectDifficultyHandler(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    htmlToolsSelectDifficulty.forEach((elem) => {
        if (elem !== target) {
            elem.value = target.value;
        }
    });
    const mode = SavedData.beatmapInfo?._difficultyBeatmapSets.find(
        (elem) => elem._beatmapCharacteristicName === htmlToolsSelectMode.item(0).value
    );
    if (!mode) {
        throw new Error('aaaaaaaaaaaaaaaaaaa');
    }
    const diff = SavedData.beatmapDifficulty?.find(
        (elem) =>
            elem.difficulty === target.value &&
            elem.characteristic === mode._beatmapCharacteristicName
    );
    if (diff) {
        UIInformation.setDiffInfoTable(diff);
        setDifficultyLabel(
            diff.info?._customData?._difficultyLabel ||
                DifficultyRename[target.value as keyof typeof DifficultyRename]
        );
        displayOutputDifficulty(diff.characteristic, diff.difficulty);
    }
}

function applyThisHandler(): void {
    const mode = htmlToolsSelectMode[0].value as CharacteristicName;
    const difficulty = htmlToolsSelectDifficulty[0].value as DifficultyName;
    if (!mode || !difficulty) {
        throw new Error(logPrefix + 'mode/difficulty does not exist');
    }
    UILoading.status('info', `Re-analysing ${mode} ${difficulty}`, 100);
    Analyser.runDifficulty(mode, difficulty);
    UILoading.status('info', `Re-analysed ${mode} ${difficulty}`, 100);
    displayOutputDifficulty(mode, difficulty);
}

function applyAllHandler(): void {
    const mode = htmlToolsSelectMode[0].value as CharacteristicName;
    const difficulty = htmlToolsSelectDifficulty[0].value as DifficultyName;
    if (!mode || !difficulty) {
        throw new Error(logPrefix + 'mode/difficulty does not exist');
    }
    UILoading.status('info', `Re-analysing all difficulties`, 100);
    Analyser.applyAll();
    UILoading.status('info', `Re-analysed all difficulties`, 100);
    displayOutputDifficulty(mode, difficulty);
}

export default {
    displayOutputGeneral,
    displayOutputDifficulty,
    setDifficultyLabel,
    adjustTime,
    populateSelect,
    populateTool,
    reset,
};
