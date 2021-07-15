import { round, toMMSS } from '../utils';
import { Contributor } from '../beatmap/contributor';
import { EnvironmentName } from '../beatmap/environment';
import { BeatmapInfo } from '../beatmap/info';

const htmlCoverImage = document.querySelectorAll<HTMLImageElement>('.cover__image');
const htmlMetadataSongName = document.querySelectorAll<HTMLElement>('.metadata__song-name');
const htmlMetadataSongSubname = document.querySelectorAll<HTMLElement>('.metadata__song-subname');
const htmlMetadataSongAuthor = document.querySelectorAll<HTMLElement>('.metadata__song-author');
const htmlMetadataSongBPM = document.querySelectorAll<HTMLElement>('.metadata__song-bpm');
const htmlMetadataSongDuration = document.querySelectorAll<HTMLElement>('.metadata__song-duration');
const htmlInfoLevelAuthor = document.querySelectorAll<HTMLElement>('.info__level-author');
const htmlInfoEnvironment = document.querySelectorAll<HTMLElement>('.info__environment');
const htmlInfoContributors = document.querySelectorAll<HTMLElement>('.info__contributors');
const htmlInfoTimeSpend = document.querySelectorAll<HTMLElement>('.info__time-spend');

export const updateCoverImage = (src: string): void => {
    htmlCoverImage.forEach((elem) => (elem.src = src));
};

export const updateSongName = (str: string): void => {
    htmlMetadataSongName.forEach((elem) => (elem.textContent = str));
};

export const updateSongSubname = (str: string): void => {
    htmlMetadataSongSubname.forEach((elem) => (elem.textContent = str));
};

export const updateSongAuthor = (str: string): void => {
    htmlMetadataSongAuthor.forEach((elem) => (elem.textContent = str));
};

// TODO: add bpm changes
export const updateSongBPM = (num: number): void => {
    htmlMetadataSongBPM.forEach((elem) => (elem.textContent = round(num, 2).toString()));
};

export const updateSongDuration = (num: number): void => {
    htmlMetadataSongDuration.forEach((elem) => (elem.textContent = toMMSS(num)));
};

export const updateLevelAuthor = (str: string): void => {
    htmlInfoLevelAuthor.forEach((elem) => (elem.textContent = 'Mapped by ' + str));
};

export const updateEnvironment = (str: string): void => {
    htmlInfoEnvironment.forEach(
        (elem) => (elem.textContent = (EnvironmentName[str] || 'Unknown') + ' Environment')
    );
};

export const updateContributors = (obj: Contributor): void => {
    htmlInfoContributors.forEach((elem) => (elem.textContent = JSON.stringify(obj)));
};

export const updateTimeSpend = (num: number): void => {
    htmlInfoTimeSpend.forEach((elem) => (elem.textContent = toMMSS(num)));
};

export const updateInfo = (mapInfo: BeatmapInfo): void => {
    updateSongName(mapInfo._songName);
    updateSongSubname(mapInfo._songSubName);
    updateSongAuthor(mapInfo._songAuthorName);
    updateSongBPM(mapInfo._beatsPerMinute);
    updateLevelAuthor(mapInfo._levelAuthorName);
};
