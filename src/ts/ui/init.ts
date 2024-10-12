// idk i just needed init just so this shit fukin import
// but at the same time i need some way to initialise some variable like watermark, version, etc.
import Settings from '../settings';
import Version from '../version';
import UIFooter from './footer';
import UISettings from './settings/main';
import * as UITabs from './helpers/tab';
import UITheme from './theme';
import UIChecks from './checks/main';
import { logger } from 'bsmap';

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
         UISettings.setInfoRow(Settings.infoRowCount);
         UISettings.setDataCheck(Settings.dataCheck);
         for (const id in Settings.load) {
            UISettings.setLoadCheck(id, Settings.load[id]);
         }
         UISettings.setSortCheck(Settings.sorting);
         UITabs.showMain(Settings.show);
         UISettings.setShowCheck(Settings.show);
         UITheme.set(Settings.theme);
         logger.tInfo(['init'], 'User interface initialised');
      }
   };
})();
