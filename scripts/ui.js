 /* USER INTERFACE SCRIPT
    i dunno what to describe here
    it's fairly obvious; creating, manipulating, and deleting DOM element */

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
$('#dd').click(function() {
    if ($(this).prop("checked")) {
        flagToolDD = true;
    }
    else flagToolDD = false;
});
$('#hbstair').click(function() {
    if ($(this).prop("checked")) {
        flagToolHBStair = true;
    }
    else flagToolHBStair = false;
});
$('#vblock').click(function() {
    if ($(this).prop("checked")) {
        flagToolvBlock = true;
    }
    else flagToolvBlock = false;
});
$('#vblockmin').change(function() {
    vBlockMin = Math.ceil(Math.abs(this.value));
    $('#vblockmin').val(vBlockMin);
    if (flagLoaded) $('#vblockminbeat').val(round(toBeatTime(vBlockMin / 1000), 3));
    if (vBlockMin > vBlockMax) {
        vBlockMax = vBlockMin;
        $('#vblockmax').val(vBlockMin);
        if (flagLoaded) $('#vblockmaxbeat').val(round(toBeatTime(vBlockMin / 1000), 3));
    }
});
$('#vblockminbeat').change(function() {
    if (flagLoaded) {
        let val = round(Math.abs(this.value), 3);
        vBlockMin = Math.ceil(toRealTime(val) * 1000);
        $('#vblockmin').val(vBlockMin);
        $('#vblockminbeat').val(val);
        if (vBlockMin > vBlockMax) {
            vBlockMax = vBlockMin;
            $('#vblockmax').val(vBlockMin);
            $('#vblockmaxbeat').val(round(toBeatTime(vBlockMin / 1000), 3));
        }
    }
    else $('#vblockminbeat').val(0);
});
$('#vblockmax').change(function() {
    vBlockMax = Math.floor(Math.abs(this.value));
    $('#vblockmax').val(vBlockMax);
    if (flagLoaded) $('#vblockmaxbeat').val(round(toBeatTime(vBlockMax / 1000), 3));
});
$('#vblockmaxbeat').change(function() {
    if (flagLoaded) {
        let val = round(Math.abs(this.value), 3);
        vBlockMax = Math.floor(toRealTime(val) * 1000);
        $('#vblockmax').val(vBlockMax);
        $('#vblockmaxbeat').val(val);
    }
    else $('#vblockmaxbeat').val(0);
});
$('#vblockhjd').click(function() {
    if (flagLoaded) {
        let char = mapInfo._difficultyBeatmapSets.find(c => c._beatmapCharacteristicName == charSelect);
        let diff = char._difficultyBeatmaps.find(d => d._difficulty == diffSelect);
        let hjd = round(getHalfJumpDuration(mapInfo._beatsPerMinute, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset), 3);
        vBlockMin = Math.ceil(60 / mapInfo._beatsPerMinute * 0.25 * 1000);
        vBlockMax = Math.floor(60 / mapInfo._beatsPerMinute * (hjd - 0.125) * 1000);
        $('#vblockmin').val(vBlockMin);
        $('#vblockmax').val(vBlockMax);
        $('#vblockminbeat').val(round(toBeatTime(vBlockMin / 1000), 3));
        $('#vblockmaxbeat').val(round(toBeatTime(vBlockMax / 1000), 3));
    }
});
$('#vblockoptimal').click(function() {
    vBlockMin = 100;
    vBlockMax = 500;
    $('#vblockmin').val(vBlockMin);
    $('#vblockmax').val(vBlockMax);
    if (flagLoaded) {
        $('#vblockminbeat').val(round(toBeatTime(vBlockMin / 1000), 3));
        $('#vblockmaxbeat').val(round(toBeatTime(vBlockMax / 1000), 3));
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
    $('#levelauthor').text('Mapped by ' + mapInfo._levelAuthorName);
    $('#songbpm').text(round(mapInfo._beatsPerMinute, 3) + 'BPM');
    
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
        let diffName = diffRename[mapSet._difficultyBeatmaps[i]._difficulty];
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
// also gotta convert to jquery but am too lazy
async function UIcreateDiffSet(charName) {
    let charRename = charName;
    if(modeRename[charRename])
        charRename = modeRename[charRename];
    let charContainer = document.createElement('div');
    charContainer.className = 'char-container';
    charContainer.setAttribute('id', charName);

    let charHeader = document.createElement('span');
    let charHeaderContent = document.createTextNode(charRename);
    charHeader.className = 'char-label';
    charHeader.appendChild(charHeaderContent);
    charContainer.appendChild(charHeader);

    let statspanel = document.getElementById('stats');
    statspanel.appendChild(charContainer);
}

// dont mind the pepega down there, i'll clean it later
async function UIcreateDiffInfo(charName, diff) {
    const bpm = mapInfo._beatsPerMinute;
    let diffName = diffRename[diff._difficulty];
    let offset = 0;
    let BPMChanges;
    if (diff._customData) {
        if (diff._customData._difficultyLabel && diff._customData._difficultyLabel != '')
            diffName = `${diff._customData._difficultyLabel} -- ${diffName}`;
        if (diff._customData._editorOffset)
            offset = diff._customData._editorOffset / 1000;
    }
    if (diff._data._customData) {
        if (diff._data._customData._BPMChanges) BPMChanges = diff._data._customData._BPMChanges;
        else if (diff._data._customData._bpmChanges) BPMChanges = diff._data._customData._bpmChanges;
    }
    
    let textMap = [];
    textMap.push(`NJS: ${diff._noteJumpMovementSpeed} / ${round(diff._noteJumpStartBeatOffset, 3)}`);
    textMap.push(`HJD: ${round(getHalfJumpDuration(bpm, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset), 3)}`);
    textMap.push(`JD: ${round(getJumpDistance(bpm, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset), 3)}`);
    textMap.push(`Reaction Time: ${Math.round(60 / bpm * getHalfJumpDuration(bpm, diff._noteJumpMovementSpeed, diff._noteJumpStartBeatOffset) * 1000)}ms`);
    textMap.push('');
    textMap.push(`Effective BPM: ${(findEffectiveBPM(diff._data._notes, bpm)).toFixed(2)}`);
    textMap.push(`Effective BPM (swing): ${(findEffectiveBPMSwing(diff._data._notes, bpm)).toFixed(2)}`);

    let textNote = [];
    const note = countNote(diff._data._notes)
    const noteR = note.red;
    const noteB = note.blue;
    textNote.push(`Notes: ${noteR + noteB}`);
    textNote.push(`• Red: ${noteR}`);
    textNote.push(`• Blue: ${noteB}`);
    textNote.push(`• R/B Ratio: ${round(noteB ? noteR / noteB : 0, 2)}`);
    textNote.push('');
    textNote.push(`SPS: ${swingPerSecondInfo(diff._data)}`);
    textNote.push(`NPS: ${calcNPS(noteR + noteB).toFixed(2)}`);
    textNote.push(`• Mapped: ${calcNPSMapped(noteR + noteB, diff._data._duration).toFixed(2)}`);

    let textObstacle = [];
    // i know bomb isnt obstacle but this side doesnt have much so i merge this together
    // it now include sps
    textObstacle.push(`Top Row: ${noteB || noteR ? round(countNoteLayer(diff._data._notes, 2) / (noteR + noteB) * 100, 1) : 0}%`);
    textObstacle.push(`Mid Row: ${noteB || noteR ? round(countNoteLayer(diff._data._notes, 1) / (noteR + noteB) * 100, 1) : 0}%`);
    textObstacle.push(`Bot Row: ${noteB || noteR ? round(countNoteLayer(diff._data._notes, 0) / (noteR + noteB) * 100, 1) : 0}%`);
    textObstacle.push('');
    textObstacle.push(`Bombs: ${note.bomb}`);
    textObstacle.push('');
    textObstacle.push(`Obstacles: ${diff._data._obstacles.length}`);
    textObstacle.push(`• Interactive: ${countInteractiveObstacle(diff._data._obstacles)}`);

    let textEvent = [];
    const light = countEvent(diff._data._events);
    textEvent.push(`Events: ${diff._data._events.length}`);
    textEvent.push(`• Lighting: ${light.light}`);
    textEvent.push(`• Ring Rotation: ${light.rrotate}`);
    textEvent.push(`• Ring Zoom: ${light.rzoom}`);
    textEvent.push(`• Laser Rotation: ${light.laser}`);
    if (light.chroma || light.ogc) {
        textEvent.push('');
        if (light.chroma) textEvent.push(`• Chroma: ${light.chroma}`);
        if (light.ogc) textEvent.push(`• OG Chroma: ${light.ogc}`);
    }
    if (light.rot) {
        textEvent.push('');
        textEvent.push(`• Lane Rotation: ${light.chroma}`);
    }

    // set header
    let diffHeader = document.createElement('span');
    let diffHeaderContent = document.createTextNode(`${diffName}`);
    diffHeader.className = 'diff-label';
    diffHeader.style.backgroundColor = diffColor[diff._difficulty];
    diffHeader.appendChild(diffHeaderContent);

    // set subpanel
    // map
    let diffPanelMap = document.createElement('div');
    diffPanelMap.setAttribute('id', 'map');
    diffPanelMap.className = 'diff-panel';
    for (let i = 0; i < textMap.length; i++) {
        let diffPContent = document.createTextNode(textMap[i]);
        let linebreak = document.createElement('br');
        diffPanelMap.appendChild(diffPContent);
        diffPanelMap.appendChild(linebreak);
    }

    // note
    let diffPanelNote = document.createElement('div');
    diffPanelNote.setAttribute('id', 'note');
    diffPanelNote.className = 'diff-panel';
    for (let i = 0; i < textNote.length; i++) {
        let diffPContent = document.createTextNode(textNote[i]);
        let linebreak = document.createElement('br');
        diffPanelNote.appendChild(diffPContent);
        diffPanelNote.appendChild(linebreak);
    }
    
    // obstacle
    let diffPanelObstacle = document.createElement('div');
    diffPanelObstacle.setAttribute('id', 'obstacle');
    diffPanelObstacle.className = 'diff-panel';
    for (let i = 0; i < textObstacle.length; i++) {
        let diffPContent = document.createTextNode(textObstacle[i]);
        let linebreak = document.createElement('br');
        diffPanelObstacle.appendChild(diffPContent);
        diffPanelObstacle.appendChild(linebreak);
    }

    // event
    let diffPanelEvent = document.createElement('div');
    diffPanelEvent.setAttribute('id', 'event');
    diffPanelEvent.className = 'diff-panel';
    for (let i = 0; i < textEvent.length; i++) {
        let diffPContent = document.createTextNode(textEvent[i]);
        let linebreak = document.createElement('br');
        diffPanelEvent.appendChild(diffPContent);
        diffPanelEvent.appendChild(linebreak);
    }

    // merge all panel into container
    let diffContainer = document.createElement('div');
    diffContainer.className = 'diff-container';
    diffContainer.appendChild(diffHeader);
    diffContainer.appendChild(diffPanelMap);
    diffContainer.appendChild(diffPanelNote);
    diffContainer.appendChild(diffPanelObstacle);
    diffContainer.appendChild(diffPanelEvent);

    let charContainer = document.getElementById(charName);
    charContainer.appendChild(diffContainer);
}

function UIOutputDisplay(cs, ds) {
    let mapa = mapAnalysis.find(ma => ma.mapSet == cs && ma.diff == ds);
    $('#output-box').empty();
    if (!mapa.text.length > 0) $('#output-box').text('No issue(s) found.')
    for (let i = 0; i < mapa.text.length; i++) {
        $('#output-box').append(mapa.text[i] + '<br>');
    }
}