import '../scss/_main.scss';
import * as ui from './ui';
import * as loadMap from './loadMap';
import { sanitizeBeatSaverID, sanitizeURL } from './utils';

const url = new URL(location.href);
const link = url.searchParams.get('url');
const id = url.searchParams.get('id');

ui.init();

if (link) {
    loadMap.downloadFromURL(sanitizeURL(decodeURI(link)));
} else if (id) {
    loadMap.downloadFromID(sanitizeBeatSaverID(decodeURI(id)));
}
