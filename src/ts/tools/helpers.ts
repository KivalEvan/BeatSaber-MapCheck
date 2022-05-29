import { BeatPerMinute } from '../beatmap';
import { round } from '../utils/math';

export const printResult = (label: string, text?: string) => {
    const htmlContainer = document.createElement('div');

    if (text) {
        htmlContainer.innerHTML = `<b>${label}:</b> ${text}`;
    } else {
        htmlContainer.innerHTML = `<b>${label}</b>`;
    }

    return htmlContainer;
};

export const printResultTime = (label: string, timeAry: number[], bpm: BeatPerMinute) => {
    const htmlContainer = document.createElement('div');
    htmlContainer.innerHTML = `<b>${label} [${timeAry.length}]:</b> ${timeAry
        .map((n) => round(bpm.adjustTime(n), 3))
        .join(', ')}`;

    return htmlContainer;
};
