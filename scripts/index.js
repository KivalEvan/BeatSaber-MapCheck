 /* GENERAL SCRIPT - index.js
    initialise stuff here
    some general and other stuff that has no place yet
    also includes unused stuff that i may consider in the future */

$('#watermark').text(`${watermark} - ${version}`)

// ui stuff
if (flag.tool.dd) $('#dd').prop('checked', true);
if (flag.tool.hb.staircase) $('#hb-stair').prop('checked', true);
if (flag.tool.vb.note) $('#vb-note').prop('checked', true);
if (flag.tool.shrAngle) $('#shrangle').prop('checked', true);
if (flag.tool.speedPause) $('#speedpause').prop('checked', true);

$('#ebpm').val(tool.ebpm.th);
$('#ebpms').val(tool.ebpm.thSwing);
$('#shrangle-max').val(tool.maxShrAngle * 1000);
$('#shrangle-max-beat').val(0);
$('#speedpause-max').val(tool.maxSpeedPause * 1000);
$('#speedpause-max-beat').val(0);
$('#vb-min').val(tool.vb.min * 1000);
$('#vb-min-beat').val(0);
$('#vb-max').val(tool.vb.max * 1000);
$('#vb-max-beat').val(0);
$('#beatprec').val(tool.beatPrec.join(' '));
$('#song-duration').text(toMMSS(map.audio.dur));

$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
       return null;
    }
    return decodeURI(results[1]) || null;
}

if ($.urlParam('url') !== null) {
    downloadFromURL($.urlParam('url'));
}
else if ($.urlParam('id') !== null) {
    downloadFromID($.urlParam('id'));
}

function toMMSS(num) {
    if (!num) return '0:00';
    let numr = Math.round(num);
    let min = Math.floor(numr / 60);
    let sec = numr % 60;
    return `${min}:${(sec > 9) ? sec : `0${sec}`}`;
}

function toRealTime(beat) {
    return beat / map.info._beatsPerMinute * 60;
}

function toBeatTime(num) {
    return num * map.info._beatsPerMinute / 60;
}

function getBPMChangesTime(bpm, offset = 0, bpmc = []) {
    let temp;
    let BPMChanges = [];
    for (let i = 0; i < bpmc.length; i++) {
        let curBPMC = {
            bpm: bpmc[i]._BPM || bpmc[i]._bpm,
            jsonTime: bpmc[i]._time,
        }
        if (temp) curBPMC.newTime = Math.ceil((curBPMC.jsonTime - temp.jsonTime) / bpm * temp.bpm + temp.newTime - 0.01);
        else curBPMC.newTime = Math.ceil(curBPMC.jsonTime - (offset * bpm / 60) - 0.01);
        BPMChanges.push(curBPMC);
        temp = curBPMC;
    }
    return BPMChanges;
}

function adjustTime(beat, bpm, offset = 0, bpmc = []) {
    for (let i = bpmc.length - 1; i >= 0; i--) {
        if (beat > bpmc[i].jsonTime) {
            return round((beat - bpmc[i].jsonTime) / bpm * bpmc[i].bpm + bpmc[i].newTime, 3);
        }
    }
    return offsetBegone(beat, bpm, offset);
}

function offsetBegone(beat, bpm, offset) {
    return round((toRealTime(beat) - offset) * bpm / 60, 3);
}

// just to make rounding with decimal easier
function round(num, d = 0) {
    if (!d > 0) return Math.round(num);
    // return parseFloat(num.toFixed(d));
    return Math.round(num * Math.pow(10, d)) / Math.pow(10, d);
}

// thanks Top_Cat
function mod(x, m) {
    if (m < 0) m = -m; r = x % m;
    return r < 0 ? r + m : r;
}
function distance(a, b, m) {
    return Math.min(mod(a - b, m),mod(b - a, m));
}

function outTxtBold(arg1, arg2) {
    if (!Array.isArray(arg2)) {
        if (arg2 === '') return '';
        return `<b>${arg1}</b>: ${arg2}`
    }
    if (arg2.length === 0) return '';
    if (arg1.search(/\[\]/g) !== -1 && arg2.length > 0) arg1 = arg1.replaceAll(/\[\]/g, `[${arg2.length}]`);
    return `<b>${arg1}</b>: ${arg2.join(', ')}`
}

function isAboveTH(t, th) {
    return toRealTime(t) > th;
}

function isBelowTH(t, th) {
    return toRealTime(t) < th;
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
    return `#${compToHex(color.r)}${compToHex(color.g)}${compToHex(color.b)}${color.a > 0 ? compToHex(c.a) : ''}`
}
