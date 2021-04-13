/* USER INTERFACE SCRIPT - ui.js
    i dunno what to describe here
    it's fairly obvious; creating, manipulating, and deleting DOM element with JQuery */

$('#input-url').keydown(textInputHandler);
$('#input-id').keydown(textInputHandler);
$('#input-file').change(fileInputHandler);
$('#reset-button').click(mapReset);

function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.items) {
        if (event.dataTransfer.items[0].kind === 'file') {
            let file = event.dataTransfer.items[0].getAsFile();
            if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
                const fr = new FileReader();
                fr.readAsArrayBuffer(file);
                fr.addEventListener('load', function (e) {
                    extractZip(e.target.result);
                });
            } else {
                UILoadingStatus('info', 'Unsupported file format, please enter zip file', 0);
            }
        }
    }
}
function dragOverHandler(event) {
    event.preventDefault();
    event.stopPropagation();
}

function textInputHandler(event) {
    if (event.which === 13 && this.value.toString() !== '') {
        downloadFromID(this.value.toString());
    }
}
async function downloadFromURL(input) {
    // sanitize & validate url
    let url;
    try {
        url = sanitizeURL(input);
    } catch (err) {
        UILoadingStatus('info', err, 0);
        console.error(err);
        return;
    }

    $('.input').prop('disabled', true);
    UILoadingStatus('info', 'Requesting download from link', 0);

    console.log(`downloading from ${url}`);
    try {
        // apparently i need cors proxy
        let res = await downloadMap('https://cors-anywhere.herokuapp.com/' + url);
        map.url = url;
        extractZip(res);
    } catch (err) {
        $('.input').prop('disabled', false);
        UILoadingStatus('warn', err, 100);
        setTimeout(function () {
            if (!flag.loading) $('#loadingbar').css('background-color', '#111').css('width', '0%');
        }, 3000);
    }
}
async function downloadFromID(input) {
    // sanitize & validate id
    let id;
    try {
        id = sanitizeBeatSaverID(input);
    } catch (err) {
        UILoadingStatus('info', err, 0);
        console.error(err);
        return;
    }

    $('.input').prop('disabled', true);
    UILoadingStatus('info', 'Requesting download from BeatSaver', 0);

    console.log(`downloading from BeatSaver for map ID ${id}`);
    let url = 'https://beatsaver.com/api/download/key/' + id;
    try {
        let res = await downloadMap(url);
        map.id = id;
        map.url = 'https://beatsaver.com/beatmap/' + id;
        extractZip(res);
    } catch (err) {
        $('.input').prop('disabled', false);
        UILoadingStatus('warn', err, 100);
        console.error(err);
        setTimeout(function () {
            if (!flag.loading) $('#loadingbar').css('background-color', '#111').css('width', '0%');
        }, 3000);
    }
}
function sanitizeURL(url) {
    // regex from stackoverflow from another source
    let regexURL = /^(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/;
    url = url.trim();
    if (/^http:\/\//.test(url)) {
        url = url.replace('http://', 'https://');
    }
    if (regexURL.test(url)) {
        return url;
    } else {
        throw new Error('Invalid URL');
    }
}
function sanitizeBeatSaverID(id) {
    let regexID = /^[0-9a-fA-F]{1,6}$/;
    id = id.trim();
    if (/^!bsr /.test(id)) {
        id = id.replace('!bsr ', '');
    }
    if (regexID.test(id)) {
        return id;
    } else {
        throw new Error('Invalid ID');
    }
}
function downloadMap(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.timeout = 5000;

        let startTime = Date.now();
        xhr.onprogress = function (e) {
            xhr.timeout += Date.now() - startTime;
            UILoadingStatus(
                'download',
                `Downloading map: ${round(e.loaded / 1024 / 1024, 1)}MB / ${round(e.total / 1024 / 1024, 1)}MB`,
                (e.loaded / e.total) * 100
            );
        };

        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else if (xhr.status === 404) {
                reject('Error 404: Map does not exist');
            } else if (xhr.status === 403) {
                reject('Error 403: Forbidden');
            } else {
                reject(`Error ${xhr.status}`);
            }
        };

        xhr.onerror = function () {
            reject('Error downloading map');
        };

        xhr.ontimeout = function () {
            reject('Connection timeout');
        };

        xhr.send();
    });
}
function fileInputHandler() {
    UILoadingStatus('info', 'Reading file input', 0);
    let file = this.files[0];
    if (file === undefined) {
        UILoadingStatus('info', 'No file input', 0);
        throw new Error('No file input');
    }
    if (file && (file.name.substr(-4) === '.zip' || file.name.substr(-4) === '.bsl')) {
        const fr = new FileReader();
        fr.readAsArrayBuffer(file);
        fr.addEventListener('load', function (e) {
            extractZip(e.target.result);
        });
    } else {
        UILoadingStatus('info', 'Unsupported file format, please enter zip file', 0);
    }
}
async function extractZip(data) {
    UILoadingStatus('info', 'Extracting zip', 0);
    let mapZip = new JSZip();
    try {
        flag.loading = true;
        mapZip = await JSZip.loadAsync(data);
        await loadMap(mapZip);
    } catch (err) {
        mapReset();
        $('.settings').prop('disabled', false);
        UILoadingStatus('error', err, 100);
        console.error(err);
    }
}
function mapReset() {
    $('#mapset').empty();
    $('#mapdiff').empty();
    $('#stats').empty();
    $('#output-difficulty-name').html('');
    $('#output-difficulty-label').attr('class', `diff-labels`).html('Difficulty Label');
    $('#output-diff').html('No output.');
    $('#output-map').html('No output.');
    $('#map-link').text('').attr('href', '').css('display', 'none');
    $('.input').prop('disabled', false);
    $('#input-container').css('display', 'block');
    $('#input-file').css('display', 'none');
    $('.metadata').css('display', 'none');
    $('#coverimg').attr('src', './assets/unknown.jpg');
    UILoadingStatus('info', 'No map loaded', 0);
    flag.loading = false;
    flag.loaded = false;
    map.id = null;
    map.url = null;
    map.set = null;
    map.bpm.min = null;
    map.bpm.max = null;
    map.analysis.sps = [];
    map.analysis.missing = {};
    map.analysis.diff = [];
    map.audio.duration = 0;
    flag.map.load.audio = false;
    flag.map.load.image = false;
    flag.map.bpm.change = false;
    flag.map.bpm.odd = false;
}

$('#mapset').change(function () {
    tool.select.char = this.value;
    UIPopulateDiffSelect(map.info._difficultyBeatmapSets.find((c) => c._beatmapCharacteristicName === this.value));
});
$('#mapdiff').change(function () {
    tool.select.diff = this.value;
    UIOutputDisplay(tool.select.char, tool.select.diff);
});

// effective bpm
$('#ebpm').change(function () {
    tool.ebpm.th = Math.abs(parseFloat(this.value)) || 0;
    $('#ebpm').val(tool.ebpm.th);
});
$('#ebpms').change(function () {
    tool.ebpm.thSwing = Math.abs(parseFloat(this.value)) || 0;
    $('#ebpms').val(tool.ebpm.thSwing);
});

// beat precision
$('#beatprec').change(function () {
    tool.beatPrec = this.value
        .toString()
        .split(' ')
        .map(function (x) {
            return parseInt(x);
        })
        .filter(function (x) {
            if (x > 0) return !Number.isNaN(x);
        });
    $('#beatprec').val(tool.beatPrec.join(' '));
});

// hitbox staircase
$('#hb-stair').click(UIToolCheckbox);

// slow slider
$('#slowslider').click(UIToolCheckbox);
$('#slowslider-min').change(function () {
    tool.minSliderSpeed = round(Math.abs(parseFloat(this.value)) / 1000, 3) || 0;
    $('#slowslider-min').val(round(tool.minSliderSpeed * 1000, 3));
    if (flag.loaded) $('#slowslider-min-prec').val(round(1 / toBeatTime(tool.minSliderSpeed), 2));
});
$('#slowslider-min-prec').change(function () {
    if (flag.loaded) {
        let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
        tool.minSliderSpeed = round(toRealTime(1 / val), 3);
        $('#slowslider-min').val(round(tool.minSliderSpeed * 1000, 3));
        $('#slowslider-min-prec').val(val);
    } else {
        $('#slowslider-min-prec').val(0);
    }
});

// shrado angle
$('#shrangle').click(UIToolCheckbox);
$('#shrangle-max').change(function () {
    tool.maxShrAngle = round(Math.abs(parseFloat(this.value)) / 1000, 3) || 0;
    $('#shrangle-max').val(round(tool.maxShrAngle * 1000, 3));
    if (flag.loaded) $('#shrangle-max-prec').val(round(toBeatTime(tool.maxShrAngle), 2));
});
$('#shrangle-max-prec').change(function () {
    if (flag.loaded) {
        let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
        tool.maxShrAngle = round(toRealTime(1 / val), 3);
        $('#shrangle-max').val(round(tool.maxShrAngle * 1000, 3));
        $('#shrangle-max-prec').val(val);
    } else {
        $('#shrangle-max-prec').val(0);
    }
});

// inline angle
$('#inlineangle').click(UIToolCheckbox);
$('#inlineangle-max').change(function () {
    tool.maxInlineAngle = round(Math.abs(parseFloat(this.value)) / 1000, 3) || 0;
    $('#inlineangle-max').val(round(tool.maxInlineAngle * 1000, 3));
    if (flag.loaded) $('#inlineangle-max-prec').val(round(toBeatTime(tool.maxInlineAngle), 2));
});
$('#inlineangle-max-prec').change(function () {
    if (flag.loaded) {
        let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
        tool.maxInlineAngle = round(toRealTime(1 / val), 3);
        $('#inlineangle-max').val(round(tool.maxInlineAngle * 1000, 3));
        $('#inlineangle-max-prec').val(val);
    } else {
        $('#inlineangle-max-prec').val(0);
    }
});

// speed pause
$('#speedpause').click(UIToolCheckbox);
$('#speedpause-max').change(function () {
    tool.maxSpeedPause = round(Math.abs(parseFloat(this.value)) / 1000, 3) || 0;
    $('#speedpause-max').val(round(tool.maxSpeedPause * 1000, 3));
    if (flag.loaded) $('#speedpause-max-prec').val(round(toBeatTime(tool.maxSpeedPause), 2));
});
$('#speedpause-max-prec').change(function () {
    if (flag.loaded) {
        let val = round(Math.abs(parseFloat(this.value)), 2) || 1;
        tool.maxSpeedPause = round(toRealTime(1 / val), 3);
        $('#speedpause-max').val(round(tool.maxSpeedPause * 1000, 3));
        $('#speedpause-max-prec').val(val);
    } else {
        $('#speedpause-max-prec').val(0);
    }
});

// dd
$('#dd').click(UIToolCheckbox);

// vision block
$('#vb-note').click(UIToolCheckbox);
$('#vb-specific-time').click(UIToolVBSpecific);
$('#vb-specific-diff').click(UIToolVBSpecific);
$('#vb-min').change(function () {
    tool.vb.min = round(Math.abs(parseFloat(this.value)) / 1000, 3) || 0;
    $('#vb-min').val(round(tool.vb.min * 1000));
    if (flag.loaded) $('#vb-min-beat').val(round(toBeatTime(tool.vb.min), 3));
    if (tool.vb.min > tool.vb.max) {
        tool.vb.max = tool.vb.min;
        $('#vb-max').val(round(tool.vb.min * 1000));
        if (flag.loaded) $('#vb-max-beat').val(round(toBeatTime(tool.vb.min), 3));
    }
});
$('#vb-min-beat').change(function () {
    if (flag.loaded) {
        let val = round(Math.abs(parseFloat(this.value)), 3) || 0;
        tool.vb.min = round(toRealTime(val), 3);
        $('#vb-min').val(round(tool.vb.min * 1000));
        $('#vb-min-beat').val(val);
        if (tool.vb.min > tool.vb.max) {
            tool.vb.max = tool.vb.min;
            $('#vb-max').val(round(tool.vb.min * 1000));
            $('#vb-max-beat').val(val);
        }
    } else {
        $('#vb-min-beat').val(0);
    }
});
$('#vb-max').change(function () {
    tool.vb.max = round(Math.abs(parseFloat(this.value)) / 1000, 3) || 0;
    $('#vb-max').val(round(tool.vb.max * 1000));
    if (flag.loaded) $('#vb-max-beat').val(round(toBeatTime(tool.vb.max), 3));
});
$('#vb-max-beat').change(function () {
    if (flag.loaded) {
        let val = round(Math.abs(parseFloat(this.value)), 3) || 0;
        tool.vb.max = round(toRealTime(val), 3);
        $('#vb-max').val(round(tool.vb.max * 1000));
        $('#vb-max-beat').val(val);
    } else {
        $('#vb-max-beat').val(0);
    }
});
$('#vb-hjd').click(function () {
    if (flag.loaded) {
        let char = map.info._difficultyBeatmapSets.find((c) => c._beatmapCharacteristicName === tool.select.char);
        let diff = char._difficultyBeatmaps.find((d) => d._difficulty === tool.select.diff);
        let hjd = round(
            getHalfJumpDuration({
                bpm: map.info._beatsPerMinute,
                njs: diff._noteJumpMovementSpeed || fallbackNJS[diff._difficulty],
                njsOffset: diff._noteJumpStartBeatOffset,
            }),
            3
        );
        tool.vb.min = round((60 / map.info._beatsPerMinute) * 0.25, 3);
        tool.vb.max = round((60 / map.info._beatsPerMinute) * hjd, 3);
        $('#vb-min').val(tool.vb.min * 1000);
        $('#vb-max').val(tool.vb.max * 1000);
        $('#vb-min-beat').val(0.25);
        $('#vb-max-beat').val(hjd);
    }
});
$('#vb-optimal').click(function () {
    tool.vb.min = 0.1;
    tool.vb.max = 0.5;
    $('#vb-min').val(tool.vb.min * 1000);
    $('#vb-max').val(tool.vb.max * 1000);
    if (flag.loaded) {
        $('#vb-min-beat').val(round(toBeatTime(tool.vb.min), 3));
        $('#vb-max-beat').val(round(toBeatTime(tool.vb.max), 3));
    }
});

// apply changes
$('#apply-this').click(async function () {
    UILoadingStatus('', `Re-analysing ${tool.select.char} ${tool.select.diff}`);
    let char = map.info._difficultyBeatmapSets.find((c) => c._beatmapCharacteristicName === tool.select.char);
    let diff = char._difficultyBeatmaps.find((d) => d._difficulty === tool.select.diff);
    let mapObj = {
        mapSet: tool.select.char,
    };
    mapObj.diff = tool.select.diff;
    mapObj.text = await analyseDifficulty(tool.select.char, diff);

    const arr = [mapObj]; // this is dumb
    map.analysis.diff = map.analysis.diff.map(
        (ma) => arr.find((obj) => obj.mapSet === ma.mapSet && obj.diff === ma.diff) || ma
    );
    UIOutputDisplay(tool.select.char, tool.select.diff);
    UILoadingStatus('', `Re-analysed ${tool.select.char} ${tool.select.diff}`);
});
$('#apply-all').click(async function () {
    UILoadingStatus('', `Re-analysing all difficulties`);
    map.analysis.diff = [];
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
    UILoadingStatus('', `Re-analysed all difficulties`);
});

$('.accordion').click(function () {
    this.classList.toggle('active');
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + 16 + 'px';
    }
});

function UIToolCheckbox() {
    flag.tool[this.value] = this.checked;
}

function UIToolVBSpecific() {
    flag.tool.vbSpecific = this.value;
}

function UILoadingStatus(status, text, progress = 100) {
    switch (status) {
        case 'info': {
            $('#loadingbar').css('background-color', '#4060a0');
            break;
        }
        case 'download': {
            $('#loadingbar').css('background-color', '#30a030');
            break;
        }
        case 'warn': {
        }
        case 'error': {
            $('#loadingbar').css('background-color', '#cc0000');
            break;
        }
    }
    if (progress !== -1) $('#loadingbar').css('width', `${progress}%`);
    if (text !== '') $('#loadingtext').text(text);
}

function UIUpdateMapInfo() {
    $('#song-author').text(map.info._songAuthorName);
    $('#song-name').text(map.info._songName);
    $('#song-subname').text(map.info._songSubName);
    $('#song-bpm').text(`${round(map.info._beatsPerMinute, 3)} BPM`);
    $('#level-author').text(`Mapped by ${map.info._levelAuthorName ? map.info._levelAuthorName : 'Unknown Mapper'}`);
    $('#environment').text(`${envName[map.info._environmentName] || 'Unknown'} Environment`);

    $('#input-container').css('display', 'none');
    $('.metadata').css('display', 'block');
}

// case for multiple BPM map
function UIUpdateMapInfoBPM(min, max) {
    $('#song-bpm').text(
        '(' +
            round(map.info._beatsPerMinute, 3) +
            ') ' +
            round(min, 3) +
            '-' +
            round(max, 3) +
            'BPM' +
            (flag.map.bpm.odd ? ' ⚠️ inconsistent BPM between difficulty.' : '')
    );
}

function UIPopulateCharSelect() {
    $('#mapset').empty();
    for (let i = 0, len = map.info._difficultyBeatmapSets.length; i < len; i++) {
        $('#mapset').append(
            $('<option>', {
                value: map.info._difficultyBeatmapSets[i]._beatmapCharacteristicName,
                text:
                    modeRename[map.info._difficultyBeatmapSets[i]._beatmapCharacteristicName] ||
                    map.info._difficultyBeatmapSets[i]._beatmapCharacteristicName,
            })
        );
    }
    tool.select.char = map.info._difficultyBeatmapSets[0]._beatmapCharacteristicName;
    UIPopulateDiffSelect(map.info._difficultyBeatmapSets[0]);
}

function UIPopulateDiffSelect(mapSet) {
    $('#mapdiff').empty();
    for (let i = mapSet._difficultyBeatmaps.length - 1; i >= 0; i--) {
        let diffName = diffRename[mapSet._difficultyBeatmaps[i]._difficulty] || mapSet._difficultyBeatmaps[i]._difficulty;
        if (mapSet._difficultyBeatmaps[i]._customData)
            if (
                mapSet._difficultyBeatmaps[i]._customData._difficultyLabel &&
                mapSet._difficultyBeatmaps[i]._customData._difficultyLabel !== ''
            )
                diffName = `${mapSet._difficultyBeatmaps[i]._customData._difficultyLabel} -- ${diffName}`;
        $('#mapdiff').append(
            $('<option>', {
                value: mapSet._difficultyBeatmaps[i]._difficulty,
                text: diffName,
            })
        );
    }
    tool.select.diff = mapSet._difficultyBeatmaps[mapSet._difficultyBeatmaps.length - 1]._difficulty;
    if (flag.loaded) UIOutputDisplay(tool.select.char, tool.select.diff);
}

// i could just make a table but i dont want to
function UICreateDiffSet(charName) {
    let charRename = modeRename[charName] || charName;

    $('#stats').append([
        $('<div>', {
            id: charName,
            class: 'char-container',
        }).append(
            $('<span>', {
                class: 'char-label',
                text: charRename,
            })
        ),
    ]);
}

async function UICreateDiffInfo(charName, diff) {
    let diffName = diffRename[diff._difficulty] || diff._difficulty;
    let offset = 0;
    let BPMChanges;
    let customColor = {
        _colorLeft: colorScheme[envColor[map.info._environmentName]]?._colorLeft || null,
        _colorRight: colorScheme[envColor[map.info._environmentName]]?._colorRight || null,
        _envColorLeft: colorScheme[envColor[map.info._environmentName]]?._envColorLeft || null,
        _envColorRight: colorScheme[envColor[map.info._environmentName]]?._envColorRight || null,
        _envColorLeftBoost: colorScheme[envColor[map.info._environmentName]]?._envColorLeftBoost || null,
        _envColorRightBoost: colorScheme[envColor[map.info._environmentName]]?._envColorRightBoost || null,
        _obstacleColor: colorScheme[envColor[map.info._environmentName]]?._obstacleColor || null,
    };
    let hasChroma = false;
    if (diff._customData) {
        if (diff._customData._difficultyLabel && diff._customData._difficultyLabel !== '') {
            diffName = `${diff._customData._difficultyLabel} -- ${diffName}`;
        }
        if (diff._customData._editorOffset) {
            offset = diff._customData._editorOffset / 1000;
        }
        if (!hasChroma && diff._customData._suggestions) {
            hasChroma = diff._customData._suggestions.includes('Chroma');
        }
        if (!hasChroma && diff._customData._requirements) {
            hasChroma = diff._customData._requirements.includes('Chroma');
        }
        if (diff._customData._colorLeft) {
            customColor._colorLeft = rgbaToHex(diff._customData._colorLeft);
        }
        if (diff._customData._colorRight) {
            customColor._colorRight = rgbaToHex(diff._customData._colorRight);
        }
        if (diff._customData._envColorLeft) {
            customColor._envColorLeft = rgbaToHex(diff._customData._envColorLeft);
        } else if (diff._customData._colorLeft) {
            customColor._envColorLeft = customColor._colorLeft;
        }
        if (diff._customData._envColorRight) {
            customColor._envColorRight = rgbaToHex(diff._customData._envColorRight);
        } else if (diff._customData._colorRight) {
            customColor._envColorRight = customColor._colorRight;
        }

        // tricky stuff
        // need to display both boost if one exist
        let envBL,
            envBR,
            envBoost = false;
        if (diff._customData._envColorLeftBoost) {
            envBL = rgbaToHex(diff._customData._envColorLeftBoost);
            envBoost = true;
        } else {
            envBL = colorScheme[envColor[map.info._environmentName]]?._envColorLeftBoost || customColor._envColorLeft;
        }
        if (diff._customData._envColorRightBoost) {
            envBR = rgbaToHex(diff._customData._envColorRightBoost);
            envBoost = true;
        } else {
            envBR = colorScheme[envColor[map.info._environmentName]]?._envColorRightBoost || customColor._envColorRight;
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
        if (diff._data._customData._BPMChanges) {
            BPMChanges = diff._data._customData._BPMChanges;
        }
        if (diff._data._customData._bpmChanges) {
            BPMChanges = diff._data._customData._bpmChanges;
        }
    }
    const mapSettings = {
        bpm: map.info._beatsPerMinute,
        bpmc: getBPMChangesTime(map.info._beatsPerMinute, offset, BPMChanges),
        offset: offset,
        njs: diff._noteJumpMovementSpeed || fallbackNJS[diff._difficulty],
        njsOffset: diff._noteJumpStartBeatOffset,
    };
    const notes = getNoteCount(diff._data._notes);
    const events = getEventCount(diff._data._events);
    let chromaW = countChromaObstacle(diff._data._obstacles);
    const sliderSpeed = {
        min: getMinSliderSpeed(diff._data._notes),
        max: getMaxSliderSpeed(diff._data._notes),
    };
    if (sliderSpeed.max > sliderSpeed.min) {
        sliderSpeed.max = 0;
    }
    const sps = swingPerSecondInfo(diff._data);
    if (charName === 'Standard') {
        map.analysis.sps.push(sps.total.overall);
    }
    if (!hasChroma && (chromaW || notes.chromaN || notes.chromaB || events.chroma)) {
        map.analysis.missing.chroma = true;
    }
    // general map stuff
    const textMap = [];
    let tableNJS = $('<table>');
    $('<caption>').append(`Map Settings:`).appendTo(tableNJS);
    $('<tr>')
        .append(`<th>NJS</th><td>${round(diff._noteJumpMovementSpeed, 3)}</td>`)
        .appendTo(tableNJS);
    $('<tr>')
        .append(`<th>Offset</th><td>${round(diff._noteJumpStartBeatOffset, 3)}</td>`)
        .appendTo(tableNJS);
    $('<tr>')
        .append(`<th>HJD</th><td>${round(getHalfJumpDuration(mapSettings), 3)}</td>`)
        .appendTo(tableNJS);
    $('<tr>')
        .append(`<th>Jump Distance</th><td>${round(getJumpDistance(mapSettings), 3)}</td>`)
        .appendTo(tableNJS);
    $('<tr>')
        .append(`<th>Reaction Time</th><td>${round((60 / mapSettings.bpm) * getHalfJumpDuration(mapSettings) * 1000)}ms</td>`)
        .appendTo(tableNJS);
    if (mapSettings.bpmc.length > 0) {
        textMap.push(`BPM changes: ${mapSettings.bpmc.length}`);
    }
    textMap.push(`Effective BPM: ${findEffectiveBPM(diff._data._notes, mapSettings.bpm).toFixed(2)}`);
    textMap.push(`Effective BPM (swing): ${findEffectiveBPMSwing(diff._data._notes, mapSettings.bpm).toFixed(2)}`);
    if (sliderSpeed.min > 0) {
        textMap.push(`Min. Slider Speed: ${round(sliderSpeed.min * 1000, 1)}ms`);
        textMap.push(`Max. Slider Speed: ${round(sliderSpeed.max * 1000, 1)}ms`);
    }

    // nps and sps
    let tableNPS = $('<table>');
    $('<caption>').append('Note Per Second (NPS):').appendTo(tableNPS);
    $('<tr>')
        .append(`<th colspan="2">Overall</th><td>${calcNPS(notes.red + notes.blue).toFixed(2)}</td>`)
        .appendTo(tableNPS);
    $('<tr>')
        .append(
            `<th colspan="2">Mapped</th><td>${calcNPSMapped(notes.red + notes.blue, diff._data._duration).toFixed(2)}</td>`
        )
        .appendTo(tableNPS);
    $('<tr>')
        .append(`<th rowspan="3">Peak</th><th>16-beat</th><td>${calcPeakNPS(diff._data._notes, 16).toFixed(2)}</td>`)
        .appendTo(tableNPS);
    $('<tr>')
        .append(`<th>8-beat</th><td>${calcPeakNPS(diff._data._notes, 8).toFixed(2)}</td>`)
        .appendTo(tableNPS);
    $('<tr>')
        .append(`<<th>4-beat</th><td>${calcPeakNPS(diff._data._notes, 4).toFixed(2)}</td>`)
        .appendTo(tableNPS);

    let tableSPS = $('<table>');
    $('<caption>').append('Swing Per Second (SPS):').appendTo(tableSPS);
    $('<tr>').append(`<th></th><th>Total</th><th>Red</th><th>Blue</th>`).appendTo(tableSPS);
    $('<tr>')
        .append(
            `<th>Overall</th><td>${sps.total.overall.toFixed(2)}</td><td>${sps.red.overall.toFixed(
                2
            )}</td><td>${sps.blue.overall.toFixed(2)}</td>`
        )
        .appendTo(tableSPS);
    $('<tr>')
        .append(
            `<th>Median</th><td>${sps.total.median.toFixed(1)}</td><td>${sps.red.median.toFixed(
                1
            )}</td><td>${sps.blue.median.toFixed(1)}</td>`
        )
        .appendTo(tableSPS);
    $('<tr>')
        .append(
            `<th>Peak</th><td>${sps.total.peak.toFixed(1)}</td><td>${sps.red.peak.toFixed(1)}</td><td>${sps.blue.peak.toFixed(
                1
            )}</td>`
        )
        .appendTo(tableSPS);
    $('<tr>')
        .append(`<th>Total</th><td>${sps.total.total}</td><td>${sps.red.total}</td><td>${sps.blue.total}</td>`)
        .appendTo(tableSPS);

    // notes
    let tableNote = $('<table>');
    $('<caption>')
        .append(`Notes: ${notes.red + notes.blue}<br>Bombs: ${notes.bomb}`)
        .appendTo(tableNote);
    $('<tr>')
        .append(
            `<th style="text-align: center">Red</th><th style="text-align: center">Blue</th><th style="text-align: center">R/B Ratio</th>`
        )
        .appendTo(tableNote);
    $('<tr>')
        .append(`<td>${notes.red}</td><td>${notes.blue}</td><td>${round(notes.blue ? notes.red / notes.blue : 0, 2)}</td>`)
        .appendTo(tableNote);
    if (notes.chromaN) {
        $('<tr>')
            .append(`<th colspan="2">Chroma Note${hasChroma ? '' : '<br>⚠️ not suggested'}</th><td>${notes.chromaN}</td>`)
            .appendTo(tableNote);
    }
    if (notes.chromaB) {
        $('<tr>')
            .append(`<th colspan="2">Chroma Bomb${hasChroma ? '' : '<br>⚠️ not suggested'}</th><td>${notes.chromaB}</td>`)
            .appendTo(tableNote);
    }

    let tableNoteIL = $('<table>');
    $('<caption>').append('Note Placement:').appendTo(tableNoteIL);
    // start from top
    for (let layer = 2; layer >= 0; layer--) {
        let tableLayer = $('<tr>');
        for (let index = 0; index < 4; index++) {
            tableLayer.append(
                `<td id="${index}_${layer}" style="padding: 0">${countNoteIndexLayer(diff._data._notes, index, layer)}</td>`
            );
        }
        tableLayer.append(
            `<td class="no-border" style="font-size: 0.875em; vertical-align: middle">${
                notes.blue || notes.red
                    ? round((countNoteLayer(diff._data._notes, layer) / (notes.red + notes.blue)) * 100, 1)
                    : 0
            }%</td>`
        );
        tableNoteIL.append(tableLayer);
    }
    let tableLayer = $('<tr>');
    for (let index = 0; index < 4; index++) {
        tableLayer.append(
            `<td class="no-border" style="font-size: 0.875em; vertical-align: middle">${
                notes.blue || notes.red
                    ? round((countNoteIndex(diff._data._notes, index) / (notes.red + notes.blue)) * 100, 1)
                    : 0
            }%</td>`
        );
    }
    tableNoteIL.append(tableLayer);

    let tableObstacle = $('<table>');
    $('<caption>').append(`Obstacles: ${diff._data._obstacles.length}`).appendTo(tableObstacle);
    let interactiveObstacle = countInteractiveObstacle(diff._data._obstacles);
    if (interactiveObstacle > 0) {
        $('<tr>').append(`<th>Interactive</th><td>${interactiveObstacle}</td>`).appendTo(tableObstacle);
    }
    let crouchObstacle = detectCrouchObstacle(diff._data, mapSettings);
    if (crouchObstacle.length > 0) {
        $('<tr>').append(`<th>Crouch</th><td>${crouchObstacle.length}</td>`).appendTo(tableObstacle);
    }
    if (chromaW > 0) {
        $('<tr>')
            .append(`<th>Chroma${hasChroma ? '' : '<br>⚠️ not suggested'}</th><td>${chromaW}</td>`)
            .appendTo(tableObstacle);
    }

    // events n stuff
    const textEvent = [];
    if (events.rot) {
        textEvent.push(`Events: ${diff._data._events.length}`);
    }
    let tableLighting = $('<table>');
    $('<caption>')
        .append(
            `Lighting: ${
                events.light.backTop +
                events.light.ring +
                events.light.leftLaser +
                events.light.rightLaser +
                events.light.center +
                events.boost +
                events.rrotate +
                events.rzoom +
                events.laser
            }`
        )
        .appendTo(tableLighting);
    $('<tr>').append(`<th>Back Top Lasers</th><td>${events.light.backTop}</td>`).appendTo(tableLighting);
    $('<tr>').append(`<th>Ring Lights</th><td>${events.light.ring}</td>`).appendTo(tableLighting);
    $('<tr>').append(`<th>Left Lasers</th><td>${events.light.leftLaser}</td>`).appendTo(tableLighting);
    $('<tr>').append(`<th>Right Lasers</th><td>${events.light.rightLaser}</td>`).appendTo(tableLighting);
    $('<tr>').append(`<th>Center Lights</th><td>${events.light.center}</td>`).appendTo(tableLighting);
    if (events.boost > 0) {
        $('<tr>').append(`<th>Colour Boost</th><td>${events.boost}</td>`).appendTo(tableLighting);
    }
    $('<tr>').append(`<th>Ring Rotation</th><td>${events.rrotate}</td>`).appendTo(tableLighting);
    $('<tr>').append(`<th>Ring Zoom</th><td>${events.rzoom}</td>`).appendTo(tableLighting);
    $('<tr>').append(`<th>Laser Rotation</th><td>${events.laser}</td>`).appendTo(tableLighting);
    if (events.chroma || events.ogc) {
        if (events.chroma) {
            $('<tr>')
                .append(`<th>Chroma${hasChroma ? '' : '<br>⚠️ not suggested'}</th><td>${events.chroma}</td>`)
                .appendTo(tableLighting);
        }
        if (events.ogc) {
            $('<tr>').append(`<th>OG Chroma</th><td>${events.ogc}</td>`).appendTo(tableLighting);
        }
    }
    if (events.rot) {
        textEvent.push(
            `Lane Rotation: ${
                charName === '90Degree' || charName === '360Degree' ? events.rot : `${events.rot} ⚠️ not 360/90 mode`
            }`
        );
    }

    // set header
    let diffHeader = $('<div>', {
        class: 'diff-header',
        css: {
            'background-color': diffColor[diff._difficulty],
        },
    });

    let diffLabel = $('<span>', {
        class: 'diff-label',
        text: diffName,
    });
    diffLabel.appendTo(diffHeader);

    let diffDotContainer = $('<div>', {
        class: 'diff-dot-container',
    });
    for (const k in customColor) {
        if (customColor[k] !== null) {
            let colorDot = $('<span>', {
                class: 'diff-dot',
                id: k,
                css: {
                    'background-color': customColor[k],
                },
            });
            colorDot.appendTo(diffDotContainer);
        }
    }
    diffDotContainer.appendTo(diffHeader);

    // set subpanel
    // map
    let diffPanelMap = $('<div>', {
        class: 'diff-panel map',
    });
    $('<div>').append(tableNJS).appendTo(diffPanelMap);
    $('<br>').appendTo(diffPanelMap);
    diffPanelMap.append(textMap.join('<br>'));

    // stats
    let diffPanelStats = $('<div>', {
        class: 'diff-panel stats',
    });
    $('<div>').append(tableNPS).appendTo(diffPanelStats);
    $('<br>').appendTo(diffPanelStats);
    $('<div>').append(tableSPS).appendTo(diffPanelStats);

    // object
    let diffPanelObject = $('<div>', {
        class: 'diff-panel objects',
    });
    $('<div>').append(tableNote).appendTo(diffPanelObject);
    $('<br>').appendTo(diffPanelObject);
    $('<div>').append(tableNoteIL).appendTo(diffPanelObject);
    $('<br>').appendTo(diffPanelObject);
    $('<div>').append(tableObstacle).appendTo(diffPanelObject);

    // event
    let diffPanelEvent = $('<div>', {
        class: 'diff-panel events',
        html: textEvent.join('<br>'),
    });
    $('<div>').append(tableLighting).appendTo(diffPanelEvent);

    // merge all panel into container
    let diffContainer = $('<div>', {
        class: `diff-container ${diff._difficulty}`,
    });
    diffContainer.append(diffHeader);
    diffContainer.append(diffPanelMap);
    diffContainer.append(diffPanelStats);
    diffContainer.append(diffPanelObject);
    diffContainer.append(diffPanelEvent);

    $(`#${charName}`).append(diffContainer);
}

function UIOutputDisplay(cs, ds) {
    let mapa = map.analysis.diff.find((ma) => ma.mapSet === cs && ma.diff === ds);
    let char = map.info._difficultyBeatmapSets.find((c) => c._beatmapCharacteristicName === cs);
    let diff = char._difficultyBeatmaps.find((d) => d._difficulty === ds);
    $('#output-difficulty-name').html(diffRename[ds] || ds);
    $('#output-difficulty-label')
        .attr('class', `diff-labels diff-count-${char._difficultyBeatmaps.length}`)
        .html(diff._customData?._difficultyLabel || diffRename[ds] || ds);
    $('#output-diff').html(mapa.text.join('<br>'));
    if (!mapa.text.length > 0) {
        $('#output-diff').html('No issue(s) found.');
    }
}
