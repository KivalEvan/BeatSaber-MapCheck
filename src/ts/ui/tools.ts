import * as beatmap from '../beatmap';
import savedData from '../savedData';
import * as tools from '../tools';
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

if (!htmlToolsNote || !htmlToolsObstacle || !htmlToolsEvent || !htmlToolsOther) {
    console.error(logPrefix + 'missing content element');
}
if (!htmlToolsOutputDifficulty || !htmlToolsOutputGeneral) {
    console.error(logPrefix + 'missing output element');
}

htmlToolsSelectMode.forEach((elem) => elem.addEventListener('change', selectModeHandler));
htmlToolsSelectDifficulty.forEach((elem) =>
    elem.addEventListener('change', selectDifficultyHandler)
);

export const displayOutputGeneral = (): void => {
    if (!htmlToolsOutputGeneral) {
        throw new Error(logPrefix + 'output general is missing');
    }
    htmlToolsOutputGeneral.innerHTML = 'Nothing to display';
};

export const displayOutputDifficulty = (
    mode?: beatmap.characteristic.CharacteristicName,
    diff?: beatmap.difficulty.DifficultyName
): void => {
    if (!mode && !diff) {
        mode = htmlToolsSelectMode[0].value as beatmap.characteristic.CharacteristicName;
        diff = htmlToolsSelectDifficulty[0].value as beatmap.difficulty.DifficultyName;
    }
    if (!mode || !diff) {
        throw new Error('something went wrong!');
    }
    if (!htmlToolsOutputDifficulty) {
        throw new Error(logPrefix + 'output difficulty is missing');
    }
    htmlToolsOutputDifficulty.innerHTML = 'Nothing to display';
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
    }
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

export const reset = (): void => {
    setDifficultyLabel('Difficulty Label');
    populateSelect();
};
