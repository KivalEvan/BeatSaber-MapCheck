// idk i just needed init just so this shit fukin import
// but at the same time i need some way to initialise some variable like watermark, version, etc.
import settings from '../settings';
import version from '../version';
import * as uiFooter from './footer';
import * as uiSettings from './settings';
import * as uiAccordion from './accordion';
import * as uiTheme from './theme';

export default (function () {
    let executed = false;
    return function () {
        if (!executed) {
            executed = true;
            uiSettings.setTheme(settings.theme);
            uiFooter.setWatermark(version.watermark);
            uiFooter.setVersion(version.value);
            for (const id in settings.show) {
                uiAccordion.show(id, settings.show[id]);
                uiSettings.setShowCheck(id, settings.show[id]);
            }
            uiTheme.set(settings.theme);
            console.log('user interface initialised');
        }
    };
})();
