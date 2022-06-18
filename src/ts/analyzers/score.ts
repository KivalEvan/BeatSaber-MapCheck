import { NoteContainer } from '../types/beatmap/v3/container';

export const MAX_NOTE_SCORE = 115;
export const MAX_CHAIN_HEAD_SCORE = 85;
export const MAX_CHAIN_TAIL_SCORE = 20;

// TODO: check for slider and burst
export function calculate(nc: NoteContainer[]) {
    let total = 0;
    let multiplier = 1;
    for (
        let i = 0,
            len = nc.filter(
                (n) =>
                    n.type === 'note' &&
                    !(typeof n.data.customData.uninteractable !== 'undefined' || !n.data.customData.uninteractable),
            ).length;
        i < len;
        i++
    ) {
        if (multiplier < 8 && i === -3 + multiplier * 4) {
            multiplier *= 2;
        }
        total += MAX_NOTE_SCORE * multiplier;
    }
    return total;
}
