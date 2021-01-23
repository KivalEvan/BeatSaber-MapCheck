 /* GENERAL SCRIPT - index.js
    some general and other stuff that has no place yet
    flag and constant stuff is mostly here
    also includes unused stuff that i may consider in the future */

const watermark = 'Kival Evan#5480';
const version = 'v1.2.0';

$('#watermark').text(`${watermark} - ${version}`)

// initialise stuff
let flagBPMChanges = false;
let flagOddBPM = false;
let flagLoaded = false;
let flagLoadAudio = false;

let flagToolDD = true;
let flagToolHBStair = true;
let flagToolvBlock = true;
let flagToolshrAngle = false;

if (flagToolDD) $('#dd').prop('checked', true);
if (flagToolHBStair) $('#hbstair').prop('checked', true);
if (flagToolvBlock) $('#vblock').prop('checked', true);
if (flagToolshrAngle) $('#shrangle').prop('checked', true);

let charSelect = '';
let diffSelect = '';
let maxEBPM = 450;
let maxEBPMS = 350;
let shrAngleMax = 0.175;
let vBlockMin = 0.1;
let vBlockMax = 0.5;
let beatPrecision = [4, 3]

$('#ebpm').val(maxEBPM);
$('#ebpms').val(maxEBPMS);
$('#shranglemax').val(shrAngleMax * 1000);
$('#shranglemaxbeat').val(0);
$('#vblockmin').val(vBlockMin * 1000);
$('#vblockminbeat').val(0);
$('#vblockmax').val(vBlockMax * 1000);
$('#vblockmaxbeat').val(0);
$('#beatprec').val(beatPrecision.join(' '));

const maxTolerance = 0.07 + 1e-9;
const maxWindowTolerance = 0.08 + 1e-9;
const minWallDur = 0.015 + 1e-9;

// there's no definite formula for hitbox as of yet
const hitboxStaircaseThreshold = 0.145 + 1e-9;

/**  REFERENCES  **
NOTE TYPE:
 0 -> Red Note
 1 -> Blue Note
 3 -> Bomb

NOTE DIRECTION:
        ^
  | 4 | 0 | 5 | 
< | 2 | 8 | 3 | >
  | 6 | 1 | 7 | 
        v

INDEX_LAYER:
 0_2 | 1_2 | 2_2 | 3_2
 0_1 | 1_1 | 2_1 | 3_1
 0_0 | 1_0 | 2_0 | 3_0
INDEX refers to lane.
LAYER refers to row.
INDEX_LAYER:
 0_2 | 1_2 | 2_2 | 3_2
 0_1 | 1_1 | 2_1 | 3_1
 0_0 | 1_0 | 2_0 | 3_0
INDEX refers to lane.
LAYER refers to row.

EVENT TYPE:
 0 -> Back Top Lasers
 1 -> Track Ring Neons
 2 -> Left Lasers
 3 -> Right Lasers
 4 -> Center Lighting
 5 -> Light Boost
 8 -> Rings Rotation
 9 -> Small Rings Zoom
10 -> BPM Change (BROKEN)
12 -> Left Lasers Speed
13 -> Right Lasers Speed
14 -> Early Spawn Rotation
15 -> Late Spawn Rotation

EVENT VALUE:
 0 -> Off
 1 -> On Blue
 2 -> Flash Blue
 3 -> Fade Blue
 5 -> On Red
 6 -> Flash Red
 7 -> Fade Red
Rings: N/A
Lasers: Speed
Spawn Rotation (Clockwise):
 0 -> -60 degree rotation
 1 -> -45 degree rotation
 2 -> -30 degree rotation
 3 -> -15 degree rotation
 4 -> 15 degree rotation
 5 -> 30 degree rotation
 6 -> 45 degree rotation
 7 -> 60 degree rotation
 */

const noteCutAngle = {
    0: 0,
    1: 180,
    2: 270,
    3: 90,
    4: 315,
    5: 45,
    6: 225,
    7: 135,
    8: 0
}
const flipCutDir = {
    0: 1,
    1: 0,
    2: 3,
    3: 2,
    4: 7,
    5: 6,
    6: 5,
    7: 4,
    8: 8
}
const swingCutDirectionSpace = {
    0: [0, 1],
    1: [0, -1],
    2: [-1, 0],
    3: [1, 0],
    4: [-1, 1],
    5: [1, 1],
    6: [-1, -1],
    7: [1, -1],
    8: [0, 0]
}

const modeRename = {
    "OneSaber": "One Saber",
    "NoArrows": "No Arrows",
    "360Degree": "360 Degree",
    "90Degree": "90 Degree"
}
const diffRename = {
    "ExpertPlus": "Expert+",
    "Expert": "Expert",
    "Hard": "Hard",
    "Normal": "Normal",
    "Easy": "Easy"
}
const diffColor = {
    "ExpertPlus": "#8f48db",
    "Expert": "#bf2a42",
    "Hard": "#ff6347",
    "Normal": "#59b0f4",
    "Easy": "#3cb371"
}
const envName = {
    "DefaultEnvironment" : "The First",
    "OriginsEnvironment" : "Origins",
    "Origins" : "Origins", // because beat games
    "TriangleEnvironment" : "Triangle",
    "NiceEnvironment" : "Nice",
    "BigMirrorEnvironment" : "Big Mirror",
    "DragonsEnvironment" : "Dragons",
    "KDAEnvironment" : "K/DA",
    "MonstercatEnvironment" : "Monstercat",
    "CrabRaveEnvironment" : "Crab Rave",
    "PanicEnvironment" : "Panic",
    "RocketEnvironment" : "Rocket",
    "GreenDayEnvironment" : "Green Day",
    "GreenDayGrenadeEnvironment" : "Green Day Grenade",
    "TimbalandEnvironment" : "Timbaland",
    "FitBeatEnvironment" : "FitBeat",
    "LinkinParkEnvironment" : "Linkin Park",
    "BTSEnvironment" : "BTS",
    "GlassDesertEnvironment" : "Glass Desert"
}
const envColor = {
    "DefaultEnvironment" : "The First",
    "OriginsEnvironment" : "Origins",
    "Origins" : "Origins", // because beat games
    "TriangleEnvironment" : "The First",
    "NiceEnvironment" : "The First",
    "BigMirrorEnvironment" : "The First",
    "DragonsEnvironment" : "The First",
    "KDAEnvironment" : "KDA",
    "MonstercatEnvironment" : "The First",
    "CrabRaveEnvironment" : "Crab Rave",
    "PanicEnvironment" : "The First",
    "RocketEnvironment" : "Rocket",
    "GreenDayEnvironment" : "Green Day",
    "GreenDayGrenadeEnvironment" : "Green Day",
    "TimbalandEnvironment" : "Timbaland",
    "FitBeatEnvironment" : "FitBeat",
    "LinkinParkEnvironment" : "Linkin Park",
    "BTSEnvironment" : "BTS",
    "GlassDesertEnvironment" : "Origins"
}
const colorScheme = {
    "The First": {
        "_colorLeft": "#c81414",
        "_colorRight": "#0074d2",
        "_envColorLeft": "#c81414",
        "_envColorRight": "#3098ff",
        "_obstacleColor": "#ff3030"
    },
    "Origins": {
        "_colorLeft": "#ad9200",
        "_colorRight": "#b40089",
        "_envColorLeft": "#396c87",
        "_envColorRight": "#0b9fe7",
        "_obstacleColor": "#0b4865"
    },
    "KDA": {
        "_colorLeft": "#a84028",
        "_colorRight": "#801492",
        "_envColorLeft": "#ff643c",
        "_envColorRight": "#c220dd",
        "_obstacleColor": "#ff643c"
    },
    "Crab Rave": {
        "_colorLeft": "#00b614",
        "_colorRight": "#0b81bb",
        "_envColorLeft": "#20c124",
        "_envColorRight": "#0b9ee6",
        "_obstacleColor": "#00cf14"
    },
    "Noir": {
        "_colorLeft": "#2c2c2c",
        "_colorRight": "#989898",
        "_envColorLeft": "#686868",
        "_envColorRight": "#9a9a9a",
        "_obstacleColor": "#3c3c3c"
    },
    "Rocket": {
        "_colorLeft": "#ff7f00",
        "_colorRight": "#0088ff",
        "_envColorLeft": "#ac5d3c",
        "_envColorRight": "#309eff",
        "_obstacleColor": "#509cb9"
    },
    "Green Day": {
        "_colorLeft": "#40c800",
        "_colorRight": "#00b6ab",
        "_envColorLeft": "#00b6ab",
        "_envColorRight": "#40c800",
        "_obstacleColor": "#00cf14"
    },
    "Timbaland": {
        "_colorLeft": "#808080",
        "_colorRight": "#0080ff",
        "_envColorLeft": "#0080ff",
        "_envColorRight": "#0080ff",
        "_obstacleColor": "#808080"
    },
    "FitBeat": {
        "_colorLeft": "#cc9b24",
        "_colorRight": "#ca28ae",
        "_envColorLeft": "#664646",
        "_envColorRight": "#464666",
        "_obstacleColor": "#464666"
    },
    "Linkin Park": {
        "_colorLeft": "#a92a2b",
        "_colorRight": "#63848e",
        "_envColorLeft": "#c0ac97",
        "_envColorRight": "#9fb0b5",
        "_envColorLeftBoost": "#eb9841",
        "_envColorRightBoost": "#48759f",
        "_obstacleColor": "#a92a2c"
    },
    "BTS": {
        "_colorLeft": "#ff1768",
        "_colorRight": "#cc00c0",
        "_envColorLeft": "#c82080",
        "_envColorRight": "#b120dd",
        "_envColorLeftBoost": "#e68aff",
        "_envColorRightBoost": "#e68aff",
        "_obstacleColor": "#ab2e8d"
    }
}

function toMMSS(num) {
    if (num == 0) return "0:00";
    let numr = Math.round(num);
    let min = Math.floor(numr / 60);
    let sec = numr % 60;
    return `${min}:${(sec > 9) ? sec : `0${sec}`}`;
}

function fromMsToSS(num) {
    return num / 1000;
}

function toRealTime(beat) {
    return beat / mapInfo._beatsPerMinute * 60;
}

function toBeatTime(num) {
    return num * mapInfo._beatsPerMinute / 60;
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

// just to make rounding easier
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
        if (arg2 == '') return '';
        return `<b>${arg1}</b>: ${arg2}`
    }
    if (arg2.length == 0) return '';
    if (arg1.search(/\[\]/g) != -1 && arg2.length > 0) arg1 = arg1.replaceAll(/\[\]/g, `[${arg2.length}]`);
    return `<b>${arg1}</b>: ${arg2.join(', ')}`
}

function tolMax(t, tol) {
    return toRealTime(t) < tol;
}

function tolMin(t, tol) {
    return toRealTime(t) > tol;
}

function compToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
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
