import * as ui from './ui';
import * as download from './download';
import { sanitizeBeatSaverID, sanitizeURL, isHex } from './utils';

export default (() => {
    ui.init();

    const url = new URL(location.href);
    const link = url.searchParams.get('url');
    const id = url.searchParams.get('id');
    const hash = url.searchParams.get('hash');

    if (link) {
        download.downloadFromURL(sanitizeURL(decodeURI(link)));
    } else if (id) {
        download.downloadFromID(sanitizeBeatSaverID(decodeURI(id)));
    } else if (hash && isHex(decodeURI(hash).trim())) {
        download.downloadFromHash(decodeURI(hash).trim());
    }
})();
