const verLatest = {
    info: [2, 0, 0], // beat games, u made this change like twice, why is it still 2.0.0
    difficulty: [2, 5, 0],
};

export const compare = (version: string, type: 'info' | 'difficulty') => {
    const verArray = getArray(version);
    for (const num in verArray) {
        if (verArray[num] < verLatest[type][num]) {
            return 'old';
        }
        if (verArray[num] > verLatest[type][num]) {
            return 'new';
        }
    }
    return 'current';
};

export const getArray = (version: string): number[] => {
    return version
        .replace('v', '')
        .split('.')
        .map((el) => parseInt(el));
};
