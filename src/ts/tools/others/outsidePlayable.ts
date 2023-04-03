import { Tool, ToolArgs, ToolInputOrder, ToolOutputOrder } from '../../types/mapcheck';
import UICheckbox from '../../ui/helpers/checkbox';
import { round, toMmss } from '../../utils';
import { printResult } from '../helpers';

const name = 'Outside Playable Object';
const description = 'Look for any object starting before and after song timer.';
const enabled = true;

const tool: Tool = {
    name,
    description,
    type: 'other',
    order: {
        input: ToolInputOrder.OTHERS_OUTSIDE_PLAYABLE,
        output: ToolOutputOrder.OTHERS_OUTSIDE_PLAYABLE,
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
    if (!map.difficulty) {
        console.error('Something went wrong!');
        return;
    }
    const { bpm, audioDuration: duration } = map.settings;
    const { colorNotes, bombNotes, obstacles, basicEvents, sliders, burstSliders } =
        map.difficulty.data;

    const htmlResult: HTMLElement[] = [];
    if (duration) {
        let endBeat = bpm.toBeatTime(duration, true);
        if (colorNotes.length && colorNotes[0].time < 0) {
            htmlResult.push(
                printResult(
                    'Note(s) before start time',
                    `${round(colorNotes[0].time, 3)} (${toMmss(
                        bpm.toRealTime(colorNotes[0].time),
                    )}`,
                    'error',
                ),
            );
        }
        if (bombNotes.length && bombNotes[0].time < 0) {
            htmlResult.push(
                printResult(
                    'Bomb(s) before start time',
                    `${round(bombNotes[0].time, 3)} (${toMmss(bpm.toRealTime(bombNotes[0].time))}`,
                    'error',
                ),
            );
        }
        if (sliders.length && sliders[0].time < 0) {
            htmlResult.push(
                printResult(
                    'Arc(s) before start time',
                    `${round(sliders[0].time, 3)} (${toMmss(bpm.toRealTime(sliders[0].time))}`,
                    'error',
                ),
            );
        }
        if (burstSliders.length && burstSliders[0].time < 0) {
            htmlResult.push(
                printResult(
                    'Chain(s) before start time',
                    `${round(burstSliders[0].time, 3)} (${toMmss(
                        bpm.toRealTime(burstSliders[0].time),
                    )}`,
                    'error',
                ),
            );
        }
        if (obstacles.length && obstacles[0].time < 0) {
            htmlResult.push(
                printResult(
                    'Obstacle(s) before start time',
                    `${round(obstacles[0].time, 3)} (${toMmss(bpm.toRealTime(obstacles[0].time))}`,
                    'error',
                ),
            );
        }
        if (basicEvents.length && basicEvents[0].time < 0) {
            htmlResult.push(
                printResult(
                    'Event(s) before start time',
                    `${round(basicEvents[0].time, 3)} (${toMmss(
                        bpm.toRealTime(basicEvents[0].time),
                    )}`,
                    'error',
                ),
            );
        }
        if (colorNotes.length && colorNotes[colorNotes.length - 1].time > endBeat) {
            htmlResult.push(
                printResult(
                    'Note(s) after end time',
                    `${round(colorNotes[colorNotes.length - 1].time, 3)} (${toMmss(
                        bpm.toRealTime(colorNotes[colorNotes.length - 1].time),
                    )})`,
                    'error',
                ),
            );
        }
        if (bombNotes.length && bombNotes[bombNotes.length - 1].time > endBeat) {
            htmlResult.push(
                printResult(
                    'Bomb(s) after end time',
                    `${round(bombNotes[bombNotes.length - 1].time, 3)} (${toMmss(
                        bpm.toRealTime(bombNotes[bombNotes.length - 1].time),
                    )})`,
                    'error',
                ),
            );
        }
        if (sliders.length && sliders[sliders.length - 1].time > endBeat) {
            htmlResult.push(
                printResult(
                    'Arc(s) after end time',
                    `${round(sliders[sliders.length - 1].time, 3)} (${toMmss(
                        bpm.toRealTime(sliders[sliders.length - 1].time),
                    )})`,
                    'error',
                ),
            );
        }
        if (burstSliders.length && burstSliders[burstSliders.length - 1].time > endBeat) {
            htmlResult.push(
                printResult(
                    'Chain(s) after end time',
                    `${round(burstSliders[burstSliders.length - 1].time, 3)} (${toMmss(
                        bpm.toRealTime(burstSliders[burstSliders.length - 1].time),
                    )})`,
                    'error',
                ),
            );
        }
        if (obstacles.length && obstacles[obstacles.length - 1].time > endBeat) {
            htmlResult.push(
                printResult(
                    'Obstacle(s) after end time',
                    `${round(obstacles[obstacles.length - 1].time, 3)} (${toMmss(
                        bpm.toRealTime(obstacles[obstacles.length - 1].time),
                    )})`,
                    'error',
                ),
            );
        }
        if (basicEvents.length && basicEvents[basicEvents.length - 1].time > endBeat) {
            htmlResult.push(
                printResult(
                    'Event(s) after end time',
                    `${round(basicEvents[basicEvents.length - 1].time, 3)} (${toMmss(
                        bpm.toRealTime(basicEvents[basicEvents.length - 1].time),
                    )})`,
                    'error',
                ),
            );
        }
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
