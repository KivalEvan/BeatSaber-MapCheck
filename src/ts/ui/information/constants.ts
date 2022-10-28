export const logPrefix = 'UI Info: ';

export const htmlTableVersion: HTMLElement = document.querySelector('.info__version')!;
export const htmlTablePlayTime: HTMLElement = document.querySelector('.info__play-time')!;
export const htmlTableTimeSpend: HTMLElement = document.querySelector('.info__time-spend')!;
export const htmlTableCustomColor: HTMLElement = document.querySelector('.info__custom-color')!;
export const htmlTableRequirements: HTMLElement = document.querySelector('.info__requirements')!;
export const htmlTableSuggestions: HTMLElement = document.querySelector('.info__suggestions')!;
export const htmlTableInformation: HTMLElement = document.querySelector('.info__information')!;
export const htmlTableWarnings: HTMLElement = document.querySelector('.info__warnings')!;
export const htmlTableBookmarks: HTMLElement = document.querySelector('.info__bookmarks')!;
export const htmlTableBPMChanges: HTMLElement = document.querySelector('.info__bpm-changes')!;
export const htmlTableEnvironmentEnhancement: HTMLElement = document.querySelector('.info__environment-enhancement')!;
export const htmlTablePointDefinitions: HTMLElement = document.querySelector('.info__point-definitions')!;
export const htmlTableCustomEvents: HTMLElement = document.querySelector('.info__custom-events')!;
export const htmlTableElements: NodeListOf<HTMLElement> = document.querySelectorAll('.info__table-element')!;

if (
    !htmlTableVersion ||
    !htmlTablePlayTime ||
    !htmlTableTimeSpend ||
    !htmlTableCustomColor ||
    !htmlTableRequirements ||
    !htmlTableSuggestions ||
    !htmlTableInformation ||
    !htmlTableWarnings ||
    !htmlTableBookmarks ||
    !htmlTableBPMChanges ||
    !htmlTableEnvironmentEnhancement ||
    !htmlTablePointDefinitions ||
    !htmlTableCustomEvents ||
    !htmlTableElements
) {
    throw new Error(logPrefix + 'table info component is missing part');
}
