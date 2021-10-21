export const toMMSS = (seconds: number): string => {
    if (!seconds) {
        return '0:00';
    }
    const numr = Math.floor(seconds);
    const temp = numr / 60;
    const min =
        temp < 0 ? `-${Math.ceil(temp).toString()}` : Math.floor(temp).toString();
    const sec = Math.abs(numr % 60)
        .toString()
        .padStart(2, '0');
    return `${min}:${sec}`;
};

export const toMMSSMS = (seconds: number): string => {
    if (!seconds) {
        return '0:00.000';
    }
    const dec =
        (seconds % 1).toString().split('.')[1]?.padEnd(3, '0').slice(0, 3) || '000';
    return `${toMMSS(seconds)}.${dec}`;
};

export const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const round = (num: number, d: number = 0): number => {
    return Math.round(num * Math.pow(10, d)) / Math.pow(10, d);
};

export const radToDeg = (x: number) => {
    return x * (180 / Math.PI);
};

export const degToRad = (x: number) => {
    return x * (Math.PI / 180);
};

// thanks Top_Cat#1961
export const mod = (x: number, m: number): number => {
    if (m < 0) {
        m = -m;
    }
    let r = x % m;
    return r < 0 ? r + m : r;
};
export const shortRotDistance = (a: number, b: number, m: number): number => {
    return Math.min(mod(a - b, m), mod(b - a, m));
};

export const median = (numArr: number[]): number => {
    if (numArr.length === 0) {
        return 0;
    }
    numArr.sort((a: number, b: number) => a - b);
    const mid = Math.floor(numArr.length / 2);
    if (numArr.length % 2) {
        return numArr[mid];
    }
    return (numArr[mid - 1] + numArr[mid]) / 2;
};

export const sanitizeURL = (url: string): string => {
    // regex from stackoverflow from another source
    let regexURL =
        /^(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/;
    url = url.trim();
    if (/^http:\/\//.test(url)) {
        url = url.replace('http://', 'https://');
    }
    if (regexURL.test(url)) {
        return url;
    }
    throw new Error('Invalid URL');
};

export const sanitizeBeatSaverID = (id: string): string => {
    let regexID = /^[0-9a-fA-F]{1,6}$/;
    id = id.trim();
    if (/^!bsr /.test(id)) {
        id = id.replace('!bsr ', '');
    }
    if (regexID.test(id)) {
        return id;
    }
    throw new Error('Invalid ID');
};

export const removeOptions = (selectElement: HTMLSelectElement): void => {
    for (let i = selectElement.options.length - 1; i >= 0; i--) {
        selectElement.remove(i);
    }
};
