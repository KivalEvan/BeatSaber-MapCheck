import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import SavedData from '../../savedData';
import * as swing from '../../analyzers/swing';
import { printResult } from '../helpers';
import UICheckbox from '../../ui/helpers/checkbox';

const name = 'Difficulty Progression';
const description = 'For ranking purpose, check difficuly progression to fit rankability criteria.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'general',
    order: {
        input: ToolInputOrder.GENERAL_PROGRESSION,
        output: ToolOutputOrder.GENERAL_PROGRESSION,
    },
    input: {
        enabled,
        params: {},
        html: UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
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

    const htmlResult: HTMLElement[] = [];
    if (
        audioDuration < 240 &&
        swing.getSPSLowest(filteredSPS) > minSPS &&
        swing.calcSPSTotalPercDrop(filteredSPS) < 60
    ) {
        htmlResult.push(
            printResult(`Minimum SPS not met (<${minSPS})`, `lowest is ${round(swing.getSPSLowest(filteredSPS), 2)}`),
        );
    }
    const progMax = swing.getProgressionMax(filteredSPS, minSPS);
    const progMin = swing.getProgressionMin(filteredSPS, minSPS);
    if (progMax && audioDuration < 360) {
        htmlResult.push(printResult('Violates progression', `${progMax.difficulty} exceeded 40% SPS drop`));
    }
    if (progMin && audioDuration < 360) {
        htmlResult.push(printResult('Violates progression', `${progMin.difficulty} has less than 10% SPS drop`));
    }

    if (htmlResult.length) {
        const htmlContainer = document.createElement('div');
        htmlResult.forEach((h) => htmlContainer.append(h));
        tool.output.html = htmlContainer;
    } else {
        tool.output.html = null;
    }
}

export default tool;
