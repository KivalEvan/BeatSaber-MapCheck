 /* GLOBAL SCRIPT - global.js
    is it really a script if it's just holding a global variable? */

const watermark = 'Kival Evan#5480';
const version = 'v1.3.0';

const flag = {
    loading: false,
    loaded: false,
    map: {
        load: {
            image: false,
            audio: false
        },
        bpm: {
            change: false,
            odd: false
        },
    },
    tool: {
        dd: true,
        hb: {
            staircase: true
        },
        vb: {
            note: true
        },
        shrAngle: false,
        speedPause: true
    }
}

const tool = {
    select: {
        char: '',
        diff: ''
    },

    // effective bpm
    ebpm: {
        th: 450,
        thSwing: 350
    },

    // beat precision
    beatPrec: [4, 3],

    // vision block
    vb: {
        min: 0.1,
        max: 0.5
    },

    // misc
    maxShrAngle: 0.175,
    maxSpeedPause: 0.125,

    // part where no one can control... yet
    stack: 0.01,
    swing: {
        maxTol: 0.07,
        maxWindowTol: 0.08
    },
    hitbox: {
        staircase: 0.15
    },
    obstacle: {
        minDur: 0.015,
        recovery: 0.1
    }
}

const map = {
    info: null,
    set: null,
    bpm: {
        change: [],
        min: null,
        max: null
    },
    analysis: [],
    audio: {
        dur: 0
    }
}

const noteCutAngle = [
    0,      // 0
    180,    // 1
    270,    // 2
    90,     // 3
    315,    // 4
    45,     // 5
    225,    // 6
    135,    // 7
    0       // 8
]

const flipCutDir = [
    1,      // 0
    0,      // 1
    3,      // 2
    2,      // 3
    7,      // 4
    6,      // 5
    5,      // 6
    4,      // 7
    8       // 8
]

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
    "ExpertPlus": "Expert+"
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