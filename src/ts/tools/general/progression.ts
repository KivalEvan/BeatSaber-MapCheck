import { Tool, ToolArgs } from '../../types/mapcheck';
import { round } from '../../utils';
import SavedData from '../../savedData';
import * as swing from '../../analyzers/swing';

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
    run,
};

function run(map: ToolArgs) {
    const { audioDuration: audioDuration } = map.settings;
    if (!audioDuration) {
        tool.output.html = null;
        return;
    }
    const filteredSPS = SavedData.beatmapDifficulty
        .map((d) => d.swingAnalysis)
        .filter((a) => a.characteristic === 'Standard')
        .sort((a, b) => a.total.count - b.total.count);
    if (!filteredSPS.length) {
        tool.output.html = null;
        return;
    }
    const minSPS = audioDuration < 120 ? 3.2 : audioDuration < 240 ? 4.2 : 5.2;

    const htmlString: string[] = [];
    if (
        audioDuration < 240 &&
        swing.getSPSLowest(filteredSPS) > minSPS &&
        swing.calcSPSTotalPercDrop(filteredSPS) < 60
    ) {
        htmlString.push(
            `<b>Minimum SPS not met (<${minSPS}):</b> lowest is ${round(
                swing.getSPSLowest(filteredSPS),
                2
            )}`
        );
    }
    const progMax = swing.getProgressionMax(filteredSPS, minSPS);
    const progMin = swing.getProgressionMin(filteredSPS, minSPS);
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
