import { Tool, ToolArgs } from '../../types/mapcheck';
import UICheckbox from '../../ui/checkbox';
import { round, toMMSS } from '../../utils';

const name = 'Outside Playable Object';

const tool: Tool = {
    name: name,
    description: 'Placeholder',
    type: 'other',
    order: {
        input: 10,
        output: 10,
    },
    input: {
        enabled: true,
        params: {},
        html: UICheckbox.create(name, name, true, function (this: HTMLInputElement) {
            tool.input.enabled = this.checked;
        }),
    },
    output: {
        html: null,
    },
    run,
};

function run(map: ToolArgs) {
    const { bpm, audioDuration: duration } = map.settings;
    const { colorNotes, obstacles, basicBeatmapEvents } = map.difficulty.data;

    const htmlString: string[] = [];
    if (duration) {
        let endBeat = bpm.toBeatTime(duration);
        if (colorNotes.length && colorNotes[0].time < 0) {
            htmlString.push(
                `<b>Note(s) before start time:</b> ${round(
                    colorNotes[0].time,
                    3
                )} (${toMMSS(bpm.toRealTime(colorNotes[0].time))})`
            );
        }
        if (obstacles.length && obstacles[0].time < 0) {
            htmlString.push(
                `<b>Obstacle(s) before start time:</b> ${round(
                    obstacles[0].time,
                    3
                )} (${toMMSS(bpm.toRealTime(obstacles[0].time))})`
            );
        }
        if (basicBeatmapEvents.length && basicBeatmapEvents[0].time < 0) {
            htmlString.push(
                `<b>Event(s) before start time:</b> ${round(
                    basicBeatmapEvents[0].time,
                    3
                )} (${toMMSS(bpm.toRealTime(basicBeatmapEvents[0].time))})`
            );
        }
        if (colorNotes.length && colorNotes[colorNotes.length - 1].time > endBeat) {
            htmlString.push(
                `<b>Note(s) after end time:</b> ${round(
                    colorNotes[colorNotes.length - 1].time,
                    3
                )} (${toMMSS(bpm.toRealTime(colorNotes[colorNotes.length - 1].time))})`
            );
        }
        if (obstacles.length && obstacles[obstacles.length - 1].time > endBeat) {
            htmlString.push(
                `<b>Obstacle(s) after end time:</b> ${round(
                    obstacles[obstacles.length - 1].time,
                    3
                )} (${toMMSS(bpm.toRealTime(obstacles[obstacles.length - 1].time))})`
            );
        }
        if (
            basicBeatmapEvents.length &&
            basicBeatmapEvents[basicBeatmapEvents.length - 1].time > endBeat
        ) {
            htmlString.push(
                `<b>Event(s) after end time:</b> ${round(
                    basicBeatmapEvents[basicBeatmapEvents.length - 1].time,
                    3
                )} (${toMMSS(
                    bpm.toRealTime(
                        basicBeatmapEvents[basicBeatmapEvents.length - 1].time
                    )
                )})`
            );
        }
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
