const logPrefix = 'UI Audio Player: ';

const htmlAudioPlayer = document.querySelector<HTMLElement>('.audio-player');

export class AudioPlayer {
    private _message = 'test';
}

export const setAudio = async (buffer: AudioBuffer): Promise<void> => {
    if (!htmlAudioPlayer) {
        console.error(logPrefix + 'missing HTML element for audio');
        return;
    }
};

export const unloadAudio = (): void => {
    if (!htmlAudioPlayer) {
        console.error(logPrefix + 'missing HTML element for audio');
        return;
    }
};
