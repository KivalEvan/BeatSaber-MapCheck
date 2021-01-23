 /* BEATMAP SCRIPT - beatmap.js
    load map and handle map related variable */

let mapInfo, mapDiffSet, mapAnalysis = [];
let mapBPMChange = [], mapMinBPM, mapMaxBPM;
let songDuration;

async function loadMap(mapZip) {
    UILoadingStatus(0, 'Loading map info...');
    let infoFile = mapZip.file('Info.dat') || mapZip.file('info.dat');
    if (infoFile) {
        $('.settings').prop('disabled', true);
        let infoFileStr = await infoFile.async('string');
        mapInfo = await JSON.parse(infoFileStr);
        
        UIUpdateMapInfo();
        mapUpdateBPMRange(mapInfo._beatsPerMinute, mapInfo._beatsPerMinute);

        // load cover image
        UILoadingStatus(10.4375, 'Loading cover image...');
        console.log('Loading image');
        let imageFile = mapZip.file(mapInfo._coverImageFilename);
        if (imageFile) {
            let imgBase64 = await imageFile.async('base64');
            $('#coverimg').attr('src', 'data:image;base64,' + imgBase64);
        }
        else console.error(mapInfo._coverImageFilename + ' does not exists.');
        
        // load audio
        UILoadingStatus(20.875, 'Loading audio...');
        console.log('Loading audio');
        let audioFile = mapZip.file(mapInfo._songFilename);
        if (audioFile) {
            let audioBuffer = await audioFile.async('arraybuffer');
            let audioContext = new AudioContext();
            await audioContext.decodeAudioData(audioBuffer)
            .then(function(buffer) {
                songDuration = buffer.duration;
                $('#songduration').text(toMMSS(buffer.duration));
                flagLoadAudio = true;
            })
            .catch(function(err) {
                console.error(err);
            });
        }
        else console.error(mapInfo._songFilename + ' does not exist.');

        // load diff map
        UILoadingStatus(70, 'Loading difficulty...');
        console.log('Loading difficulty');
        mapDiffSet = mapInfo._difficultyBeatmapSets;
        for (let i = mapDiffSet.length - 1; i >= 0; i--) {
            let mapDiff = mapDiffSet[i]._difficultyBeatmaps;
            if (mapDiff.length === 0 || !mapDiff) { // how?
                console.error('Empty difficulty set, removing...');
                mapDiffSet.splice(i, 1);
                continue;
            }

            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let diffFile = mapZip.file(diff._beatmapFilename);
                if (diffFile) {
                    let diffFileStr = await diffFile.async('string');
                    mapDiffSet[i]._difficultyBeatmaps[j]['_data'] = loadDifficulty(diffFileStr);
                }
                else {
                    console.error('Missing ' + diff._beatmapFilename + ' file for ' + mapDiffSet[i]._beatmapCharacteristicName + ' ' + diff._difficulty + ', ignoring.');
                    mapDiffSet[i]._difficultyBeatmaps.splice(j, 1);
                    if (mapDiffSet[i]._difficultyBeatmaps.length < 1) {
                        console.error(mapDiffSet[i]._beatmapCharacteristicName + ' difficulty set now empty, ignoring.')
                        mapDiffSet.splice(i, 1);
                        continue;
                    }
                }
            }
        }

        // create & update UI
        // could prolly had done this on previous so i dont have to re-loop
        // but i need it to be sorted specifically
        UIPopulateCharSelect();
        UILoadingStatus(80, 'Adding map difficulty stats...');
        console.log('Adding map stats');
        for (let i = 0, len = mapDiffSet.length; i < len; i++) {
            let mapDiff = mapDiffSet[i]._difficultyBeatmaps;
            await UIcreateDiffSet(mapDiffSet[i]._beatmapCharacteristicName);
            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                await UIcreateDiffInfo(mapDiffSet[i]._beatmapCharacteristicName, diff);
            }
        }
        
        UILoadingStatus(90, 'Analysing map difficulty...');
        for (let i = 0, len = mapDiffSet.length; i < len; i++) {
            let mapDiff = mapDiffSet[i]._difficultyBeatmaps;
            for (let j = mapDiff.length - 1; j >= 0; j--) {
                let diff = mapDiff[j];
                let mapObj = {
                    mapSet: mapDiffSet[i]._beatmapCharacteristicName
                }
                mapObj.diff = diff._difficulty;
                mapObj.text = await mapTool(mapDiffSet[i]._beatmapCharacteristicName, diff);
                mapAnalysis.push(mapObj);
            }
        }
        UIOutputDisplay(charSelect, diffSelect);

        $('#shranglemaxbeat').val(round(toBeatTime(shrAngleMax), 3));
        $('#vblockminbeat').val(round(toBeatTime(vBlockMin), 3));
        $('#vblockmaxbeat').val(round(toBeatTime(vBlockMax), 3));
        $('#applythis').prop('disabled', false);
        $('#applyall').prop('disabled', false);
        $('.settings').prop('disabled', false);
        flagLoaded = true;
        UILoadingStatus(100, 'Map successfully loaded!');
    }
    else {
        alert('Could not find Info.dat file.');
        UILoadingStatus(0, 'No map loaded');
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
            let curMinBPM = mapInfo._beatsPerMinute, curMaxBPM = mapInfo._beatsPerMinute;
            for (let i = 0, len = BPMChanges.length; i < len; i++) {
                if (BPMChanges[i]._BPM < curMinBPM) curMinBPM = BPMChanges[i]._BPM;
                else if (BPMChanges[i]._BPM > curMaxBPM) curMaxBPM = BPMChanges[i]._BPM;
                else if (BPMChanges[i]._bpm < curMinBPM) curMinBPM = BPMChanges[i]._bpm;
                else if (BPMChanges[i]._bpm > curMaxBPM) curMaxBPM = BPMChanges[i]._bpm;
                if (!flagBPMChanges) mapBPMChange.push(BPMChanges[i]);
            } // TODO: actually write proper BPM change check between diff rather than based on min, max value lol
            if (flagBPMChanges && (mapMinBPM != curMinBPM || mapMaxBPM != curMaxBPM)) flagOddBPM = true;
            else if (mapMinBPM > curMinBPM || mapMaxBPM < curMaxBPM) flagBPMChanges = true;
            mapUpdateBPMRange(curMinBPM, curMaxBPM);
            UIUpdateMapInfoBPM(mapMinBPM, mapMaxBPM);
        }
    }

    if (diff._notes.length > 0 || diff._obstacles.length > 0) {
        diff['_duration'] = getLastInteractiveTime(diff._notes, diff._obstacles, mapInfo._beatsPerMinute);
        if (!flagLoadAudio) calcMapDuration(mapInfo._beatsPerMinute, diff._notes, diff._obstacles);
    }
    return diff;
}

async function mapTool(charName, diff) {
    let offset = 0;
    if (diff._customData) {
        if (diff._customData._editorOffset)
            offset = diff._customData._editorOffset / 1000;
    }

    const bpm = mapInfo._beatsPerMinute;
    let BPMChanges;
    if (diff._data._customData) {
        if (diff._data._customData._BPMChanges) BPMChanges = diff._data._customData._BPMChanges;
        else if (diff._data._customData._bpmChanges) BPMChanges = diff._data._customData._bpmChanges;
    }
    const bpmc = getBPMChangesTime(bpm, offset, BPMChanges);
    const startTime = getFirstInteractiveTime(diff._data._notes, diff._data._obstacles, bpm);

    let arr = [];
    console.log('Analysing', charName, diff._difficulty);
    if (startTime < 1.5) arr.push(outTxtBold('Hot start', `${round(startTime, 2)}s`));
    if (countEventLight10(diff._data._events) < 10) arr.push(outTxtBold('Lack of lighting events', '(<=10 events)'));
    arr.push(outTxtBold(`>${maxEBPM}EBPM warning []`, getEffectiveBPMTime(diff._data._notes, bpm, offset, bpmc)));
    arr.push(outTxtBold(`>${maxEBPMS}EBPM (swing) warning []`, getEffectiveBPMSwingTime(diff._data._notes, bpm, offset, bpmc)));

    arr.push(outTxtBold('Note(s) before start time', findOutStartNote(diff._data._notes, mapInfo._beatsPerMinute)));
    arr.push(outTxtBold('Note(s) after end time', findOutEndNote(diff._data._notes, mapInfo._beatsPerMinute)));
    arr.push(outTxtBold('Event(s) before start time', findOutStartEvent(diff._data._events, mapInfo._beatsPerMinute)));
    arr.push(outTxtBold('Event(s) after end time', findOutEndEvent(diff._data._events, mapInfo._beatsPerMinute)));
    arr.push(outTxtBold('Obstacle(s) before start time', findOutStartObstacle(diff._data._obstacles, mapInfo._beatsPerMinute)));
    arr.push(outTxtBold('Obstacle(s) after end time', findOutEndObstacle(diff._data._obstacles, mapInfo._beatsPerMinute)));

    arr.push(outTxtBold('Zero width/duration wall []', detectZeroWall(diff._data._obstacles, bpm, offset, bpmc)));
    arr.push(outTxtBold('Negative wall []', detectNegativeWall(diff._data._obstacles, bpm, offset, bpmc)));
    arr.push(outTxtBold('2-center wall []', detectCenterWall(diff._data._obstacles, bpm, offset, bpmc)));
    arr.push(outTxtBold('<15ms wall []', detectShortWall(diff._data._obstacles, bpm, offset, bpmc)));

    if (flagToolDD) arr.push(outTxtBold('Double-directional []', detectDoubleDirectional(diff._data._notes, bpm, offset, bpmc)));
    if (flagToolvBlock) arr.push(outTxtBold('Vision blocked []', detectVisionBlock(diff._data._notes, bpm, offset, bpmc)));
    arr.push(outTxtBold('Stacked note []', detectStackedNote(diff._data._notes, bpm, offset, bpmc)));
    if (beatPrecision.length > 0) arr.push(outTxtBold('Off-beat precision []', detectOffPrecision(diff._data._notes, bpm, offset, bpmc)));
    if (flagToolHBStair) arr.push(outTxtBold('Hitbox staircase []', detectHitboxStaircase(diff._data._notes, bpm, offset, bpmc)));
    if (flagToolshrAngle) arr.push(outTxtBold('Shrado angle []', detectShrAngle(diff._data._notes, bpm, offset, bpmc)));
    let text = arr.filter(function(x) {
        return x != '';
    });
    return text;
}

// fallback if audio loading didnt work
function calcMapDuration(bpm, notes, obstacles) {
    let lastNoteTime = notes[notes.length - 1]._time / bpm * 60 || 0;
    let lastObstacleTime = 0;
    for (let i = obstacles.length - 1; i >= 0; i--)
        lastObstacleTime = Math.max(lastObstacleTime, (obstacles[i]._time + obstacles[i]._duration) / bpm * 60);
    let dur = Math.max(lastNoteTime, lastObstacleTime);

    if (!songDuration) songDuration = dur;
    else if (songDuration < dur) songDuration = dur;
    $('#songduration').text(`${toMMSS(songDuration)} ⚠️ no audio, using map duration`);
}

function mapUpdateBPMRange(min, max) {
    if (!mapMinBPM || !mapMaxBPM) mapMinBPM = min, mapMaxBPM = max;
    if (min < mapMinBPM) mapMinBPM = min;
    if (max > mapMaxBPM) mapMaxBPM = max;
}
