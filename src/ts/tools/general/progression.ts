import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import SavedData from '../../savedData';
import * as swing from '../../analyzers/swing';
import { printResult } from '../helpers';
import UICheckbox from '../../ui/helpers/checkbox';
import { DifficultyRename } from '../../beatmap/shared/difficulty';

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
        .sort((a, b) => a.total.average - b.total.average)
        .reverse();
    if (!filteredSPS.length) {
        tool.output.html = null;
        return;
    }
    const minSPS = Math.max(
        audioDuration < 120 ? 3.2 : audioDuration < 240 ? 4.2 : 5.2,
        round(swing.getSPSHighest(filteredSPS) * 0.4, 2),
    );

    const htmlResult: HTMLElement[] = [];
    if (audioDuration < 360 && swing.getSPSLowest(filteredSPS) > minSPS) {
        htmlResult.push(
            printResult(
                `Minimum SPS not met (<${minSPS})`,
                `lowest SPS is ${round(swing.getSPSLowest(filteredSPS), 2)}, ${round(
                    swing.calcSPSTotalPercDrop(filteredSPS),
                    2,
                )}% drop from highest SPS (${round(swing.getSPSHighest(filteredSPS), 2)})`,
            ),
        );
    }
    const progMax = swing.getProgressionMax(filteredSPS, minSPS);
    const progMin = swing.getProgressionMin(filteredSPS, minSPS);
    if (progMax && audioDuration < 360) {
        htmlResult.push(
            printResult(
                'Violates progression',
                `${DifficultyRename[progMax.result.difficulty]} exceeded 40% SPS drop from ${round(
                    progMax.result.total.average,
                    2,
                )}, acceptable range (${round(progMax.min, 2)}-${round(progMax.max, 2)})`,
            ),
        );
    }
    if (progMin && audioDuration < 360) {
        htmlResult.push(
            printResult(
                'Violates progression',
                `${DifficultyRename[progMin.result.difficulty]} has less than 10% SPS drop from ${round(
                    progMin.result.total.average,
                    2,
                )}, acceptable range (${round(progMin.min, 2)}-${round(progMin.max, 2)})`,
            ),
        );
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
