import { round, toMMSSMS } from '../utils';

const logPrefix = 'UI Header: ';

export default new (class UIHeader {
    private htmlIntro: HTMLElement;
    private htmlMetadata: HTMLElement;
    private htmlCoverLink: HTMLLinkElement;
    private htmlCoverImage: HTMLImageElement;
    private htmlMetadataSongName: HTMLElement;
    private htmlMetadataSongSubname: HTMLElement;
    private htmlMetadataSongAuthor: HTMLElement;
    private htmlMetadataSongBPM: HTMLElement;
    private htmlMetadataSongDuration: HTMLElement;
    private htmlAudio: HTMLAudioElement;
    private audioURL = '';

    constructor() {
        this.htmlIntro = document.querySelector('.intro')!;
        this.htmlMetadata = document.querySelector('.metadata')!;
        this.htmlCoverLink = document.querySelector('.cover__link')!;
        this.htmlCoverImage = document.querySelector('.cover__image')!;
        this.htmlMetadataSongName = document.querySelector('.metadata__song-name')!;
        this.htmlMetadataSongSubname = document.querySelector(
            '.metadata__song-subname'
        )!;
        this.htmlMetadataSongAuthor = document.querySelector('.metadata__song-author')!;
        this.htmlMetadataSongBPM = document.querySelector('.metadata__song-bpm')!;
        this.htmlMetadataSongDuration = document.querySelector(
            '.metadata__song-duration'
        )!;
        this.htmlAudio = document.querySelector('.audio')!;

        if (!this.htmlIntro || !this.htmlMetadata) {
            console.error(
                logPrefix + 'header component is missing one of the two section'
            );
        }
        if (!this.htmlCoverLink || !this.htmlCoverImage) {
            console.error(logPrefix + 'cover component is missing');
        }
        if (
            !this.htmlMetadataSongName ||
            !this.htmlMetadataSongSubname ||
            !this.htmlMetadataSongAuthor ||
            !this.htmlMetadataSongBPM ||
            !this.htmlMetadataSongDuration
        ) {
            console.error(logPrefix + 'metadata component is missing one of the part');
        }
    }

    switchHeader = (isIntro: boolean): void => {
        if (isIntro) {
            this.htmlIntro.classList.remove('hidden');
            this.htmlMetadata.classList.add('hidden');
        } else {
            this.htmlIntro.classList.add('hidden');
            this.htmlMetadata.classList.remove('hidden');
        }
    };

    setCoverImage = (src: string | null): void => {
        this.htmlCoverImage.src = src || './img/unknown.jpg';
    };

    getCoverImage = (): string | null => {
        return this.htmlCoverImage.src;
    };

    setCoverLink = (url?: string, id?: string): void => {
        if (url == null && id == null) {
            this.htmlCoverLink.textContent = '';
            this.htmlCoverLink.href = '';
            this.htmlCoverLink.classList.add('disabled');
            return;
        }
        if (url != null) {
            this.htmlCoverLink.textContent = id ?? 'Download Link';
            this.htmlCoverLink.href = url;
            this.htmlCoverLink.classList.remove('disabled');
        }
    };

    setSongName = (str: string): void => {
        this.htmlMetadataSongName.textContent = str;
    };

    setSongSubname = (str: string): void => {
        this.htmlMetadataSongSubname.textContent = str;
    };

    setSongAuthor = (str: string): void => {
        this.htmlMetadataSongAuthor.textContent = str;
    };

    // TODO: some way to save bpm change
    setSongBPM = (num: number, minBPM?: number, maxBPM?: number): void => {
        if ((minBPM === null || minBPM === undefined) && typeof maxBPM === 'number') {
            minBPM = Math.min(num, maxBPM);
        }
        if ((maxBPM === null || maxBPM === undefined) && typeof minBPM === 'number') {
            maxBPM = Math.max(num, minBPM);
        }
        let text = round(num, 2).toString() + 'BPM';
        if (minBPM && maxBPM) {
        }
        this.htmlMetadataSongBPM.textContent = text;
    };

    setSongDuration = (num?: number): void => {
        if (num) {
            this.htmlMetadataSongDuration.textContent = toMMSSMS(num);
        } else {
            this.htmlMetadataSongDuration.textContent = 'No audio';
        }
    };

    setAudio = async (arrayBuffer: ArrayBuffer): Promise<void> => {
        const blob = new Blob([arrayBuffer], { type: 'audio/ogg' });
        this.htmlAudio.src = window.URL.createObjectURL(blob);
    };

    unloadAudio = (): void => {
        this.htmlAudio.src = '';
        window.URL.revokeObjectURL(this.audioURL);
    };

    reset = (): void => {
        this.switchHeader(false);
        this.setCoverImage(null);
        this.setCoverLink();
        this.setSongDuration(0);
        this.unloadAudio();
    };
})();
