import '../scss/_main.scss';
import * as ui from './ui';
import * as loadMap from './loadMap';
import { sanitizeBeatSaverID, sanitizeURL, isHex } from './utils';

const url = new URL(location.href);
const link = url.searchParams.get('url');
const id = url.searchParams.get('id');
const hash = url.searchParams.get('hash');

ui.init();

if (link) {
    loadMap.downloadFromURL(sanitizeURL(decodeURI(link)));
} else if (id) {
    loadMap.downloadFromID(sanitizeBeatSaverID(decodeURI(id)));
} else if (hash && isHex(decodeURI(hash).trim())) {
    loadMap.downloadFromHash(decodeURI(hash).trim());
}
