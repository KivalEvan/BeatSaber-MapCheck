import { BeatmapInfo } from '../beatmap/info';

const htmlToolsSelectMode = document.querySelectorAll<HTMLInputElement>('.tools__select-mode');
const htmlToolsSelectDifficulty = document.querySelectorAll<HTMLInputElement>(
    '.tools__select-difficulty'
);

export const displayOutput = (mode: string, difficulty: string): void => {};

export const populateSelectMode = (mapInfo: BeatmapInfo): void => {};

export default {
    displayOutput,
    populateSelectMode,
};
