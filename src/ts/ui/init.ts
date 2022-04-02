// idk i just needed init just so this shit fukin import
// but at the same time i need some way to initialise some variable like watermark, version, etc.
import Settings from '../settings';
import Version from '../version';
import UIFooter from './footer';
import UISettings from './settings';
import UIAccordion from './accordion';
import UITheme from './theme';
import UITools from './tools';

export default (function () {
    let executed = false;
    return function () {
        if (!executed) {
            executed = true;
            UISettings.setTheme(Settings.theme);
            UIFooter.setWatermark(Version.watermark);
            UIFooter.setVersion(Version.value);
            UITools.populateTool();
            for (const id in Settings.load) {
                UISettings.setLoadCheck(id, Settings.load[id]);
            }
            UISettings.setSortCheck(Settings.sorting);
            for (const id in Settings.show) {
                UIAccordion.show(id, Settings.show[id]);
                UISettings.setShowCheck(id, Settings.show[id]);
            }
            for (const id in Settings.onLoad) {
                UISettings.setOnLoadCheck(id, Settings.onLoad[id]);
            }
            UITheme.set(Settings.theme);
            console.log('user interface initialised.');
        }
    };
})();
