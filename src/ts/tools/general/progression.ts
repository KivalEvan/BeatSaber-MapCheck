import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import { round } from '../../utils';
import SavedData from '../../savedData';
import * as swing from '../../analyzers/swing/mod';
import { printResult } from '../helpers';
import UICheckbox from '../../ui/helpers/checkbox';
import { DifficultyRename } from '../../beatmap/shared/difficulty';
import { DifficultyName } from '../../types';

const name = 'Difficulty Progression';
const description = 'For ranking purpose, check difficuly progression to fit rankability criteria.';
const enabled = true;

const htmlContainer = document.createElement('div');
const htmlDifficultyList = document.createElement('ul');

const diffList: DifficultyName[] = ['ExpertPlus', 'Expert', 'Hard', 'Normal', 'Easy'];
for (const diff of diffList) {
    htmlDifficultyList.appendChild(
        UICheckbox.create(
            DifficultyRename[diff],
            `Toggle check progression for Standard ${DifficultyRename[diff]}`,
            true,
            function (this: HTMLInputElement) {
                tool.input.params[diff] = this.checked;
            },
        ),
    );
}

htmlContainer.appendChild(
    UICheckbox.create(name, description, enabled, function (this: HTMLInputElement) {
        tool.input.enabled = this.checked;
    }),
);
htmlContainer.appendChild(htmlDifficultyList);

const tool: Tool<{ [k in DifficultyName]: boolean }> = {
    name,
    description,
    type: 'general',
    order: {
        input: ToolInputOrder.GENERAL_PROGRESSION,
        output: ToolOutputOrder.GENERAL_PROGRESSION,
    },
    input: {
        enabled,
        params: {
            ExpertPlus: true,
            Expert: true,
            Hard: true,
            Normal: true,
            Easy: true,
        },
        html: htmlContainer,
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
        .filter(
            (a) =>
                a.characteristic === 'Standard' &&
                tool.input.params[a.difficulty] &&
                a.total.total > 0,
        )
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
                'rank',
            ),
        );
    }
    const progMax = swing.getProgressionMax(filteredSPS, minSPS);
    const progMin = swing.getProgressionMin(filteredSPS, minSPS);
    if (progMax && audioDuration < 360) {
        htmlResult.push(
            printResult(
                'Violates progression',
                `${DifficultyRename[progMax.result.difficulty]} exceeded 40% SPS drop, ${round(
                    progMax.result.total.average,
                    2,
                )} from ${round(progMax.comparedTo?.total?.average || 0, 2)} ${
                    DifficultyRename[progMax.comparedTo!.difficulty]
                }, acceptable range (${round(
                    (progMax.comparedTo?.total?.average || 0) * 0.6,
                    2,
                )}-${round((progMax.comparedTo?.total.average || 0) * 0.9, 2)})`,
                'rank',
            ),
        );
    }
    if (progMin && audioDuration < 360) {
        htmlResult.push(
            printResult(
                'Violates progression',
                `${DifficultyRename[progMin.result.difficulty]} has less than 10% SPS drop, ${round(
                    progMin.result.total.average,
                    2,
                )} from ${round(progMin.comparedTo?.total.average || 0, 2)} ${
                    DifficultyRename[progMin.comparedTo!.difficulty]
                }, acceptable range (${round(
                    (progMin.comparedTo?.total.average || 0) * 0.6,
                    2,
                )}-${round((progMin.comparedTo?.total.average || 0) * 0.9, 2)})`,
                'rank',
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
