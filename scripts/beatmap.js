/* BEATMAP SCRIPT - beatmap.js
    load map and handle map related variable */

async function loadMap(mapZip) {
    UILoadingStatus('info', 'Loading map info...', 0);
    console.log('loading map info');
    let infoFile = mapZip.file('Info.dat') || mapZip.file('info.dat');
    if (infoFile) {
        $('.settings').prop('disabled', true);
        let infoFileStr = await infoFile.async('string');
        map.info = await JSON.parse(infoFileStr);

        UIUpdateMapInfo();
        if (map.url !== null) {
            if (map.id !== null) {
                $('#map-link').text(`${map.id}`);
            } else {
                $('#map-link').text('Download Link');
            }
            $('#map-link').attr('href', map.url).css('display', 'block');
        }
        mapUpdateBPMRange(map.info._beatsPerMinute, map.info._beatsPerMinute);

        // load cover image
        UILoadingStatus('info', 'Loading cover image...', 10.4375);
        console.log('loading cover image');
        let imageFile = mapZip.file(map.info._coverImageFilename);
        if (imageFile) {
            let imgBase64 = await imageFile.async('base64');
            $('#coverimg').attr('src', 'data:image;base64,' + imgBase64);
            flag.map.load.image = true;
        } else {
            console.error(`${map.info._coverImageFilename} does not exists.`);
        }

        // load audio
        UILoadingStatus('info', 'Loading audio...', 20.875);
        console.log('loading audio');
        let audioFile = mapZip.file(map.info._songFilename);
        if (!flag.noAudio && audioFile) {
            let audioBuffer = await audioFile.async('arraybuffer');
            let audioContext = new AudioContext();
            await audioContext
                .decodeAudioData(audioBuffer)
                .then(function (buffer) {
                    map.audio.duration = buffer.duration;
                    $('#song-duration').text(toMMSS(map.audio.duration));
                    flag.map.load.audio = true;
                })
                .catch(function (err) {
                    console.error(err);
                });
        } else {
            console.error(`${map.info._songFilename} does not exist.`);
        }

        // load diff map
        UILoadingStatus('info', 'Loading difficulty...', 70);
        map.set = map.info._difficultyBeatmapSets;
        for (let i = map.set.length - 1; i >= 0; i--) {
            let mapDiff = map.set[i]._difficultyBeatmaps;
            if (mapDiff.length === 0 || !mapDiff) {
                // how?
                console.error('Empty difficulty set, removing...');
                map.set.splice(i, 1);
                continue;
            }

            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let diffFile = mapZip.file(diff._beatmapFilename);
                if (diffFile) {
                    console.log(`loading ${map.set[i]._beatmapCharacteristicName} ${diff._difficulty}`);
                    let diffFileStr = await diffFile.async('string');
                    map.set[i]._difficultyBeatmaps[j]._data = loadDifficulty(diff._beatmapFilename, diffFileStr);
                } else {
                    console.error(
                        `Missing ${diff._beatmapFilename} file for ${map.set[i]._beatmapCharacteristicName} ${diff._difficulty}, ignoring.`
                    );
                    map.set[i]._difficultyBeatmaps.splice(j, 1);
                    if (map.set[i]._difficultyBeatmaps.length < 1) {
                        console.error(`${map.set[i]._beatmapCharacteristicName} difficulty set now empty, ignoring.`);
                        map.set.splice(i, 1);
                        continue;
                    }
                }
            }
        }

        // create & update UI
        // could prolly had done this on previous so i dont have to re-loop
        // but i need it to be sorted specifically
        UIPopulateCharSelect();
        UILoadingStatus('info', 'Adding map difficulty stats...', 80);
        console.log('adding map stats');
        for (let i = 0, len = map.set.length; i < len; i++) {
            let mapDiff = map.set[i]._difficultyBeatmaps;
            await UICreateDiffSet(map.set[i]._beatmapCharacteristicName);
            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                await UICreateDiffInfo(map.set[i]._beatmapCharacteristicName, diff);
            }
        }

        UILoadingStatus('info', 'Analysing map...', 85);
        console.log('analysing map');
        analyseMap();

        UILoadingStatus('info', 'Analysing difficulty...', 90);
        for (let i = 0, len = map.set.length; i < len; i++) {
            let mapDiff = map.set[i]._difficultyBeatmaps;
            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let mapObj = {
                    mapSet: map.set[i]._beatmapCharacteristicName,
                };
                mapObj.diff = diff._difficulty;
                mapObj.text = await analyseDifficulty(map.set[i]._beatmapCharacteristicName, diff);
                map.analysis.diff.push(mapObj);
            }
        }
        UIOutputDisplay(tool.select.char, tool.select.diff);

        $('#slowslider-min-prec').val(round(1 / toBeatTime(tool.minSliderSpeed), 2));
        $('#shrangle-max-prec').val(round(1 / toBeatTime(tool.maxShrAngle), 2));
        $('#speedpause-max-prec').val(round(1 / toBeatTime(tool.maxSpeedPause), 2));
        $('#vb-min-beat').val(round(toBeatTime(tool.vb.min), 3));
        $('#vb-max-beat').val(round(toBeatTime(tool.vb.max), 3));
        $('#apply-this').prop('disabled', false);
        $('#apply-all').prop('disabled', false);
        $('.settings').prop('disabled', false);
        flag.loaded = true;
        UILoadingStatus('info', 'Map successfully loaded!');
    } else {
        throw new Error("Couldn't find Info.dat");
    }
}

function loadDifficulty(diffFile, str) {
    let diff = JSON.parse(str);

    // null error handling while parsing map
    diff._notes.forEach((note) => {
        for (const x in note) {
            if (note[x] === null || note[x] === undefined) {
                throw new Error(`${diffFile} contain null or undefined value in _notes object`);
            }
        }
    });
    diff._obstacles.forEach((note) => {
        for (const x in note) {
            if (note[x] === null || note[x] === undefined) {
                throw new Error(`${diffFile} contain null or undefined value in _obstacles object`);
            }
        }
    });
    diff._events.forEach((note) => {
        for (const x in note) {
            if (note[x] === null || note[x] === undefined) {
                throw new Error(`${diffFile} contain null or undefined value in _events object`);
            }
        }
    });

    // sort map in-case of some fucky wucky
    diff._notes.sort(function (a, b) {
        return a._time - b._time;
    });
    diff._obstacles.sort(function (a, b) {
        return a._time - b._time;
    });
    // not gonna sort event, going to assume event is always sorted because it'll take way too long to load multiple big event map

    if (diff._customData) {
        // TODO: need to find ways to convert object key to lowercase for compatibility and less pepega
        let customData = diff._customData,
            BPMChanges;
        if (customData._BPMChanges) {
            BPMChanges = customData._BPMChanges;
        } else if (customData._bpmChanges) {
            BPMChanges = customData._bpmChanges;
        }
        if (BPMChanges && BPMChanges.length > 0) {
            let curMinBPM = map.info._beatsPerMinute,
                curMaxBPM = map.info._beatsPerMinute;
            for (let i = 0, len = BPMChanges.length; i < len; i++) {
                if (BPMChanges[i]._BPM < curMinBPM) {
                    curMinBPM = BPMChanges[i]._BPM;
                } else if (BPMChanges[i]._BPM > curMaxBPM) {
                    curMaxBPM = BPMChanges[i]._BPM;
                } else if (BPMChanges[i]._bpm < curMinBPM) {
                    curMinBPM = BPMChanges[i]._bpm;
                } else if (BPMChanges[i]._bpm > curMaxBPM) {
                    curMaxBPM = BPMChanges[i]._bpm;
                }
                if (!flag.map.bpm.change) {
                    map.bpm.change.push(BPMChanges[i]);
                }
            } // TODO: actually write proper BPM change check between diff rather than based on min, max value lol
            if (flag.map.bpm.change && (map.bpm.min !== curMinBPM || map.bpm.max !== curMaxBPM)) {
                flag.map.bpm.odd = true;
            } else if (map.bpm.min > curMinBPM || map.bpm.max < curMaxBPM) {
                flag.map.bpm.change = true;
            }
            mapUpdateBPMRange(curMinBPM, curMaxBPM);
            UIUpdateMapInfoBPM(map.bpm.min, map.bpm.max);
        }
    }

    if (diff._notes.length > 0 || diff._obstacles.length > 0) {
        diff._duration = getLastInteractiveTime(diff, map.info._beatsPerMinute);
        if (!flag.map.load.audio) {
            calcMapDuration(diff._notes, diff._obstacles, map.info._beatsPerMinute);
        }
    }
    return diff;
}

async function analyseMap() {
    map.analysis.sps.sort();
    const arrText = [];
    if (flag.noAudio) {
        arrText.push(
            printHTMLBold('No audio loaded', flag.noAudio ? 'No audio mode is enabled' : 'Could not be loaded or not found')
        );
    }
    if (!flag.map.load.image) {
        arrText.push(printHTMLBold('No cover image', 'Could not be loaded or not found'));
    }
    if (map.info._previewStartTime === 12 && map.info._previewDuration === 10) {
        arrText.push(printHTMLBold('Default preview time', "please set them where you want audience's 1st impression"));
    }
    if (map.analysis.missing?.chroma) {
        arrText.push(printHTMLBold('Missing suggestion', 'Chroma'));
    }
    if (map.analysis.sps.length > 0) {
        if (
            flag.map.load.audio &&
            map.audio.duration < 240 &&
            Math.min(map.analysis.sps) > (map.audio.duration < 120 ? 3.2 : 4.2) &&
            getSPSTotalPercDrop() < 60
        ) {
            console.log(map.analysis.sps);
            arrText.push(
                printHTMLBold(
                    `Minimum SPS not met (<${map.audio.duration < 120 ? '3.2' : '4.2'})`,
                    `lowest is ${Math.min(map.analysis.sps)}`
                )
            );
        }
        if (getSPSMaxPercDrop() > 40 && map.audio.duration < 240) {
            arrText.push(printHTMLBold('Violates progression criteria', `SPS has exceeded 40% drop`));
        }
        if (getSPSMinPercDrop() < 10 && map.audio.duration < 240) {
            arrText.push(printHTMLBold('Violates progression criteria', `SPS has less than 10% drop`));
        }
    }
    $('#output-map').html(arrText.join('<br>'));
    if (!arrText.length > 0) {
        $('#output-map').html('No issue(s) found.');
    }
}
function getSPSMaxPercDrop() {
    let spsPerc = 0;
    let spsCurr = 0;
    map.analysis.sps.forEach((sps) => {
        if (spsCurr > 0 && sps > 0) {
            spsPerc = Math.max(spsPerc, (1 - spsCurr / sps) * 100);
        }
        spsCurr = sps > 0 ? sps : spsCurr;
    });
    return spsPerc;
}
function getSPSMinPercDrop() {
    let spsPerc = Number.MAX_SAFE_INTEGER;
    let spsCurr = 0;
    map.analysis.sps.forEach((sps) => {
        if (spsCurr > 0 && sps > 0) {
            spsPerc = Math.min(spsPerc, (1 - spsCurr / sps) * 100);
        }
        spsCurr = sps > 0 ? sps : spsCurr;
    });
    return spsPerc;
}
function getSPSTotalPercDrop() {
    let spsPerc = Number.MAX_SAFE_INTEGER;
    let highest = null;
    let lowest = null;
    map.analysis.sps.forEach((sps) => {
        if (spsCurr > 0 && sps > 0) {
            spsPerc = Math.min(spsPerc, (1 - spsCurr / sps) * 100);
        }
    });
    return highest || (highest && lowest) ? (1 - lowest / highest) * 100 : 0;
}
async function analyseDifficulty(charName, diff) {
    console.log(`analysing ${charName} ${diff._difficulty}`);
    let diffLabel = null;
    let offset = 0;
    if (diff._customData) {
        if (diff._customData._editorOffset) {
            offset = diff._customData._editorOffset / 1000;
        }
        if (diff._customData._difficultyLabel) {
            diffLabel = diff._customData._difficultyLabel;
        }
    }
    let BPMChanges;
    if (diff._data._customData) {
        if (diff._data._customData._BPMChanges) {
            BPMChanges = diff._data._customData._BPMChanges;
        } else if (diff._data._customData._bpmChanges) {
            BPMChanges = diff._data._customData._bpmChanges;
        }
    }
    const startTime = getFirstInteractiveTime(diff._data, map.info._beatsPerMinute);
    const mapSettings = {
        charName: charName,
        diffName: diff._difficulty,
        bpm: map.info._beatsPerMinute,
        bpmc: getBPMChangesTime(map.info._beatsPerMinute, offset, BPMChanges),
        offset: offset,
        njs: diff._noteJumpMovementSpeed,
        njsOffset: diff._noteJumpStartBeatOffset,
    };
    mapSettings.hjd = getHalfJumpDuration(mapSettings);

    const arrText = [];
    if (diffLabel !== null) {
        let status = checkLabelLength(charName, diffLabel);
        if (status === 'error') {
            arrText.push(printHTMLBold('Difficulty label too long', 'exceeded in-game display support'));
        } else if (status === 'warn') {
            arrText.push(
                printHTMLBold(
                    'Difficulty label possibly too long',
                    'may exceed in-game display support, check in-game to be sure'
                )
            );
        }
    }
    if (startTime < 1.5) {
        arrText.push(printHTMLBold('Hot start', `${round(startTime, 2)}s`));
    }
    if (countEventLightLess(diff._data._events) < 10) {
        arrText.push(printHTMLBold('Lack of lighting events', '(<=10 events)'));
    }
    arrText.push(printHTMLBold(`>${tool.ebpm.th}EBPM warning []`, getEffectiveBPMTime(diff._data, mapSettings)));
    arrText.push(
        printHTMLBold(`>${tool.ebpm.thSwing}EBPM (swing) warning []`, getEffectiveBPMSwingTime(diff._data, mapSettings))
    );

    arrText.push(printHTMLBold('Note(s) before start time', findOutStartNote(diff._data, mapSettings)));
    arrText.push(printHTMLBold('Obstacle(s) before start time', findOutStartObstacle(diff._data, mapSettings)));
    arrText.push(printHTMLBold('Event(s) before start time', findOutStartEvent(diff._data, mapSettings)));
    if (flag.map.load.audio) {
        arrText.push(printHTMLBold('Note(s) after end time', findOutEndNote(diff._data, mapSettings)));
        arrText.push(printHTMLBold('Obstacle(s) after end time', findOutEndObstacle(diff._data, mapSettings)));
        arrText.push(printHTMLBold('Event(s) after end time', findOutEndEvent(diff._data, mapSettings)));
    }

    arrText.push(printHTMLBold('Zero width/duration obstacle []', detectZeroObstacle(diff._data, mapSettings)));
    arrText.push(printHTMLBold('Invalid obstacle []', detectInvalidObstacle(diff._data, mapSettings)));
    arrText.push(printHTMLBold('Negative obstacle []', detectNegativeObstacle(diff._data, mapSettings)));
    arrText.push(printHTMLBold('2-center obstacle []', detectCenterObstacle(diff._data, mapSettings)));
    arrText.push(printHTMLBold('<15ms obstacle []', detectShortObstacle(diff._data, mapSettings)));
    // arr.push(printHTMLBold('Crouch obstacle []', detectCrouchObstacle(diff._data, mapSettings)));

    arrText.push(printHTMLBold('Invalid note []', detectInvalidNote(diff._data, mapSettings)));
    if (flag.tool.dd) {
        arrText.push(printHTMLBold('Double-directional []', detectDoubleDirectional(diff._data, mapSettings)));
    }
    if (flag.tool.vbNote) {
        arrText.push(printHTMLBold('Vision blocked []', detectVisionBlock(diff._data, mapSettings)));
    }
    arrText.push(printHTMLBold('Stacked note []', detectStackedNote(diff._data, mapSettings)));
    arrText.push(printHTMLBold('Stacked bomb (<20ms) []', detectStackedBomb(diff._data, mapSettings)));
    if (tool.beatPrec.length > 0) {
        arrText.push(printHTMLBold('Off-beat precision []', detectOffPrecision(diff._data, mapSettings)));
    }
    if (flag.tool.hbStaircase) {
        arrText.push(printHTMLBold('Hitbox staircase []', detectHitboxStaircase(diff._data, mapSettings)));
    }
    arrText.push(printHTMLBold('Improper window snap []', detectImproperWindowSnap(diff._data, mapSettings)));
    if (flag.tool.slowSlider) {
        arrText.push(
            printHTMLBold(`Slow slider (>${tool.minSliderSpeed * 1000}ms) []`, detectSlowSlider(diff._data, mapSettings))
        );
    }
    if (flag.tool.shrAngle) {
        arrText.push(printHTMLBold('Shrado angle []', detectShrAngle(diff._data, mapSettings)));
    }
    if (flag.tool.speedPause) {
        arrText.push(printHTMLBold('Speed pause []', detectSpeedPause(diff._data, mapSettings)));
    }
    return arrText.filter(function (x) {
        return x !== '';
    });
}

// fallback if audio loading didnt work
function calcMapDuration(notes, obstacles, bpm) {
    let lastNoteTime = (notes[notes.length - 1]._time / bpm) * 60 || 0;
    let lastObstacleTime = 0;
    for (let i = obstacles.length - 1; i >= 0; i--) {
        lastObstacleTime = Math.max(lastObstacleTime, ((obstacles[i]._time + obstacles[i]._duration) / bpm) * 60);
    }
    let dur = Math.max(lastNoteTime, lastObstacleTime);

    if (!map.audio.duration) {
        map.audio.duration = dur;
    } else if (map.audio.duration < dur) {
        map.audio.duration = dur;
    }
    $('#song-duration').text(`${toMMSS(map.audio.duration)} ⚠️ no audio, using map duration`);
}

function mapUpdateBPMRange(min, max) {
    if (!map.bpm.min || !map.bpm.max) {
        map.bpm.min = min;
        map.bpm.max = max;
    }
    if (min < map.bpm.min) {
        map.bpm.min = min;
    }
    if (max > map.bpm.max) {
        map.bpm.max = max;
    }
}
