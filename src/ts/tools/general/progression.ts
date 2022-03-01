import * as beatmap from '../../beatmap';
import { BeatmapSettings, Tool } from '../template';
import { round } from '../../utils';

const tool: Tool = {
    name: 'Progression',
    description: 'Placeholder',
    type: 'general',
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

function run(
    mapSettings: BeatmapSettings,
    mapSet?: beatmap.types.BeatmapSetData,
    mapInfo?: beatmap.types.InfoData,
    sps?: beatmap.v2.swing.SwingAnalysis[]
): void {
    const { _audioDuration: audioDuration } = mapSettings;
    if (!audioDuration) {
        tool.output.html = null;
        return;
    }
    if (!sps) {
        throw new Error('no sps');
    }
    const filteredSPS = sps
        .filter((a) => a.mode === 'Standard')
        .sort((a, b) => a.sps.total.overall - b.sps.total.overall);
    if (!filteredSPS.length) {
        tool.output.html = null;
        return;
    }
    const minSPS = audioDuration < 120 ? 3.2 : audioDuration < 240 ? 4.2 : 5.2;

    const htmlString: string[] = [];
    if (
        audioDuration < 240 &&
        beatmap.v2.swing.getSPSLowest(filteredSPS) > minSPS &&
        beatmap.v2.swing.calcSPSTotalPercDrop(filteredSPS) < 60
    ) {
        htmlString.push(
            `<b>Minimum SPS not met (<${minSPS}):</b> lowest is ${round(
                beatmap.v2.swing.getSPSLowest(filteredSPS),
                2
            )}`
        );
    }
    const progMax = beatmap.v2.swing.getProgressionMax(filteredSPS, minSPS);
    const progMin = beatmap.v2.swing.getProgressionMin(filteredSPS, minSPS);
    if (progMax && audioDuration < 360) {
        htmlString.push(
            `<b>Violates progression:</b> ${progMax.difficulty} exceeded 40% SPS drop`
        );
    }
    if (progMin && audioDuration < 360) {
        htmlString.push(
            `<b>Violates progression:</b> ${progMin.difficulty} has less than 10% SPS drop`
        );
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
