import { round, toMMSSMS } from '../utils';

const logPrefix = 'UI Header: ';

const htmlIntro: HTMLElement = document.querySelector('.intro')!;
const htmlMetadata: HTMLElement = document.querySelector('.metadata')!;
const htmlCoverLink: HTMLLinkElement = document.querySelector('.cover__link')!;
const htmlCoverImage: HTMLImageElement = document.querySelector('.cover__image')!;
const htmlMetadataSongName: HTMLElement = document.querySelector('.metadata__song-name')!;
const htmlMetadataSongSubname: HTMLElement = document.querySelector('.metadata__song-subname')!;
const htmlMetadataSongAuthor: HTMLElement = document.querySelector('.metadata__song-author')!;
const htmlMetadataSongBPM: HTMLElement = document.querySelector('.metadata__song-bpm')!;
const htmlMetadataSongDuration: HTMLElement = document.querySelector('.metadata__song-duration')!;
const htmlAudio: HTMLAudioElement = document.querySelector('.audio')!;

if (!htmlIntro || !htmlMetadata) {
    throw new Error(logPrefix + 'header component is missing one of the two section');
}
if (!htmlCoverLink || !htmlCoverImage) {
    throw new Error(logPrefix + 'cover component is missing');
}
if (
    !htmlMetadataSongName ||
    !htmlMetadataSongSubname ||
    !htmlMetadataSongAuthor ||
    !htmlMetadataSongBPM ||
    !htmlMetadataSongDuration
) {
    throw new Error(logPrefix + 'metadata component is missing one of the part');
}

function switchHeader(isIntro: boolean): void {
    if (isIntro) {
        htmlIntro.classList.remove('hidden');
        htmlMetadata.classList.add('hidden');
    } else {
        htmlIntro.classList.add('hidden');
        htmlMetadata.classList.remove('hidden');
    }
}

function setCoverImage(src: string | null): void {
    htmlCoverImage.src = src || './img/unknown.jpg';
}

function getCoverImage(): string | null {
    return htmlCoverImage.src;
}

function setCoverLink(url?: string, id?: string): void {
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
}

function setSongName(str: string): void {
    htmlMetadataSongName.textContent = str;
}

function setSongSubname(str: string): void {
    htmlMetadataSongSubname.textContent = str;
}

function setSongAuthor(str: string): void {
    htmlMetadataSongAuthor.textContent = str;
}

// TODO: some way to save bpm change
function setSongBPM(num: number, minBPM?: number, maxBPM?: number): void {
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
}

function setSongDuration(num?: number): void {
    if (num) {
        htmlMetadataSongDuration.textContent = toMMSSMS(num);
    } else {
        htmlMetadataSongDuration.textContent = 'No audio';
    }
}

async function setAudio(arrayBuffer: ArrayBuffer): Promise<void> {
    const blob = new Blob([arrayBuffer], { type: 'audio/ogg' });
    htmlAudio.src = window.URL.createObjectURL(blob);
}

function unloadAudio(): void {
    htmlAudio.src = '';
    window.URL.revokeObjectURL('');
}

function reset(): void {
    switchHeader(true);
    setCoverImage(null);
    setCoverLink();
    setSongDuration(0);
    unloadAudio();
}
export default {
    switchHeader,
    setCoverImage,
    getCoverImage,
    setCoverLink,
    setSongName,
    setSongSubname,
    setSongAuthor,
    setSongBPM,
    setSongDuration,
    setAudio,
    unloadAudio,
    reset,
};
