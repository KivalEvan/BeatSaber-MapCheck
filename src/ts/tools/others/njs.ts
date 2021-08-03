import * as beatmap from '../../beatmap';
import { round } from '../../utils';
import { BeatmapSettings, Tool } from '../template';

const tool: Tool = {
    name: 'Note Jump Speed',
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 0,
        output: 0,
    },
    input: {
        enabled: true,
        params: {},
    },
    output: {
        html: null,
    },
    run: run,
};

function run(mapSettings: BeatmapSettings, mapSet?: beatmap.map.BeatmapSetData): void {
    if (!mapSet) {
        throw new Error('something went wrong!');
    }
    const { _njs: njs, _bpm: bpm } = mapSettings;
    const htmlString: string[] = [];

    if (mapSet._info._noteJumpMovementSpeed === 0) {
        htmlString.push(`<b>Unset NJS</b>: fallback NJS is used`);
    }
    if (njs.value > 23) {
        htmlString.push(
            `<b>NJS is too high (${round(njs.value, 2)}):</b> use lower whenever necessary`
        );
    }
    if (njs.jd < 18) {
        htmlString.push(`<b>Very low jump distance:</b> ${round(njs.jd, 2)}`);
    }
    if (njs.jd > 36) {
        htmlString.push(`<b>Very high jump distance:</b> ${round(njs.jd, 2)}`);
    }
    if (njs.jd > njs.calcJumpDistanceOptimalHigh()) {
        htmlString.push(
            `<b>High jump distance (>${round(njs.calcJumpDistanceOptimalHigh(), 2)}):</b> ${round(
                njs.jd,
                2
            )} at ${round(njs.value, 2)} NJS may be uncomfortable to play`
        );
    }
    if (bpm.toRealTime(njs.hjd) < 0.45) {
        htmlString.push(
            `<b>Very quick reaction time (${round(
                bpm.toRealTime(njs.hjd) * 1000
            )}ms):</b> may lead to suboptimal gameplay`
        );
    }
    if (njs.calcHalfJumpDurationRaw() + njs.offset < njs.hjd) {
        htmlString.push(`<b>Unnecessary negative NJS offset:</b> HJD will not drop 1`);
    }

    if (htmlString.length) {
        const htmlResult = document.createElement('div');
        htmlResult.innerHTML = htmlString.join('<br>');
        tool.output.html = htmlResult;
    } else {
        tool.output.html = null;
    }
}

export default tool;
