 /* USER INTERFACE SCRIPT - ui.js
    i dunno what to describe here
    it's fairly obvious; creating, manipulating, and deleting DOM element with JQuery */

// I took too long just to figure out how to upload and load zip file
$('#inputfile').change(readFile);

// need to figure out how to deal with CORS before implementing it to UI
$.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
       return null;
    }
    return decodeURI(results[1]) || null;
}

if ($.urlParam('url') != null) {
    // what's url sanitisation anyway
    $('.inputfile').prop('disabled', true);
    downloadMap($.urlParam('url'));
}

function downloadMap(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Content-Type', 'application/zip');
    xhr.responseType = 'arraybuffer';
    xhr.send();
    
    xhr.onprogress = function(e) {
        UILoadingStatus(e.loaded / e.total * 100, `Downloading map: ${Math.floor(e.loaded / 1024 / 1024 * 10) / 10}MB / ${Math.floor(e.total / 1024 / 1024 * 10) / 10}MB`);
    };
    
    xhr.onload = function() {
        if (xhr.status == 200) {
            extractZip(xhr.response);
        }
    };
}

function readFile() {
    let file = this.files[0];
    const fr = new FileReader();
    if (file.name.substr(-4) == '.zip') {
        fr.readAsArrayBuffer(file);
        fr.addEventListener('load', extractZip);
    }
    else {
        alert('Unsupported file format.');
    }
}

async function extractZip(data) {
    let mapZip = new JSZip();
    let temp = data;
    if (data.target) temp = data.target.result;
    try {
        mapZip = await JSZip.loadAsync(temp);
        $('#loadingbar').css('background-color', '#4060a0');
        await loadMap(mapZip);
    } catch (error) {
        $('#loadingbar').css('background-color', '#cc0000');
        $('.settings').prop('disabled', false);
        $('.input').css('display', 'block');
        $('.metadata').css('display', 'none');
        UILoadingStatus(100, "Error while loading map!");
        console.error(error);
    }
}

$('#mapset').change(function() {
    charSelect = this.value;
    UIPopulateDiffSelect(mapInfo._difficultyBeatmapSets.find(c => c._beatmapCharacteristicName == this.value));
});
$('#mapdiff').change(function() {
    diffSelect = this.value;
    UIOutputDisplay(charSelect, diffSelect);
});
$('#ebpm').change(function() {
    maxEBPM = Math.abs(this.value);
    $('#ebpm').val(maxEBPM);
});
$('#ebpms').change(function() {
    maxEBPMS = Math.abs(this.value);
    $('#ebpms').val(maxEBPMS);
});
$('#beatprec').change(function() {
    beatPrecision = this.value.split(' ')
    .map(function(x) {return parseInt(x)})
    .filter(function(x) {if(x > 0) return !Number.isNaN(x)});
    $('#beatprec').val(beatPrecision.join(' '));
});
$('#hbstair').click(function() {
    if ($(this).prop("checked")) {
        flagToolHBStair = true;
    }
    else flagToolHBStair = false;
});
$('#shrangle').click(function() {
    if ($(this).prop("checked")) {
        flagToolshrAngle = true;
    }
    else flagToolshrAngle = false;
});
$('#shranglemax').change(function() {
    shrAngleMax = round(Math.abs(this.value) / 1000, 3);
    $('#shranglemax').val(round(shrAngleMax * 1000, 3));
    if (flagLoaded) $('#shranglemaxbeat').val(round(toBeatTime(shrAngleMax), 3));
});
$('#shranglemaxbeat').change(function() {
    if (flagLoaded) {
        let val = round(Math.abs(this.value), 3);
        shrAngleMax = round(toRealTime(val), 3);
        $('#shranglemax').val(round(shrAngleMax * 1000, 3));
        $('#shranglemaxbeat').val(val);
    }
    else $('#shranglemaxbeat').val(0);
});
$('#dd').click(function() {
    if ($(this).prop("checked")) {
        flagToolDD = true;
    }
    else flagToolDD = false;
});
$('#vblock').click(function() {
    if ($(this).prop("checked")) {
        flagToolvBlock = true;
    }
    else flagToolvBlock = false;
});
$('#vblockmin').change(function() {
    vBlockMin = round(Math.abs(this.value) / 1000, 3);
    $('#vblockmin').val(round(vBlockMin * 1000));
    if (flagLoaded) $('#vblockminbeat').val(round(toBeatTime(vBlockMin), 3));
    if (vBlockMin > vBlockMax) {
        vBlockMax = vBlockMin;
        $('#vblockmax').val(round(vBlockMin * 1000));
        if (flagLoaded) $('#vblockmaxbeat').val(round(toBeatTime(vBlockMin), 3));
    }
});
$('#vblockminbeat').change(function() {
    if (flagLoaded) {
        let val = round(Math.abs(this.value), 3);
        vBlockMin = round(toRealTime(val), 3);
        $('#vblockmin').val(round(vBlockMin * 1000));
        $('#vblockminbeat').val(val);
        if (vBlockMin > vBlockMax) {
            vBlockMax = vBlockMin;
            $('#vblockmax').val(round(vBlockMin * 1000));
            $('#vblockmaxbeat').val(val);
        }
    }
    else $('#vblockminbeat').val(0);
});
$('#vblockmax').change(function() {
    vBlockMax = round(Math.abs(this.value) / 1000, 3);
    $('#vblockmax').val(round(vBlockMax * 1000));
    if (flagLoaded) $('#vblockmaxbeat').val(round(toBeatTime(vBlockMax), 3));
});
$('#vblockmaxbeat').change(function() {
    if (flagLoaded) {
        let val = round(Math.abs(this.value), 3);
        vBlockMax = round(toRealTime(val), 3);
        $('#vblockmax').val(round(vBlockMax * 1000));
        $('#vblockmaxbeat').val(val);
    }
    else $('#vblockmaxbeat').val(0);
});
$('#vblockhjd').click(function() {
    if (flagLoaded) {
        let char = mapInfo._difficultyBeatmapSets.find(c => c._beatmapCharacteristicName == charSelect);
        let diff = char._difficultyBeatmaps.find(d => d._difficulty == diffSelect);
        let hjd = round(getHalfJumpDuration(mapInfo._beatsPerMinute, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset), 3);
        vBlockMin = round(60 / mapInfo._beatsPerMinute * 0.25, 3);
        vBlockMax = round(60 / mapInfo._beatsPerMinute * hjd, 3);
        $('#vblockmin').val(vBlockMin * 1000);
        $('#vblockmax').val(vBlockMax * 1000);
        $('#vblockminbeat').val(0.25);
        $('#vblockmaxbeat').val(hjd);
    }
});
$('#vblockoptimal').click(function() {
    vBlockMin = 0.1;
    vBlockMax = 0.5;
    $('#vblockmin').val(vBlockMin * 1000);
    $('#vblockmax').val(vBlockMax * 1000);
    if (flagLoaded) {
        $('#vblockminbeat').val(round(toBeatTime(vBlockMin), 3));
        $('#vblockmaxbeat').val(round(toBeatTime(vBlockMax), 3));
    }
});
$('#applythis').click(async function() {
    let char = mapInfo._difficultyBeatmapSets.find(c => c._beatmapCharacteristicName == charSelect);
    let diff = char._difficultyBeatmaps.find(d => d._difficulty == diffSelect);
    let mapObj = {
        mapSet: charSelect
    }
    mapObj.diff = diffSelect;
    mapObj.text = await mapTool(charSelect, diff);
    let arr = [mapObj];

    mapAnalysis = mapAnalysis.map(ma => arr.find(obj => obj.mapSet == ma.mapSet && obj.diff == ma.diff) || ma);
    UIOutputDisplay(charSelect, diffSelect);
});
$('#applyall').click(async function() {
    mapAnalysis = [];
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
});
let UIHitboxStaircase = document.getElementById('hitboxstaircase');
let UIVBlock = document.getElementById('vblock');

$('.accordion').click(function() {
    this.classList.toggle('active');
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + 16 + 'px';
    }
});

function UILoadingStatus(progress, text) {
    $('#loadingbar').css('width', `${progress}%`);
    $('#loadingtext').text(text);
}

function UIUpdateMapInfo() {
    $('#songauthor').text(mapInfo._songAuthorName);
    $('#songname').text(mapInfo._songName);
    $('#songsubname').text(mapInfo._songSubName);
    $('#songbpm').text(`${round(mapInfo._beatsPerMinute, 3)} BPM`);
    $('#levelauthor').text(`Mapped by  ${mapInfo._levelAuthorName}`);
    $('#environment').text(`${envName[mapInfo._environmentName]} Environment`);
    
    $('.input').css('display', 'none');
    $('.metadata').css('display', 'block');
}

// case for multiple BPM map
function UIUpdateMapInfoBPM(min, max) {
    document.getElementById('songbpm').textContent = '(' + round(mapInfo._beatsPerMinute, 3) + ') ' + round(min, 3) + '-' + round(max, 3) + 'BPM' + (flagOddBPM ? ' ⚠️ inconsistent BPM between difficulty.' : '');
}

function UIPopulateCharSelect() {
    $('#mapset').empty();
    for (let i = 0, len = mapInfo._difficultyBeatmapSets.length; i < len; i++) {
        $('#mapset').append($('<option>', {
            value: mapInfo._difficultyBeatmapSets[i]._beatmapCharacteristicName,
            text: mapInfo._difficultyBeatmapSets[i]._beatmapCharacteristicName
        }));
    }
    charSelect = mapInfo._difficultyBeatmapSets[0]._beatmapCharacteristicName;
    UIPopulateDiffSelect(mapInfo._difficultyBeatmapSets[0]);
}

function UIPopulateDiffSelect(mapSet) {
    $('#mapdiff').empty();
    for (let i = mapSet._difficultyBeatmaps.length - 1; i >= 0; i--) {
        let diffName = diffRename[mapSet._difficultyBeatmaps[i]._difficulty] || mapSet._difficultyBeatmaps[i]._difficulty;
        if (mapSet._difficultyBeatmaps[i]._customData)
            if (mapSet._difficultyBeatmaps[i]._customData._difficultyLabel && mapSet._difficultyBeatmaps[i]._customData._difficultyLabel != '')
                diffName = `${mapSet._difficultyBeatmaps[i]._customData._difficultyLabel} -- ${diffName}`;
        $('#mapdiff').append($('<option>', {
            value: mapSet._difficultyBeatmaps[i]._difficulty,
            text: diffName
        }));
    }
    diffSelect = mapSet._difficultyBeatmaps[mapSet._difficultyBeatmaps.length - 1]._difficulty;
    if (flagLoaded) UIOutputDisplay(charSelect, diffSelect);
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
    const bpm = mapInfo._beatsPerMinute;
    let diffName = diffRename[diff._difficulty] || diff._difficulty;
    let offset = 0;
    let BPMChanges;
    let customColor = {};
    let hasChroma = false;
    if (diff._customData) {
        if (diff._customData._difficultyLabel && diff._customData._difficultyLabel != '')
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
        else customColor._colorLeft = colorScheme[envColor[mapInfo._environmentName]]._colorLeft;
        
        if (diff._customData._colorRight) {
            customColor._colorRight = rgbaToHex(diff._customData._colorRight);
        }
        else customColor._colorRight = colorScheme[envColor[mapInfo._environmentName]]._colorRight;
        
        if (diff._customData._envColorLeft) {
            customColor._envColorLeft = rgbaToHex(diff._customData._envColorLeft);
        }
        else customColor._envColorLeft = colorScheme[envColor[mapInfo._environmentName]]._envColorLeft;
        
        if (diff._customData._envColorRight) {
            customColor._envColorRight = rgbaToHex(diff._customData._envColorRight);
        }
        else customColor._envColorRight = colorScheme[envColor[mapInfo._environmentName]]._envColorRight;
        
        // tricky stuff
        // need to display both boost
        let envBL, envBR, envBoost = false;
        if (diff._customData._envColorLeftBoost) {
            envBL = rgbaToHex(diff._customData._envColorLeftBoost);
            envBoost = true;
        }
        else {
            if (colorScheme[envColor[mapInfo._environmentName]]._envColorLeftBoost) {
                envBL = colorScheme[envColor[mapInfo._environmentName]]._envColorLeftBoost;
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
            if (colorScheme[envColor[mapInfo._environmentName]]._envColorRightBoost) {
                envBR = colorScheme[envColor[mapInfo._environmentName]]._envColorRightBoost;
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
        else customColor._obstacleColor = colorScheme[envColor[mapInfo._environmentName]]._obstacleColor;
    }
    if (diff._data._customData) {
        if (diff._data._customData._BPMChanges) BPMChanges = diff._data._customData._BPMChanges;
        else if (diff._data._customData._bpmChanges) BPMChanges = diff._data._customData._bpmChanges;
    }
    const bpmc = getBPMChangesTime(bpm, offset, BPMChanges);
    
    // general map stuff
    let textMap = [];
    textMap.push(`NJS: ${diff._noteJumpMovementSpeed} / ${round(diff._noteJumpStartBeatOffset, 3)}`);
    textMap.push(`HJD: ${round(getHalfJumpDuration(bpm, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset), 3)}`);
    textMap.push(`JD: ${round(getJumpDistance(bpm, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset), 3)}`);
    textMap.push(`Reaction Time: ${Math.round(60 / bpm * getHalfJumpDuration(bpm, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset) * 1000)}ms`);
    textMap.push('');
    textMap.push(`Effective BPM: ${(findEffectiveBPM(diff._data._notes, bpm)).toFixed(2)}`);
    textMap.push(`Effective BPM (swing): ${(findEffectiveBPMSwing(diff._data._notes, bpm)).toFixed(2)}`);
    if (bpmc.length > 0) textMap.push(`BPM changes: ${bpmc.length}`);

    // note
    let textNote = [];
    const note = countNote(diff._data._notes)
    textNote.push(`Notes: ${note.red + note.blue}`);
    textNote.push(`• Red: ${note.red}`);
    textNote.push(`• Blue: ${note.blue}`);
    textNote.push(`• R/B Ratio: ${round(note.blue ? note.red / note.blue : 0, 2)}`);
    textNote.push('');
    textNote.push(`SPS: ${swingPerSecondInfo(diff._data)}`);
    textNote.push(`NPS: ${calcNPS(note.red + note.blue).toFixed(2)}`);
    textNote.push(`• Mapped: ${calcNPSMapped(note.red + note.blue, diff._data._duration).toFixed(2)}`);

    let textObstacle = [];
    // i know bomb isnt obstacle but this side doesnt have much so i merge this together
    // it now include row percentage; does not include bomb
    textObstacle.push(`Top Row: ${note.blue || note.red ? round(countNoteLayer(diff._data._notes, 2) / (note.red + note.blue) * 100, 1) : 0}%`);
    textObstacle.push(`Mid Row: ${note.blue || note.red ? round(countNoteLayer(diff._data._notes, 1) / (note.red + note.blue) * 100, 1) : 0}%`);
    textObstacle.push(`Bot Row: ${note.blue || note.red ? round(countNoteLayer(diff._data._notes, 0) / (note.red + note.blue) * 100, 1) : 0}%`);
    textObstacle.push('');
    textObstacle.push(`Bombs: ${note.bomb}`);
    textObstacle.push('');
    textObstacle.push(`Obstacles: ${diff._data._obstacles.length}`);
    textObstacle.push(`• Interactive: ${countInteractiveObstacle(diff._data._obstacles)}`);

    // event n stuff
    let textEvent = [];
    const event = countEvent(diff._data._events);
    textEvent.push(`Events: ${diff._data._events.length}`);
    textEvent.push(`• Lighting: ${event.light}`);
    textEvent.push(`• Ring Rotation: ${event.rrotate}`);
    textEvent.push(`• Ring Zoom: ${event.rzoom}`);
    textEvent.push(`• Laser Rotation: ${event.laser}`);
    if (event.chroma || event.ogc) {
        textEvent.push('');
        if (event.chroma) textEvent.push(hasChroma ? `• Chroma: ${event.chroma}` : `• Chroma: ${event.chroma} ⚠️ not suggested`);
        if (event.ogc) textEvent.push(`• OG Chroma: ${event.ogc}`);
    }
    if (event.rot) {
        textEvent.push('');
        textEvent.push(`• Lane Rotation: ${charName == '90Degree' || charName == '360Degree' ? event.rot : `${event.rot} ⚠️ not 360/90 mode`}`);
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
        let colorDot = $('<span>', {
            class: 'diff-dot',
            id: k,
            css: {
                'background-color': customColor[k]
            }
        });
        colorDot.appendTo(diffDotContainer);
    }
    diffDotContainer.appendTo(diffHeader);

    // set subpanel
    // map
    let diffPanelMap = $('<div>', {
        class: 'diff-panel',
        id: 'map',
        html: textMap.join('<br>')
    });

    // note
    let diffPanelNote = $('<div>', {
        class: 'diff-panel',
        id: 'note',
        html: textNote.join('<br>')
    });
    
    // obstacle
    let diffPanelObstacle = $('<div>', {
        class: 'diff-panel',
        id: 'obstacle',
        html: textObstacle.join('<br>')
    });

    // event
    let diffPanelEvent = $('<div>', {
        class: 'diff-panel',
        id: 'event',
        html: textEvent.join('<br>')
    });

    // merge all panel into container
    let diffContainer = $('<div>', {
        class: 'diff-container'
    });
    diffContainer.append(diffHeader);
    diffContainer.append(diffPanelMap);
    diffContainer.append(diffPanelNote);
    diffContainer.append(diffPanelObstacle);
    diffContainer.append(diffPanelEvent);

    $(`#${charName}`).append(diffContainer);
}

function UIOutputDisplay(cs, ds) {
    let mapa = mapAnalysis.find(ma => ma.mapSet == cs && ma.diff == ds);
    $('#output-box').empty();
    if (!mapa.text.length > 0) $('#output-box').text('No issue(s) found.')
    $('#output-box').append(mapa.text.join('<br>'));
}