import { Note } from '../beatmap/map';

export const calculate = (notes: Note[], duration?: number): number => {
    if (!duration) {
        duration = notes[notes.length - 1]._time - notes[0]._time;
    }
    return notes.filter((n) => n._type === 0 || n._type === 1).length / duration;
};

export const peak = (notes: Note[], beat: number, bpm: number): number => {
    const nArr = notes.filter((n) => n._type === 0 || n._type === 1);
    let peakNPS = 0;
    let currentSectionStart = 0;

    for (let i = 0; i < nArr.length; i++) {
        while (nArr[i]._time - nArr[currentSectionStart]._time > beat) {
            currentSectionStart++;
        }
        peakNPS = Math.max(peakNPS, (i - currentSectionStart + 1) / ((beat / bpm) * 60));
    }

    return peakNPS;
};
