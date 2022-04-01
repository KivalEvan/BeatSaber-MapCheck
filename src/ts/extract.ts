import JSZip from 'jszip';

// TODO: error handling here
export const extractZip = async (data: ArrayBuffer | File): Promise<JSZip> => {
    return await JSZip.loadAsync(data);
};
