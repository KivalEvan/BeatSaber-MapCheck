import JSZip from 'jszip';

// TODO: error handling here
export const extractZip = async (data: ArrayBuffer | File) => {
    uiLoading.status('info', 'Extracting zip', 0);
    let mapZip = new JSZip();
    console.time('loading time');
    try {
        uiHeader.switchHeader(true);
        mapZip = await JSZip.loadAsync(data);
        await loadMap(mapZip);
    } catch (err) {
        clearData();
        disableInput(false);
        uiHeader.switchHeader(false);
        uiLoading.status('error', err, 100);
        console.error(err);
    }
    console.timeEnd('loading time');
};
