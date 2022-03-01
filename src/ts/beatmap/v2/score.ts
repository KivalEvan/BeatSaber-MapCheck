export const maxNoteScore = 115;

export const calculate = (noteCount: number): number => {
    let total = 0;
    let multiplier = 1;
    for (let i = 0; i < noteCount; i++) {
        if (multiplier < 8 && i === -3 + multiplier * 4) {
            multiplier *= 2;
        }
        total += maxNoteScore * multiplier;
    }
    return total;
};
