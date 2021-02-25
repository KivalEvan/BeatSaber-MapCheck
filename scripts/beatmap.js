 /* BEATMAP SCRIPT - beatmap.js
    load map and handle map related variable */

async function loadMap(mapZip) {
    UILoadingStatus('info', 'Loading map info...', 0);
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
        }
        else console.error(map.info._coverImageFilename + ' does not exists.');
        
        // load audio
        UILoadingStatus('info', 'Loading audio...', 20.875);
        console.log('loading audio');
        let audioFile = mapZip.file(map.info._songFilename);
        if (audioFile) {
            let audioBuffer = await audioFile.async('arraybuffer');
            let audioContext = new AudioContext();
            await audioContext.decodeAudioData(audioBuffer)
            .then(function(buffer) {
                map.audio.duration = buffer.duration;
                $('#song-duration').text(toMMSS(map.audio.duration));
                flag.map.load.audioAudio = true;
            })
            .catch(function(err) {
                console.error(err);
            });
        }
        else console.error(map.info._songFilename + ' does not exist.');

        // load diff map
        UILoadingStatus('info', 'Loading difficulty...', 70);
        console.log('loading difficulty');
        map.set = map.info._difficultyBeatmapSets;
        for (let i = map.set.length - 1; i >= 0; i--) {
            let mapDiff = map.set[i]._difficultyBeatmaps;
            if (mapDiff.length === 0 || !mapDiff) { // how?
                console.error('Empty difficulty set, removing...');
                map.set.splice(i, 1);
                continue;
            }

            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let diffFile = mapZip.file(diff._beatmapFilename);
                if (diffFile) {
                    let diffFileStr = await diffFile.async('string');
                    map.set[i]._difficultyBeatmaps[j]._data = loadDifficulty(diffFileStr);
                }
                else {
                    console.error('Missing ' + diff._beatmapFilename + ' file for ' + map.set[i]._beatmapCharacteristicName + ' ' + diff._difficulty + ', ignoring.');
                    map.set[i]._difficultyBeatmaps.splice(j, 1);
                    if (map.set[i]._difficultyBeatmaps.length < 1) {
                        console.error(map.set[i]._beatmapCharacteristicName + ' difficulty set now empty, ignoring.')
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
        
        UILoadingStatus('info', 'Analysing map difficulty...', 90);
        for (let i = 0, len = map.set.length; i < len; i++) {
            let mapDiff = map.set[i]._difficultyBeatmaps;
            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let mapObj = {
                    mapSet: map.set[i]._beatmapCharacteristicName
                }
                mapObj.diff = diff._difficulty;
                mapObj.text = await mapTool(map.set[i]._beatmapCharacteristicName, diff);
                map.analysis.push(mapObj);
            }
        }
        UIOutputDisplay(tool.select.char, tool.select.diff);

        $('#shrangle-max-beat').val(round(toBeatTime(tool.maxShrAngle), 3));
        $('#speedpause-max-beat').val(round(toBeatTime(tool.maxSpeedPause), 3));
        $('#vb-min-beat').val(round(toBeatTime(tool.vb.min), 3));
        $('#vb-max-beat').val(round(toBeatTime(tool.vb.max), 3));
        $('#apply-this').prop('disabled', false);
        $('#apply-all').prop('disabled', false);
        $('.settings').prop('disabled', false);
        flag.loaded = true;
        UILoadingStatus('info', 'Map successfully loaded!');
    }
    else {
        UILoadingStatus('info', 'Couldn\'t find Info.dat, try again', 0);
    }
}

// TODO: filter invalid note & obstacle
function loadDifficulty(str) {
    let diff = JSON.parse(str);

    // sort map in-case of some fucky wucky
    diff._notes.sort(function(a,b) {
        return a._time - b._time;
    });
    diff._obstacles.sort(function(a,b) {
        return a._time - b._time;
    });
    // not gonna sort event, going to assume event is always sorted because it'll take way too long to load multiple big event map

    if (diff._customData) { // TODO: need to find ways to convert object key to lowercase for compatibility and less pepega
        let customData = diff._customData, BPMChanges;
        if (customData._BPMChanges) BPMChanges = customData._BPMChanges;
        else if (customData._bpmChanges) BPMChanges = customData._bpmChanges;
        if (BPMChanges && BPMChanges.length > 0) {
            let curMinBPM = map.info._beatsPerMinute, curMaxBPM = map.info._beatsPerMinute;
            for (let i = 0, len = BPMChanges.length; i < len; i++) {
                if (BPMChanges[i]._BPM < curMinBPM) curMinBPM = BPMChanges[i]._BPM;
                else if (BPMChanges[i]._BPM > curMaxBPM) curMaxBPM = BPMChanges[i]._BPM;
                else if (BPMChanges[i]._bpm < curMinBPM) curMinBPM = BPMChanges[i]._bpm;
                else if (BPMChanges[i]._bpm > curMaxBPM) curMaxBPM = BPMChanges[i]._bpm;
                if (!flag.map.bpm.change) map.bpm.change.push(BPMChanges[i]);
            } // TODO: actually write proper BPM change check between diff rather than based on min, max value lol
            if (flag.map.bpm.change && (map.bpm.min !== curMinBPM || map.bpm.max !== curMaxBPM)) flag.map.bpm.odd = true;
            else if (map.bpm.min > curMinBPM || map.bpm.max < curMaxBPM) flag.map.bpm.change = true;
            mapUpdateBPMRange(curMinBPM, curMaxBPM);
            UIUpdateMapInfoBPM(map.bpm.min, map.bpm.max);
        }
    }

    if (diff._notes.length > 0 || diff._obstacles.length > 0) {
        diff._duration = getLastInteractiveTime(diff, map.info._beatsPerMinute);
        if (!flag.map.load.audioAudio) calcMapDuration(diff._notes, diff._obstacles, map.info._beatsPerMinute);
    }
    return diff;
}

async function mapTool(charName, diff) {
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
        if (diff._data._customData._BPMChanges) BPMChanges = diff._data._customData._BPMChanges;
        else if (diff._data._customData._bpmChanges) BPMChanges = diff._data._customData._bpmChanges;
    }
    const startTime = getFirstInteractiveTime(diff._data, map.info._beatsPerMinute);

    const mapSettings = {
        bpm: map.info._beatsPerMinute,
        bpmc: getBPMChangesTime(map.info._beatsPerMinute, offset, BPMChanges),
        offset: offset,
        njs: diff._noteJumpMovementSpeed,
        njsOffset: diff._noteJumpStartBeatOffset
    }

    let arr = [];
    console.log('analysing', charName, diff._difficulty);
    if (diffLabel !== null) {
        let status = checkLabelLength(charName, diffLabel);
        if (status === 'error') arr.push(printHTMLBold('Difficulty label too long', 'exceeded in-game display support'));
        if (status === 'warn') arr.push(printHTMLBold('Difficulty label possibly too long', 'may exceed in-game display support, check in-game to be sure'));
    }
    if (startTime < 1.5) arr.push(printHTMLBold('Hot start', `${round(startTime, 2)}s`));
    if (countEventLight10(diff._data._events) < 10) arr.push(printHTMLBold('Lack of lighting events', '(<=10 events)'));
    arr.push(printHTMLBold(`>${tool.ebpm.th}EBPM warning []`, getEffectiveBPMTime(diff._data, mapSettings)));
    arr.push(printHTMLBold(`>${tool.ebpm.thSwing}EBPM (swing) warning []`, getEffectiveBPMSwingTime(diff._data, mapSettings)));

    arr.push(printHTMLBold('Note(s) before start time', findOutStartNote(diff._data, mapSettings)));
    if (flag.map.load.audio) arr.push(printHTMLBold('Note(s) after end time', findOutEndNote(diff._data, mapSettings)));
    arr.push(printHTMLBold('Event(s) before start time', findOutStartEvent(diff._data, mapSettings)));
    if (flag.map.load.audio) arr.push(printHTMLBold('Event(s) after end time', findOutEndEvent(diff._data, mapSettings)));
    arr.push(printHTMLBold('Obstacle(s) before start time', findOutStartObstacle(diff._data, mapSettings)));
    if (flag.map.load.audio) arr.push(printHTMLBold('Obstacle(s) after end time', findOutEndObstacle(diff._data, mapSettings)));

    arr.push(printHTMLBold('Zero width/duration obstacle []', detectZeroObstacle(diff._data, mapSettings)));
    arr.push(printHTMLBold('Invalid obstacle []', detectInvalidObstacle(diff._data, mapSettings)));
    arr.push(printHTMLBold('Negative obstacle []', detectNegativeObstacle(diff._data, mapSettings)));
    arr.push(printHTMLBold('2-center obstacle []', detectCenterObstacle(diff._data, mapSettings)));
    arr.push(printHTMLBold('<15ms obstacle []', detectShortObstacle(diff._data, mapSettings)));
    // arr.push(printHTMLBold('Crouch obstacle []', detectCrouchObstacle(diff._data, mapSettings)));

    if (flag.tool.dd) arr.push(printHTMLBold('Double-directional []', detectDoubleDirectional(diff._data, mapSettings)));
    if (flag.tool.vb.note) arr.push(printHTMLBold('Vision blocked []', detectVisionBlock(diff._data, mapSettings)));
    arr.push(printHTMLBold('Stacked note []', detectStackedNote(diff._data, mapSettings)));
    arr.push(printHTMLBold('Stacked bomb (<20ms) []', detectStackedBomb(diff._data, mapSettings)));
    if (tool.beatPrec.length > 0) arr.push(printHTMLBold('Off-beat precision []', detectOffPrecision(diff._data, mapSettings)));
    if (flag.tool.hb.staircase) arr.push(printHTMLBold('Hitbox staircase []', detectHitboxStaircase(diff._data, mapSettings)));
    if (flag.tool.shrAngle) arr.push(printHTMLBold('Shrado angle []', detectShrAngle(diff._data, mapSettings)));
    if (flag.tool.speedPause) arr.push(printHTMLBold('Speed pause []', detectSpeedPause(diff._data, mapSettings)));
    let html = arr.filter(function(x) {
        return x !== '';
    });
    return html;
}

// fallback if audio loading didnt work
function calcMapDuration(notes, obstacles, bpm) {
    let lastNoteTime = notes[notes.length - 1]._time / bpm * 60 || 0;
    let lastObstacleTime = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        lastObstacleTime = Math.max(lastObstacleTime, (obstacles[i]._time + obstacles[i]._duration) / bpm * 60);
    let dur = Math.max(lastNoteTime, lastObstacleTime);

    if (!map.audio.duration) map.audio.duration = dur;
    else if (map.audio.duration < dur) map.audio.duration = dur;
    $('#song-duration').text(`${toMMSS(map.audio.duration)} ⚠️ no audio, using map duration`);
}

function mapUpdateBPMRange(min, max) {
    if (!map.bpm.min || !map.bpm.max) map.bpm.min = min, map.bpm.max = max;
    if (min < map.bpm.min) map.bpm.min = min;
    if (max > map.bpm.max) map.bpm.max = max;
}
