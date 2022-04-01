// idk i just needed init just so this shit fukin import
// but at the same time i need some way to initialise some variable like watermark, version, etc.
import settings from '../settings';
import version from '../version';
import uiFooter from './footer';
import uiSettings from './settings';
import uiAccordion from './accordion';
import uiTheme from './theme';
import uiTools from './tools';

export default (function () {
    let executed = false;
    return function () {
        if (!executed) {
            executed = true;
            uiSettings.setTheme(settings.theme);
            uiFooter.setWatermark(version.watermark);
            uiFooter.setVersion(version.value);
            uiTools.populateTool();
            for (const id in settings.load) {
                uiSettings.setLoadCheck(id, settings.load[id]);
            }
            uiSettings.setSortCheck(settings.sorting);
            for (const id in settings.show) {
                uiAccordion.show(id, settings.show[id]);
                uiSettings.setShowCheck(id, settings.show[id]);
            }
            for (const id in settings.onLoad) {
                uiSettings.setOnLoadCheck(id, settings.onLoad[id]);
            }
            uiTheme.set(settings.theme);
            console.log('user interface initialised.');
        }
    };
})();
