/* GENERAL SCRIPT - index.js
    initialise stuff here
    some general and other stuff that has no place yet
    also includes unused stuff that i may consider in the future */

$('#watermark').text(`${watermark}`);
$('#version').text(version);

// ui stuff
if (flag.tool.dd) $('#dd').prop('checked', true);
if (flag.tool.hbStaircase) $('#hb-stair').prop('checked', true);
if (flag.tool.vbSpecific === 'time') $('#vb-specific-time').prop('checked', true);
if (flag.tool.vbSpecific === 'diff') $('#vb-specific-diff').prop('checked', true);
if (flag.tool.vbNote) $('#vb-note').prop('checked', true);
if (flag.tool.shrAngle) $('#shrangle').prop('checked', true);
if (flag.tool.speedPause) $('#speedpause').prop('checked', true);
if (flag.tool.slowSlider) $('#slowslider').prop('checked', true);

$('#ebpm').val(tool.ebpm.th);
$('#ebpms').val(tool.ebpm.thSwing);
$('#slowslider-min').val(tool.minSliderSpeed * 1000);
$('#slowslider-min-prec').val(0);
$('#shrangle-max').val(tool.maxShrAngle * 1000);
$('#shrangle-max-prec').val(0);
$('#speedpause-max').val(tool.maxSpeedPause * 1000);
$('#speedpause-max-prec').val(0);
$('#vb-min').val(tool.vb.min * 1000);
$('#vb-min-beat').val(0);
$('#vb-max').val(tool.vb.max * 1000);
$('#vb-max-beat').val(0);
$('#beatprec').val(tool.beatPrec.join(' '));
$('#song-duration').text(toMMSS(map.audio.dur));

$.urlParam = function (name) {
    let results = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    return decodeURI(results[1]) || null;
};

if ($.urlParam('url') !== null) {
    downloadFromURL($.urlParam('url'));
} else if ($.urlParam('id') !== null) {
    downloadFromID($.urlParam('id'));
}
// used for debugging, skipping audio process
if ($.urlParam('noaudio') !== null) {
    flag.noAudio = $.urlParam('noaudio') === 'true' ? true : false;
}
if ($.urlParam('nostats') !== null) {
    flag.noStats = $.urlParam('nostats') === 'true' ? true : false;
    $('#stats').css({ display: 'none' });
}
if ($.urlParam('tools') !== null) {
    flag.noStats = $.urlParam('tools') === 'true' ? true : false;
    setTimeout(function () {
        $('.accordion').trigger('click');
    }, 100);
}

function toMMSS(num) {
    if (!num) {
        return '0:00';
    }
    let numr = Math.round(num);
    let min = Math.floor(numr / 60);
    let sec = numr % 60;
    return `${min}:${sec > 9 ? sec : `0${sec}`}`;
}

function toRealTime(beat) {
    return (beat / map.info._beatsPerMinute) * 60;
}

function toBeatTime(num) {
    return (num * map.info._beatsPerMinute) / 60;
}

function getBPMChangesTime(bpm, offset = 0, bpmc = []) {
    let temp;
    const BPMChanges = [];
    for (let i = 0; i < bpmc.length; i++) {
        let curBPMC = {
            bpm: bpmc[i]._BPM || bpmc[i]._bpm,
            jsonTime: bpmc[i]._time,
        };
        if (temp) {
            curBPMC.newTime = Math.ceil(((curBPMC.jsonTime - temp.jsonTime) / bpm) * temp.bpm + temp.newTime - 0.01);
        } else {
            curBPMC.newTime = Math.ceil(curBPMC.jsonTime - (offset * bpm) / 60 - 0.01);
        }
        BPMChanges.push(curBPMC);
        temp = curBPMC;
    }
    return BPMChanges;
}

function adjustTime(beat, bpm, offset = 0, bpmc = []) {
    for (let i = bpmc.length - 1; i >= 0; i--) {
        if (beat > bpmc[i].jsonTime) {
            return round(((beat - bpmc[i].jsonTime) / bpm) * bpmc[i].bpm + bpmc[i].newTime, 3);
        }
    }
    return offsetBegone(beat, bpm, offset);
}

function offsetBegone(beat, bpm, offset) {
    return round(((toRealTime(beat) - offset) * bpm) / 60, 3);
}

// just to make rounding with decimal easier
function round(num, d = 0) {
    const place = Math.pow(10, d);
    // return parseFloat(num.toFixed(d));
    return Math.round(num * place) / place;
}

// thanks Top_Cat#1961
function mod(x, m) {
    if (m < 0) {
        m = -m;
    }
    r = x % m;
    return r < 0 ? r + m : r;
}
function distance(a, b, m) {
    return Math.min(mod(a - b, m), mod(b - a, m));
}

function printHTMLBold(arg1, arg2) {
    if (!Array.isArray(arg2)) {
        if (arg2 === '') {
            return '';
        }
        return `<b>${arg1}</b>: ${arg2}`;
    }
    if (arg2.length === 0) {
        return '';
    }
    if (arg1.search(/\[\]/g) !== -1 && arg2.length > 0) {
        arg1 = arg1.replaceAll(/\[\]/g, `[${arg2.length}]`);
    }
    return `<b>${arg1}</b>: ${arg2.join(', ')}`;
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
    return `#${compToHex(color.r)}${compToHex(color.g)}${compToHex(color.b)}${color.a > 0 ? compToHex(c.a) : ''}`;
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
