// idk i just needed init just so this shit fukin import
// but at the same time i need some way to initialise some variable like watermark, version, etc.
import { Settings } from '../settings.ts';
import { UIFooter } from './footer.ts';
import { UISettings } from './settings/main.ts';
import { UITab } from './helpers/tab.ts';
import { UITheme } from './theme.ts';
import { UIChecks } from './checks/main.ts';
import { logger } from 'bsmap';
import { UIHeader } from './header.ts';
import { UIIntro } from './intro.ts';
import { UIStats } from './stats/main.ts';
import { UIInfo } from './information/main.ts';
import { UILoading } from './loading.ts';
import { UISelection } from './selection.ts';

let executed = false;
export function uiInit(): void {
   if (executed) {
      return;
   }
   executed = true;

   UITab.init();
   UILoading.init();
   UISelection.init();

   UIHeader.init();
   UIFooter.init();

   UIIntro.init();

   UIInfo.init();
   UIChecks.init();
   UIStats.init();
   UISettings.init();

   UITheme.set(Settings.props.theme);
   UITab.showMain(Settings.props.show);

   logger.tInfo(['UI', 'init'], 'User interface initialised');
}
