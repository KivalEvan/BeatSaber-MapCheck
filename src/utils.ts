export const toMMSS = (num: number): string => {
    if (!num) {
        return '0:00';
    }
    const numr = Math.round(num);
    const min = Math.floor(numr / 60).toString();
    const sec = (numr % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
};

export const formatNumber = (num: number): string => {
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const round = (num: number, d: number = 0): number => {
    return Math.round(num * Math.pow(10, d)) / Math.pow(10, d);
};

// thanks Top_Cat#1961
function mod(x, m) {
    if (m < 0) {
        m = -m;
    }
    let r = x % m;
    return r < 0 ? r + m : r;
}
function shortRotDistance(a, b, m) {
    return Math.min(mod(a - b, m), mod(b - a, m));
}

function isAboveThres(t, rt) {
    return toRealTime(t) > rt;
}
function isBelowThres(t, rt) {
    return toRealTime(t) < rt;
}

function compToHex(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
function cDenorm(c) {
    return c > 1 && !c < 0 ? 255 : round(c * 255);
}
function rgbaToHex(colorObj) {
    let color = {};
    for (const c in colorObj) {
        color[c] = cDenorm(colorObj[c]);
    }
    return `#${compToHex(color.r)}${compToHex(color.g)}${compToHex(color.b)}${
        color.a > 0 ? compToHex(c.a) : ''
    }`;
}

function median(numArr) {
    if (numArr.length === 0) return 0;
    numArr.sort(function (a, b) {
        return a - b;
    });

    const mid = Math.floor(numArr.length / 2);
    if (numArr.length % 2) return numArr[mid];
    return (numArr[mid - 1] + numArr[mid]) / 2;
}
