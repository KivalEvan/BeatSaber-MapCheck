import { DifficultyRename } from '../beatmap/difficulty';
import { BeatmapInfo, BeatmapSet } from '../beatmap/info';
import savedData from '../savedData';
import { setDiffInfoTable } from './info';

const htmlToolsSelectMode = document.querySelectorAll<HTMLSelectElement>('.tools__select-mode');
const htmlToolsSelectDifficulty = document.querySelectorAll<HTMLSelectElement>(
    '.tools__select-difficulty'
);
const htmlToolsDifficultyLabel = document.querySelectorAll<HTMLElement>('.difficulty__label');

htmlToolsSelectMode.forEach((elem) => elem.addEventListener('change', selectModeHandler));
htmlToolsSelectDifficulty.forEach((elem) =>
    elem.addEventListener('change', selectDifficultyHandler)
);

export const displayOutput = (): void => {};

export const setDifficultyLabel = (str: string): void => {
    htmlToolsDifficultyLabel.forEach((elem) => (elem.textContent = str));
};

const populateSelectDiff = (mapSet: BeatmapSet | undefined): void => {
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
            optDiff.text =
                DifficultyRename[diff._difficulty] +
                (diff._customData?._difficultyLabel
                    ? ' -- ' + diff._customData?._difficultyLabel
                    : '');
            if (first) {
                const diffData = savedData._mapData?.find(
                    (el) =>
                        el._difficulty === diff._difficulty &&
                        el._mode === mapSet._beatmapCharacteristicName
                );
                if (!diffData) {
                    throw new Error('Missing _mapData');
                }
                setDiffInfoTable(diffData);
                setDifficultyLabel(diff._customData?._difficultyLabel || diff._difficulty);
            }
            first = false;
            elem.add(optDiff);
        });
    });
};

export const populateSelect = (mapInfo: BeatmapInfo): void => {
    let first = true;
    mapInfo._difficultyBeatmapSets.forEach((mode) => {
        htmlToolsSelectMode.forEach((elem) => {
            const optMode = document.createElement('option');
            optMode.value = mode._beatmapCharacteristicName;
            optMode.text = mode._beatmapCharacteristicName;
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
    const diff = savedData._mapData?.find(
        (elem) =>
            elem._difficulty === target.value && elem._mode === mode._beatmapCharacteristicName
    );
    if (diff) {
        setDiffInfoTable(diff);
        setDifficultyLabel(diff._info?._customData?._difficultyLabel || target.value);
    }
}

export default {
    displayOutput,
    populateSelect,
};
