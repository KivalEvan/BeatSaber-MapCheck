export const calcMinSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
    let hasStraight = false;
    let hasDiagonal = false;
    let curvedSpeed = 0;
    const speed = bpm.toRealTime(
        Math.max(
            ...notes.map((_, i) => {
                if (i === 0) {
                    return 0;
                }
                if (
                    (notes[i].isHorizontal(notes[i - 1]) ||
                        notes[i].isVertical(notes[i - 1])) &&
                    !hasStraight
                ) {
                    hasStraight = true;
                    curvedSpeed =
                        (notes[i].time - notes[i - 1].time) /
                        (notes[i].getDistance(notes[i - 1]) || 1);
                }
                hasDiagonal =
                    notes[i].isDiagonal(notes[i - 1]) ||
                    notes[i].isSlantedWindow(notes[i - 1]) ||
                    hasDiagonal;
                return (
                    (notes[i].time - notes[i - 1].time) /
                    (notes[i].getDistance(notes[i - 1]) || 1)
                );
            })
        )
    );
    if (hasStraight && hasDiagonal) {
        return bpm.toRealTime(curvedSpeed);
    }
    return speed;
};

export const calcMaxSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
    let hasStraight = false;
    let hasDiagonal = false;
    let curvedSpeed = Number.MAX_SAFE_INTEGER;
    const speed = bpm.toRealTime(
        Math.min(
            ...notes.map((_, i) => {
                if (i === 0) {
                    return Number.MAX_SAFE_INTEGER;
                }
                if (
                    (notes[i].isHorizontal(notes[i - 1]) ||
                        notes[i].isVertical(notes[i - 1])) &&
                    !hasStraight
                ) {
                    hasStraight = true;
                    curvedSpeed =
                        (notes[i].time - notes[i - 1].time) /
                        (notes[i].getDistance(notes[i - 1]) || 1);
                }
                hasDiagonal =
                    notes[i].isDiagonal(notes[i - 1]) ||
                    notes[i].isSlantedWindow(notes[i - 1]) ||
                    hasDiagonal;
                return (
                    (notes[i].time - notes[i - 1].time) /
                    (notes[i].getDistance(notes[i - 1]) || 1)
                );
            })
        )
    );
    if (hasStraight && hasDiagonal) {
        return bpm.toRealTime(curvedSpeed);
    }
    return speed;
};

export const getSliderNote = (notes: ColorNote[], bpm: BeatPerMinute): NoteSlider[] => {
    const noteSlider: NoteSlider[] = [];
    const lastNote: { [key: number]: NoteSlider } = {};
    const swingNoteArray: { [key: number]: NoteSlider[] } = {
        0: [],
        1: [],
    };
    for (let i = 0, len = notes.length; i < len; i++) {
        const note: NoteSlider = deepCopy(notes[i]) as NoteSlider;
        note._minSpeed = 0;
        note._maxSpeed = Number.MAX_SAFE_INTEGER;
        if (lastNote[note.color]) {
            if (
                this.next(note, lastNote[note.color], bpm, swingNoteArray[note.color])
            ) {
                const minSpeed = this.calcMinSliderSpeed(
                    swingNoteArray[note.color],
                    bpm
                );
                const maxSpeed = this.calcMaxSliderSpeed(
                    swingNoteArray[note.color],
                    bpm
                );
                if (minSpeed > 0 && maxSpeed !== Infinity) {
                    lastNote[note.color]._minSpeed = minSpeed;
                    lastNote[note.color]._maxSpeed = maxSpeed;
                    noteSlider.push(lastNote[note.color]);
                }
                lastNote[note.color] = note;
                swingNoteArray[note.color] = [];
            }
        } else {
            lastNote[note.color] = note;
        }
        swingNoteArray[note.color].push(note);
    }
    for (let i = 0; i < 2; i++) {
        if (lastNote[i]) {
            const minSpeed = this.calcMinSliderSpeed(swingNoteArray[i], bpm);
            const maxSpeed = this.calcMaxSliderSpeed(swingNoteArray[i], bpm);
            if (minSpeed > 0 && maxSpeed !== Infinity) {
                lastNote[i]._minSpeed = minSpeed;
                lastNote[i]._maxSpeed = maxSpeed;
                noteSlider.push(lastNote[i]);
            }
        }
    }
    return noteSlider;
};

export const getMinSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
    return Math.max(...this.getSliderNote(notes, bpm).map((n) => n._minSpeed), 0);
};

export const getMaxSliderSpeed = (notes: ColorNote[], bpm: BeatPerMinute): number => {
    const arr = this.getSliderNote(notes, bpm).map((n) => n._maxSpeed);
    return arr.length ? Math.min(...arr) : 0;
};
