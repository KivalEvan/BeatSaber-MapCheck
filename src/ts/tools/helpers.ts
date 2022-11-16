import { BeatPerMinute } from '../beatmap/shared/bpm';
import settings from '../settings';
import { round } from '../utils/math';
import { toMMSS, toMMSSMS } from '../utils/time';

type Symbol = 'info' | 'warning' | 'error' | 'rank';

function addLabel(str: string, symbol?: Symbol): string {
    switch (symbol) {
        case 'rank':
            str = '<span title="Ranking: for rankability reason."> 🚧 </span>' + str;
            break;
        case 'error':
            str = '<span title="Error: should be fixed unless you know what you are doing."> ❌ </span>' + str;
            break;
        case 'warning':
            str = '<span title="Warning: not necessarily needed to be fixed but worth considering."> ❗ </span>' + str;
            break;
        case 'info':
            str = '<span title="Info: no action necessary and worth noting."> ⚠️ </span>' + str;
            break;
    }
    return str;
}

export function printResult(label: string, text?: string, symbol?: Symbol) {
    const htmlContainer = document.createElement('div');

    label = addLabel(label, symbol);

    if (text) {
        htmlContainer.innerHTML = `<b>${label}:</b> ${text}`;
    } else {
        htmlContainer.innerHTML = `<b>${label}</b>`;
    }

    return htmlContainer;
}

export function printResultTime(label: string, timeAry: number[], bpm: BeatPerMinute, symbol?: Symbol) {
    const htmlContainer = document.createElement('div');

    label = addLabel(label, symbol);

    htmlContainer.innerHTML = `<b>${label} [${timeAry.length}]:</b> ${timeAry
        .map((n) => {
            switch (settings.beatNumbering) {
                case 'realtime':
                    return `<span title="Beat ${round(bpm.adjustTime(n), settings.rounding)}">${toMMSS(
                        bpm.toRealTime(n),
                    )}</span>`;
                case 'realtimems':
                    return `<span title="Beat ${round(bpm.adjustTime(n), settings.rounding)}">${toMMSSMS(
                        bpm.toRealTime(n),
                    )}</span>`;
                case 'jsontime':
                    return `<span title="Time ${toMMSSMS(bpm.toRealTime(n))}">${round(n, settings.rounding)}</span>`;
                case 'beattime':
                default:
                    return `<span title="Time ${toMMSSMS(bpm.toRealTime(n))}">${round(
                        bpm.adjustTime(n),
                        settings.rounding,
                    )}</span>`;
            }
        })
        .join(', ')}`;

    return htmlContainer;
}
