import { round, toMMSS } from '../utils';

const logPrefix = 'UI Header: ';
const mimeCodec = 'audio/ogg';

const htmlIntro = document.querySelector<HTMLElement>('.intro');
const htmlMetadata = document.querySelector<HTMLElement>('.metadata');

const htmlCoverLink = document.querySelector<HTMLLinkElement>('.cover__link');
const htmlCoverImage = document.querySelector<HTMLImageElement>('.cover__image');

const htmlMetadataSongName = document.querySelector<HTMLElement>('.metadata__song-name');
const htmlMetadataSongSubname = document.querySelector<HTMLElement>('.metadata__song-subname');
const htmlMetadataSongAuthor = document.querySelector<HTMLElement>('.metadata__song-author');
const htmlMetadataSongBPM = document.querySelector<HTMLElement>('.metadata__song-bpm');
const htmlMetadataSongDuration = document.querySelector<HTMLElement>('.metadata__song-duration');
const htmlAudio = document.querySelector<HTMLAudioElement>('.audio');
let audioSource: AudioBufferSourceNode;

if (!htmlIntro || !htmlMetadata) {
    console.error(logPrefix + 'header component is missing one of the two section');
}
if (!htmlCoverLink || !htmlCoverImage) {
    console.error(logPrefix + 'cover component is missing');
}
if (
    !htmlMetadataSongName ||
    !htmlMetadataSongSubname ||
    !htmlMetadataSongAuthor ||
    !htmlMetadataSongBPM ||
    !htmlMetadataSongDuration
) {
    console.error(logPrefix + 'metadata component is missing one of the part');
}

export const switchHeader = (bool: boolean): void => {
    if (!htmlIntro || !htmlMetadata) {
        console.error(logPrefix + 'could not switch header, one of the section is missing');
        return;
    }
    bool ? htmlIntro.classList.add('hidden') : htmlIntro.classList.remove('hidden');
    !bool ? htmlMetadata.classList.add('hidden') : htmlMetadata.classList.remove('hidden');
};

export const setCoverImage = (src: string | null): void => {
    if (!htmlCoverImage) {
        console.error(logPrefix + 'missing HTML element for cover image');
        return;
    }
    htmlCoverImage.src = src || './assets/unknown.jpg';
};

export const getCoverImage = (): string | null => {
    if (!htmlCoverImage) {
        console.error(logPrefix + 'missing HTML element for cover image');
        return null;
    }
    return htmlCoverImage.src;
};

export const setCoverLink = (url?: string, id?: string): void => {
    if (!htmlCoverLink) {
        console.error(logPrefix + 'missing HTML element for cover link');
        return;
    }
    if (url == null && id == null) {
        htmlCoverLink.textContent = '';
        htmlCoverLink.href = '';
        htmlCoverLink.classList.add('disabled');
        return;
    }
    if (url != null) {
        htmlCoverLink.textContent = id ?? 'Download Link';
        htmlCoverLink.href = url;
        htmlCoverLink.classList.remove('disabled');
    }
};

export const setSongName = (str: string): void => {
    if (!htmlMetadataSongName) {
        console.error(logPrefix + 'missing HTML element for song name');
        return;
    }
    htmlMetadataSongName.textContent = str;
};

export const setSongSubname = (str: string): void => {
    if (!htmlMetadataSongSubname) {
        console.error(logPrefix + 'missing HTML element for song subname');
        return;
    }
    htmlMetadataSongSubname.textContent = str;
};

export const setSongAuthor = (str: string): void => {
    if (!htmlMetadataSongAuthor) {
        console.error(logPrefix + 'missing HTML element for song author');
        return;
    }
    htmlMetadataSongAuthor.textContent = str;
};

// TODO: some way to save bpm change
export const setSongBPM = (num: number, minBPM?: number, maxBPM?: number): void => {
    if (!htmlMetadataSongBPM) {
        console.error(logPrefix + 'missing HTML element for song bpm');
        return;
    }
    if ((minBPM === null || minBPM === undefined) && typeof maxBPM === 'number') {
        minBPM = Math.min(num, maxBPM);
    }
    if ((maxBPM === null || maxBPM === undefined) && typeof minBPM === 'number') {
        maxBPM = Math.max(num, minBPM);
    }
    let text = round(num, 2).toString() + 'BPM';
    if (minBPM && maxBPM) {
    }
    htmlMetadataSongBPM.textContent = text;
};

export const setSongDuration = (num?: number): void => {
    if (!htmlMetadataSongDuration) {
        console.error(logPrefix + 'missing HTML element for song duration');
        return;
    }
    if (num) {
        htmlMetadataSongDuration.textContent = toMMSS(num);
    } else {
        htmlMetadataSongDuration.textContent = 'No audio';
    }
};

let audioURL: string;
export const setAudio = async (arrayBuffer: ArrayBuffer): Promise<void> => {
    if (!htmlAudio) {
        console.error(logPrefix + 'missing HTML element for audio');
        return;
    }
    const blob = new Blob([arrayBuffer], { type: 'audio/ogg' });
    htmlAudio.src = window.URL.createObjectURL(blob);
};

export const unloadAudio = (): void => {
    if (!htmlAudio) {
        console.error(logPrefix + 'missing HTML element for audio');
        return;
    }
    htmlAudio.src = '';
    window.URL.revokeObjectURL(audioURL);
};

export const reset = (): void => {
    switchHeader(false);
    setCoverImage(null);
    setCoverLink();
    setSongDuration(0);
    unloadAudio();
};
