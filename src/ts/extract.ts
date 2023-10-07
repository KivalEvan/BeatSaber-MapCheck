import JSZip from 'jszip';

// TODO: error handling here
export async function extractZip(data: ArrayBuffer | File): Promise<JSZip> {
   return JSZip.loadAsync(data);
}
