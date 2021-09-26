import * as beatmap from '../beatmap';
import savedData from '../savedData';
import * as tools from '../tools';
import * as analyse from '../tools/analyse';
import * as uiLoading from './loading';
import { removeOptions } from '../utils';
import { setDiffInfoTable } from './info';

const logPrefix = 'UI Tools: ';

const htmlToolsSelectMode = document.querySelectorAll<HTMLSelectElement>('.tools__select-mode');
const htmlToolsSelectDifficulty = document.querySelectorAll<HTMLSelectElement>(
    '.tools__select-difficulty'
);
const htmlToolsDifficultyLabel = document.querySelectorAll<HTMLElement>('.difficulty__label');
const htmlToolsNote = document.querySelector<HTMLElement>('.tools__note-content');
const htmlToolsObstacle = document.querySelector<HTMLElement>('.tools__obstacle-content');
const htmlToolsEvent = document.querySelector<HTMLElement>('.tools__event-content');
const htmlToolsOther = document.querySelector<HTMLElement>('.tools__other-content');
const htmlToolsOutputDifficulty = document.querySelector<HTMLElement>('.tools__output-diff');
const htmlToolsOutputGeneral = document.querySelector<HTMLElement>('.tools__output-general');
const htmlToolsApplyThis = document.querySelector<HTMLInputElement>('.tools__apply-this');
const htmlToolsApplyAll = document.querySelector<HTMLInputElement>('.tools__apply-all');

if (!htmlToolsNote || !htmlToolsObstacle || !htmlToolsEvent || !htmlToolsOther) {
    console.error(logPrefix + 'missing content element');
}
if (!htmlToolsOutputDifficulty || !htmlToolsOutputGeneral) {
    console.error(logPrefix + 'missing output element');
}
if (htmlToolsApplyThis && htmlToolsApplyAll) {
    htmlToolsApplyThis.addEventListener('click', applyThisHandler);
    htmlToolsApplyAll.addEventListener('click', applyAllHandler);
} else {
    console.error(logPrefix + 'missing apply element');
}

htmlToolsSelectMode.forEach((elem) => elem.addEventListener('change', selectModeHandler));
htmlToolsSelectDifficulty.forEach((elem) =>
    elem.addEventListener('change', selectDifficultyHandler)
);

export const displayOutputGeneral = (): void => {
    if (!htmlToolsOutputGeneral) {
        throw new Error(logPrefix + 'output general is missing');
    }
    const analysis = savedData._analysis?.general;
    if (!analysis) {
        htmlToolsOutputGeneral.textContent = 'ERROR: could not find analysis for general';
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

export const displayOutputDifficulty = (
    mode?: beatmap.characteristic.CharacteristicName,
    difficulty?: beatmap.difficulty.DifficultyName
): void => {
    if (!mode && !difficulty) {
        mode = htmlToolsSelectMode[0].value as beatmap.characteristic.CharacteristicName;
        difficulty = htmlToolsSelectDifficulty[0].value as beatmap.difficulty.DifficultyName;
    }
    if (!mode || !difficulty) {
        throw new Error(logPrefix + 'something went wrong!');
    }
    if (!htmlToolsOutputDifficulty) {
        throw new Error(logPrefix + 'output difficulty is missing');
    }
    htmlToolsOutputDifficulty.innerHTML = '';
    const analysis = savedData._analysis?.mapSet.find(
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

export const setDifficultyLabel = (str: string): void => {
    htmlToolsDifficultyLabel.forEach((elem) => (elem.textContent = str));
};

const populateSelectDiff = (mapSet?: beatmap.info.BeatmapInfoSet): void => {
    if (!mapSet) {
        return;
    }
    htmlToolsSelectDifficulty.forEach((elem) => {
        for (let i = elem.options.length - 1; i >= 0; i--) {
            elem.remove(i);
        }
    });
    let first = true;
    mapSet._difficultyBeatmaps.forEach((diff) => {
        htmlToolsSelectDifficulty.forEach((elem) => {
            const optDiff = document.createElement('option');
            optDiff.value = diff._difficulty;
            optDiff.textContent =
                beatmap.difficulty.DifficultyRename[diff._difficulty] +
                (diff._customData?._difficultyLabel
                    ? ' -- ' + diff._customData?._difficultyLabel
                    : '');
            if (first) {
                const diffData = savedData._mapSet?.find(
                    (el) =>
                        el._difficulty === diff._difficulty &&
                        el._mode === mapSet._beatmapCharacteristicName
                );
                if (!diffData) {
                    throw new Error('missing _mapSetData');
                }
                setDiffInfoTable(diffData);
                setDifficultyLabel(
                    diff._customData?._difficultyLabel ||
                        beatmap.difficulty.DifficultyRename[diff._difficulty]
                );
                displayOutputDifficulty(mapSet._beatmapCharacteristicName, diff._difficulty);
            }
            first = false;
            elem.add(optDiff);
        });
    });
};

export const populateSelect = (mapInfo?: beatmap.info.BeatmapInfo): void => {
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
            optMode.textContent =
                beatmap.characteristic.CharacteristicRename[mode._beatmapCharacteristicName];
            elem.add(optMode);
        });
        if (first) {
            populateSelectDiff(mode);
        }
        first = false;
    });
};

export const adjustTime = (): void => {
    const mapInfo = savedData._mapInfo;
    if (!mapInfo) {
        throw new Error(logPrefix + 'could not find map info');
    }
    const bpm = beatmap.bpm.create(mapInfo._beatsPerMinute);
    analyse.adjustTime(bpm);
};

function selectModeHandler(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    htmlToolsSelectMode.forEach((elem) => {
        if (elem !== target) {
            elem.value = target.value;
        }
    });
    const mode = savedData._mapInfo?._difficultyBeatmapSets.find(
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
    const mode = savedData._mapInfo?._difficultyBeatmapSets.find(
        (elem) => elem._beatmapCharacteristicName === htmlToolsSelectMode.item(0).value
    );
    if (!mode) {
        throw new Error('aaaaaaaaaaaaaaaaaaa');
    }
    const diff = savedData._mapSet?.find(
        (elem) =>
            elem._difficulty === target.value && elem._mode === mode._beatmapCharacteristicName
    );
    if (diff) {
        setDiffInfoTable(diff);
        setDifficultyLabel(
            diff._info?._customData?._difficultyLabel ||
                beatmap.difficulty.DifficultyRename[
                    target.value as keyof typeof beatmap.difficulty.DifficultyRename
                ]
        );
        displayOutputDifficulty(diff._mode, diff._difficulty);
    }
}

function applyThisHandler(): void {
    const mode = htmlToolsSelectMode[0].value as beatmap.characteristic.CharacteristicName;
    const difficulty = htmlToolsSelectDifficulty[0].value as beatmap.difficulty.DifficultyName;
    if (!mode || !difficulty) {
        throw new Error(logPrefix + 'mode/difficulty does not exist');
    }
    uiLoading.status('info', `Re-analysing ${mode} ${difficulty}`, 100);
    analyse.difficulty(mode, difficulty);
    uiLoading.status('info', `Re-analysed ${mode} ${difficulty}`, 100);
    displayOutputDifficulty(mode, difficulty);
}

function applyAllHandler(): void {
    const mode = htmlToolsSelectMode[0].value as beatmap.characteristic.CharacteristicName;
    const difficulty = htmlToolsSelectDifficulty[0].value as beatmap.difficulty.DifficultyName;
    if (!mode || !difficulty) {
        throw new Error(logPrefix + 'mode/difficulty does not exist');
    }
    uiLoading.status('info', `Re-analysing all difficulties`, 100);
    analyse.all();
    uiLoading.status('info', `Re-analysed all difficulties`, 100);
    displayOutputDifficulty(mode, difficulty);
}

export const populateTool = (): void => {
    if (!htmlToolsNote || !htmlToolsObstacle || !htmlToolsEvent || !htmlToolsOther) {
        console.error(logPrefix + 'could not find tools content');
        return;
    }
    const toolList = tools.component.getAll().sort((a, b) => a.order.input - b.order.input);
    toolList.forEach((tl) => {
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
                        logPrefix + 'could not recognise type ' + tl.type + ' for ' + tl.name
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

export const reset = (): void => {
    clearOutput();
    setDifficultyLabel('Difficulty Label');
    populateSelect();
};
