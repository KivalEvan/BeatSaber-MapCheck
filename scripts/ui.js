 /* USER INTERFACE SCRIPT - ui.js
    i dunno what to describe here
    it's fairly obvious; creating, manipulating, and deleting DOM element with JQuery */

$('#input-url').keydown(function(event) {
    if (event.which == 13) {
        downloadFromURL(this.value);
    }
});
$('#input-id').keydown(function(event) {
    if (event.which == 13) {
        downloadFromID(this.value);
    }
});
$('#input-file').change(readFile);

function downloadFromURL(input) {
    let url = sanitizeURL(input);
    downloadMap(url);
}

function downloadFromID(input) {
    let url = 'https://beatsaver.com/api/download/key/' + sanitizeBeatSaverID(input);
    try {
        let res = downloadMap(url);
        extractZip(res);
    } catch(err) {
        console.error(err);
    }
}

function sanitizeURL(url) {
    url = url.trim();
    if (/^http:\/\//.test(url)) {
        url = url.replace('http://', 'https://');
    }
    return url;
}

function sanitizeBeatSaverID(id) {
    id = id.trim();
    if (/^!bsr /.test(id)) {
        id = id.replace('!bsr ', '');
    }
    return id;
}

function downloadMap(url) {
    console.log('downloading...');
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = 5000;

        let startTime = Date.now();
        xhr.onprogress = function(e) {
            xhr.timeout += Date.now() - startTime;
            UILoadingStatus('info', `Downloading map: ${round(e.loaded / 1024 / 1024, 1)}MB / ${round(e.total / 1024 / 1024, 1)}MB`, e.loaded / e.total * 100);
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
            if (xhr.status === 404) {
                reject('map does not exist');
            }
            else {
                reject(`response ${xhr.status}`);
            }
        };

        xhr.onerror = function() {
            reject('error downloading map');
        };

        xhr.ontimeout = function() {
            reject('connection timeout');
        };

        xhr.send();
    });
}

function UIToggleInput() {
    $('.input').css('display', 'block').prop('disabled', true);
    $('.metadata').css('display', 'none');
}

function readFile() {
    let file = this.files[0];
    const fr = new FileReader();
    if (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl') {
        fr.readAsArrayBuffer(file);
        fr.addEventListener('load', function(e) {
            extractZip(e.target.result);
        });
    }
    else {
        UILoadingStatus('info', 'Unsupported file format, please enter zip file', 0);
    }
}

async function extractZip(data) {
    let mapZip = new JSZip();
    try {
        mapZip = await JSZip.loadAsync(data);
        await loadMap(mapZip);
    } catch(err) {
        $('.settings').prop('disabled', false);
        $('.input').css('display', 'block');
        $('.metadata').css('display', 'none');
        UILoadingStatus('error', 'Error while loading map!', 100);
        console.error(err);
    }
}

$('#mapset').change(function() {
    tool.select.char = this.value;
    UIPopulateDiffSelect(map.info._difficultyBeatmapSets.find(c => c._beatmapCharacteristicName === this.value));
});
$('#mapdiff').change(function() {
    tool.select.diff = this.value;
    UIOutputDisplay(tool.select.char, tool.select.diff);
});
$('#ebpm').change(function() {
    tool.ebpm.th = Math.abs(this.value);
    $('#ebpm').val(tool.ebpm.th);
});
$('#ebpms').change(function() {
    tool.ebpm.thSwing = Math.abs(this.value);
    $('#ebpms').val(tool.ebpm.thSwing);
});
$('#beatprec').change(function() {
    tool.beatPrec = this.value.split(' ')
    .map(function(x) {return parseInt(x)})
    .filter(function(x) {if(x > 0) return !Number.isNaN(x)});
    $('#beatprec').val(tool.beatPrec.join(' '));
});
$('#hbstair').click(function() {
    if ($(this).prop("checked")) {
        flag.tool.hb.staircase = true;
    }
    else flag.tool.hb.staircase = false;
});
$('#shrangle').click(function() {
    if ($(this).prop("checked")) {
        flag.tool.shrAngle = true;
    }
    else flag.tool.shrAngle = false;
});
$('#shranglemax').change(function() {
    tool.maxShrAngle = round(Math.abs(this.value) / 1000, 3);
    $('#shranglemax').val(round(tool.maxShrAngle * 1000, 3));
    if (flag.loaded) $('#shranglemaxbeat').val(round(toBeatTime(tool.maxShrAngle), 3));
});
$('#shranglemaxbeat').change(function() {
    if (flag.loaded) {
        let val = round(Math.abs(this.value), 3);
        tool.maxShrAngle = round(toRealTime(val), 3);
        $('#shranglemax').val(round(tool.maxShrAngle * 1000, 3));
        $('#shranglemaxbeat').val(val);
    }
    else $('#shranglemaxbeat').val(0);
});
$('#dd').click(function() {
    if ($(this).prop("checked")) {
        flag.tool.dd = true;
    }
    else flag.tool.dd = false;
});
$('#vbnote').click(function() {
    if ($(this).prop("checked")) {
        flag.tool.vb.note = true;
    }
    else flag.tool.vb.note = false;
});
$('#vbmin').change(function() {
    tool.vb.min = round(Math.abs(this.value) / 1000, 3);
    $('#vbmin').val(round(tool.vb.min * 1000));
    if (flag.loaded) $('#vbminbeat').val(round(toBeatTime(tool.vb.min), 3));
    if (tool.vb.min > tool.vb.max) {
        tool.vb.max = tool.vb.min;
        $('#vbmax').val(round(tool.vb.min * 1000));
        if (flag.loaded) $('#vbmaxbeat').val(round(toBeatTime(tool.vb.min), 3));
    }
});
$('#vbminbeat').change(function() {
    if (flag.loaded) {
        let val = round(Math.abs(this.value), 3);
        tool.vb.min = round(toRealTime(val), 3);
        $('#vbmin').val(round(tool.vb.min * 1000));
        $('#vbminbeat').val(val);
        if (tool.vb.min > tool.vb.max) {
            tool.vb.max = tool.vb.min;
            $('#vbmax').val(round(tool.vb.min * 1000));
            $('#vbmaxbeat').val(val);
        }
    }
    else $('#vbminbeat').val(0);
});
$('#vbmax').change(function() {
    tool.vb.max = round(Math.abs(this.value) / 1000, 3);
    $('#vbmax').val(round(tool.vb.max * 1000));
    if (flag.loaded) $('#vbmaxbeat').val(round(toBeatTime(tool.vb.max), 3));
});
$('#vbmaxbeat').change(function() {
    if (flag.loaded) {
        let val = round(Math.abs(this.value), 3);
        tool.vb.max = round(toRealTime(val), 3);
        $('#vbmax').val(round(tool.vb.max * 1000));
        $('#vbmaxbeat').val(val);
    }
    else $('#vbmaxbeat').val(0);
});
$('#vbhjd').click(function() {
    if (flag.loaded) {
        let char = map.info._difficultyBeatmapSets.find(c => c._beatmapCharacteristicName === tool.select.char);
        let diff = char._difficultyBeatmaps.find(d => d._difficulty === tool.select.diff);
        let hjd = round(getHalfJumpDuration(map.info._beatsPerMinute, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset), 3);
        tool.vb.min = round(60 / map.info._beatsPerMinute * 0.25, 3);
        tool.vb.max = round(60 / map.info._beatsPerMinute * hjd, 3);
        $('#vbmin').val(tool.vb.min * 1000);
        $('#vbmax').val(tool.vb.max * 1000);
        $('#vbminbeat').val(0.25);
        $('#vbmaxbeat').val(hjd);
    }
});
$('#vboptimal').click(function() {
    tool.vb.min = 0.1;
    tool.vb.max = 0.5;
    $('#vbmin').val(tool.vb.min * 1000);
    $('#vbmax').val(tool.vb.max * 1000);
    if (flag.loaded) {
        $('#vbminbeat').val(round(toBeatTime(tool.vb.min), 3));
        $('#vbmaxbeat').val(round(toBeatTime(tool.vb.max), 3));
    }
});
$('#applythis').click(async function() {
    let char = map.info._difficultyBeatmapSets.find(c => c._beatmapCharacteristicName === tool.select.char);
    let diff = char._difficultyBeatmaps.find(d => d._difficulty === tool.select.diff);
    let mapObj = {
        mapSet: tool.select.char
    }
    mapObj.diff = tool.select.diff;
    mapObj.text = await mapTool(tool.select.char, diff);
    let arr = [mapObj];

    map.analysis = map.analysis.map(ma => arr.find(obj => obj.mapSet === ma.mapSet && obj.diff === ma.diff) || ma);
    UIOutputDisplay(tool.select.char, tool.select.diff);
});
$('#applyall').click(async function() {
    map.analysis = [];
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
});

$('.accordion').click(function() {
    this.classList.toggle('active');
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + 16 + 'px';
    }
});

function UILoadingStatus(status, txt, progress = 100) {
    if (status === 'info') {
        $('#loadingbar').css('background-color', '#4060a0');
    }
    if (status === 'warn') {
        $('#loadingbar').css('background-color', '#cc0000');
    }
    else if (status === 'error') {
        $('#loadingbar').css('background-color', '#cc0000');
    }
    $('#loadingbar').css('width', `${progress}%`);
    $('#loadingtext').text(txt);
}

function UIUpdateMapInfo() {
    $('#songauthor').text(map.info._songAuthorName);
    $('#songname').text(map.info._songName);
    $('#songsubname').text(map.info._songSubName);
    $('#songbpm').text(`${round(map.info._beatsPerMinute, 3)} BPM`);
    $('#levelauthor').text(`Mapped by  ${map.info._levelAuthorName}`);
    $('#environment').text(`${envName[map.info._environmentName]} Environment`);
    
    $('.input').css('display', 'none');
    $('.metadata').css('display', 'block');
}

// case for multiple BPM map
function UIUpdateMapInfoBPM(min, max) {
    $('#songbpm').text('(' + round(map.info._beatsPerMinute, 3) + ') ' + round(min, 3) + '-' + round(max, 3) + 'BPM' + (flag.map.bpm.odd ? ' ⚠️ inconsistent BPM between difficulty.' : ''));
}

function UIPopulateCharSelect() {
    $('#mapset').empty();
    for (let i = 0, len = map.info._difficultyBeatmapSets.length; i < len; i++) {
        $('#mapset').append($('<option>', {
            value: map.info._difficultyBeatmapSets[i]._beatmapCharacteristicName,
            text: map.info._difficultyBeatmapSets[i]._beatmapCharacteristicName
        }));
    }
    tool.select.char = map.info._difficultyBeatmapSets[0]._beatmapCharacteristicName;
    UIPopulateDiffSelect(map.info._difficultyBeatmapSets[0]);
}

function UIPopulateDiffSelect(mapSet) {
    $('#mapdiff').empty();
    for (let i = mapSet._difficultyBeatmaps.length - 1; i >= 0; i--) {
        let diffName = diffRename[mapSet._difficultyBeatmaps[i]._difficulty] || mapSet._difficultyBeatmaps[i]._difficulty;
        if (mapSet._difficultyBeatmaps[i]._customData)
            if (mapSet._difficultyBeatmaps[i]._customData._difficultyLabel && mapSet._difficultyBeatmaps[i]._customData._difficultyLabel !== '')
                diffName = `${mapSet._difficultyBeatmaps[i]._customData._difficultyLabel} -- ${diffName}`;
        $('#mapdiff').append($('<option>', {
            value: mapSet._difficultyBeatmaps[i]._difficulty,
            text: diffName
        }));
    }
    tool.select.diff = mapSet._difficultyBeatmaps[mapSet._difficultyBeatmaps.length - 1]._difficulty;
    if (flag.loaded) UIOutputDisplay(tool.select.char, tool.select.diff);
}

// i could just make a table but i dont want to
async function UICreateDiffSet(charName) {
    let charRename = modeRename[charName] || charName;

    $('#stats').append([$('<div>', {
        id: charName,
        class: 'char-container'
    }).append($('<span>', {
        class: 'char-label',
        text: charRename
    }))]);
}

async function UICreateDiffInfo(charName, diff) {
    const bpm = map.info._beatsPerMinute;
    let diffName = diffRename[diff._difficulty] || diff._difficulty;
    let offset = 0;
    let BPMChanges;
    let customColor = {
        _colorLeft: colorScheme[envColor[map.info._environmentName]]._colorLeft,
        _colorRight: colorScheme[envColor[map.info._environmentName]]._colorRight,
        _envColorLeft: colorScheme[envColor[map.info._environmentName]]._envColorLeft,
        _envColorRight: colorScheme[envColor[map.info._environmentName]]._envColorRight,
        _envColorLeftBoost: null,
        _envColorRightBoost: null,
        _obstacleColor: colorScheme[envColor[map.info._environmentName]]._obstacleColor
    };
    let hasChroma = false;
    if (diff._customData) {
        if (diff._customData._difficultyLabel && diff._customData._difficultyLabel !== '')
            diffName = `${diff._customData._difficultyLabel} -- ${diffName}`;
        
        if (diff._customData._editorOffset)
            offset = diff._customData._editorOffset / 1000;
        
        if (!hasChroma && diff._customData._suggestions)
            hasChroma = diff._customData._suggestions.includes('Chroma');
        
        if (!hasChroma && diff._customData._requirements)
            hasChroma = diff._customData._requirements.includes('Chroma');
        
        // lol this isnt really great but it's the only effective and less error prone
        if (diff._customData._colorLeft) {
            customColor._colorLeft = rgbaToHex(diff._customData._colorLeft);
        }
        
        if (diff._customData._colorRight) {
            customColor._colorRight = rgbaToHex(diff._customData._colorRight);
        }
        
        if (diff._customData._envColorLeft) {
            customColor._envColorLeft = rgbaToHex(diff._customData._envColorLeft);
        }
        
        if (diff._customData._envColorRight) {
            customColor._envColorRight = rgbaToHex(diff._customData._envColorRight);
        }
        
        // tricky stuff
        // need to display both boost
        let envBL, envBR, envBoost = false;
        if (diff._customData._envColorLeftBoost) {
            envBL = rgbaToHex(diff._customData._envColorLeftBoost);
            envBoost = true;
        }
        else {
            if (colorScheme[envColor[map.info._environmentName]]._envColorLeftBoost) {
                envBL = colorScheme[envColor[map.info._environmentName]]._envColorLeftBoost;
                envBoost = true;
            }
            else {
                envBL = customColor._colorLeft;
            }
        }
        if (diff._customData._envColorRightBoost) {
            envBR = rgbaToHex(diff._customData._envColorRightBoost);
            envBoost = true;
        }
        else {
            if (colorScheme[envColor[map.info._environmentName]]._envColorRightBoost) {
                envBR = colorScheme[envColor[map.info._environmentName]]._envColorRightBoost;
                envBoost = true;
            }
            else {
                envBR = customColor._colorRight;
            }
        }
        if (envBoost) {
            customColor._envColorLeftBoost = envBL;
            customColor._envColorRightBoost = envBR;
        }

        if (diff._customData._obstacleColor) {
            customColor._obstacleColor = rgbaToHex(diff._customData._obstacleColor);
        }
    }
    if (diff._data._customData) {
        if (diff._data._customData._BPMChanges) BPMChanges = diff._data._customData._BPMChanges;
        else if (diff._data._customData._bpmChanges) BPMChanges = diff._data._customData._bpmChanges;
    }
    const bpmc = getBPMChangesTime(bpm, offset, BPMChanges);
    
    // general map stuff
    let txtMap = [];
    txtMap.push(`NJS: ${diff._noteJumpMovementSpeed} / ${round(diff._noteJumpStartBeatOffset, 3)}`);
    txtMap.push(`HJD: ${round(getHalfJumpDuration(bpm, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset), 3)}`);
    txtMap.push(`JD: ${round(getJumpDistance(bpm, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset), 3)}`);
    txtMap.push(`Reaction Time: ${Math.round(60 / bpm * getHalfJumpDuration(bpm, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset) * 1000)}ms`);
    txtMap.push('');
    txtMap.push(`Effective BPM: ${(findEffectiveBPM(diff._data._notes, bpm)).toFixed(2)}`);
    txtMap.push(`Effective BPM (swing): ${(findEffectiveBPMSwing(diff._data._notes, bpm)).toFixed(2)}`);
    if (bpmc.length > 0) txtMap.push(`BPM changes: ${bpmc.length}`);

    // note
    let txtNote = [];
    const note = getNoteCount(diff._data._notes)
    txtNote.push(`Notes: ${note.red + note.blue}`);
    txtNote.push(`• Red: ${note.red}`);
    txtNote.push(`• Blue: ${note.blue}`);
    txtNote.push(`• R/B Ratio: ${round(note.blue ? note.red / note.blue : 0, 2)}`);
    txtNote.push('');
    txtNote.push(`SPS: ${swingPerSecondInfo(diff._data).toFixed(2)}`);
    txtNote.push(`NPS: ${calcNPS(note.red + note.blue).toFixed(2)}`);
    txtNote.push(`• Mapped: ${calcNPSMapped(note.red + note.blue, diff._data._duration).toFixed(2)}`);

    let txtObstacle = [];
    // i know bomb isnt obstacle but this side doesnt have much so i merge this together
    // it now include row percentage; does not include bomb
    txtObstacle.push(`Top Row: ${note.blue || note.red ? round(countNoteLayer(diff._data._notes, 2) / (note.red + note.blue) * 100, 1) : 0}%`);
    txtObstacle.push(`Mid Row: ${note.blue || note.red ? round(countNoteLayer(diff._data._notes, 1) / (note.red + note.blue) * 100, 1) : 0}%`);
    txtObstacle.push(`Bot Row: ${note.blue || note.red ? round(countNoteLayer(diff._data._notes, 0) / (note.red + note.blue) * 100, 1) : 0}%`);
    txtObstacle.push('');
    txtObstacle.push(`Bombs: ${note.bomb}`);
    txtObstacle.push('');
    txtObstacle.push(`Obstacles: ${diff._data._obstacles.length}`);
    txtObstacle.push(`• Interactive: ${countInteractiveObstacle(diff._data._obstacles)}`);

    // event n stuff
    let txtEvent = [];
    const event = getEventCount(diff._data._events);
    txtEvent.push(`Events: ${diff._data._events.length}`);
    txtEvent.push(`• Lighting: ${event.light}`);
    txtEvent.push(`• Ring Rotation: ${event.rrotate}`);
    txtEvent.push(`• Ring Zoom: ${event.rzoom}`);
    txtEvent.push(`• Laser Rotation: ${event.laser}`);
    if (event.chroma || event.ogc) {
        txtEvent.push('');
        if (event.chroma) txtEvent.push(hasChroma ? `• Chroma: ${event.chroma}` : `• Chroma: ${event.chroma} ⚠️ not suggested`);
        if (event.ogc) txtEvent.push(`• OG Chroma: ${event.ogc}`);
    }
    if (event.rot) {
        txtEvent.push('');
        txtEvent.push(`• Lane Rotation: ${charName === '90Degree' || charName === '360Degree' ? event.rot : `${event.rot} ⚠️ not 360/90 mode`}`);
    }

    // set header
    let diffHeader = $('<div>', {
        class: 'diff-header',
        css: {
            'background-color': diffColor[diff._difficulty]
        }
    });

    let diffLabel = $('<span>', {
        class: 'diff-label',
        text: diffName
    });
    diffLabel.appendTo(diffHeader);

    let diffDotContainer = $('<div>', {
        class: 'diff-dot-container'
    });
    for (const k in customColor) {
        if (customColor[k] !== null) {
            let colorDot = $('<span>', {
                class: 'diff-dot',
                id: k,
                css: {
                    'background-color': customColor[k]
                }
            });
            colorDot.appendTo(diffDotContainer);
        }
    }
    diffDotContainer.appendTo(diffHeader);

    // set subpanel
    // map
    let diffPanelMap = $('<div>', {
        class: 'diff-panel',
        id: 'map',
        html: txtMap.join('<br>')
    });

    // note
    let diffPanelNote = $('<div>', {
        class: 'diff-panel',
        id: 'note',
        html: txtNote.join('<br>')
    });
    
    // obstacle
    let diffPanelObstacle = $('<div>', {
        class: 'diff-panel',
        id: 'obstacle',
        html: txtObstacle.join('<br>')
    });

    // event
    let diffPanelEvent = $('<div>', {
        class: 'diff-panel',
        id: 'event',
        html: txtEvent.join('<br>')
    });

    // merge all panel into container
    let diffContainer = $('<div>', {
        class: 'diff-container',
        id: diff._difficulty
    });
    diffContainer.append(diffHeader);
    diffContainer.append(diffPanelMap);
    diffContainer.append(diffPanelNote);
    diffContainer.append(diffPanelObstacle);
    diffContainer.append(diffPanelEvent);

    $(`#${charName}`).append(diffContainer);
}

function UIOutputDisplay(cs, ds) {
    let mapa = map.analysis.find(ma => ma.mapSet === cs && ma.diff === ds);
    $('#output-box').empty();
    if (!mapa.text.length > 0) $('#output-box').text('No issue(s) found.')
    $('#output-box').append(mapa.text.join('<br>'));
}