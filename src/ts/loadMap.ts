import JSZip from 'jszip';
import { loadingStatus } from './ui/global';

export const extractZip = async () => {
    loadingStatus('info', 'Extracting zip', 0);
    let mapZip = new JSZip();
    try {
        flag.loading = true;
        mapZip = await JSZip.loadAsync(data);
        await loadMap(mapZip);
    } catch (err) {
        mapReset();
        $('.settings').prop('disabled', false);
        loadingStatus('error', err, 100);
        console.error(err);
    }
};

export const loadMap = () => {};
