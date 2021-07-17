import { round, toMMSS } from '../utils';
import { Contributor } from '../beatmap/contributor';
import { EnvironmentName } from '../beatmap/environment';
import { BeatmapInfo } from '../beatmap/info';

const htmlCoverLink = document.querySelectorAll<HTMLLinkElement>('.cover__link');
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

export const updateCoverLink = (url?: string, id?: string): void => {
    if (url == null && id == null) {
        htmlCoverLink.forEach((elem) => {
            elem.textContent = '';
            elem.href = '';
            elem.classList.add('disabled');
        });
        return;
    }
    if (url !== null) {
        htmlCoverLink.forEach((elem) => {
            elem.textContent = id ?? 'Download Link';
            elem.href = url;
            elem.classList.add('disabled');
        });
    }
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

// TODO: some way to save bpm change
export const updateSongBPM = (num: number, minBPM?: number, maxBPM?: number): void => {
    if ((minBPM === null || minBPM === undefined) && typeof maxBPM === 'number') {
        minBPM = Math.min(num, maxBPM);
    }
    if ((maxBPM === null || maxBPM === undefined) && typeof minBPM === 'number') {
        maxBPM = Math.max(num, minBPM);
    }
    let text = round(num, 2).toString();
    if (minBPM && maxBPM) {
    }
    htmlMetadataSongBPM.forEach((elem) => (elem.textContent = text));
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

export default {
    updateCoverImage,
    updateCoverLink,
    updateSongName,
    updateSongSubname,
    updateSongAuthor,
    updateSongBPM,
    updateSongDuration,
    updateLevelAuthor,
    updateEnvironment,
    updateContributors,
    updateTimeSpend,
    updateInfo,
};
