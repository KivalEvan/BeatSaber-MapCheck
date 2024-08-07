// idk i just needed init just so this shit fukin import
// but at the same time i need some way to initialise some variable like watermark, version, etc.
import Settings from '../settings';
import Version from '../version';
import UIFooter from './footer';
import UISettings from './settings/main';
import UIAccordion from './helpers/accordion';
import UITheme from './theme';
import UIChecks from './checks/main';
import logger from '../bsmap/logger';

export default (function () {
   let executed = false;
   return function () {
      if (!executed) {
         executed = true;
         UIFooter.setWatermark(Version.watermark);
         UIFooter.setVersion(Version.value);
         UIChecks.populateTool();
         UISettings.setTheme(Settings.theme);
         UISettings.setBeatNumbering(Settings.beatNumbering);
         UISettings.setRounding(Settings.rounding);
         UISettings.setInfoHeight(Settings.infoRowHeight);
         UISettings.setDataCheck(Settings.dataCheck);
         for (const id in Settings.load) {
            UISettings.setLoadCheck(id, Settings.load[id]);
         }
         UISettings.setSortCheck(Settings.sorting);
         for (const id in Settings.show) {
            UIAccordion.show(id, Settings.show[id]);
            UISettings.setShowCheck(id, Settings.show[id]);
         }
         UITheme.set(Settings.theme);
         logger.tInfo(['init'], 'User interface initialised');
      }
   };
})();
