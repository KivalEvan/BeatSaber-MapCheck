export interface IAudio {
   version: '4.0.0';
   songChecksum: string;
   songSampleCount: number; // int
   songFrequency: number; // int
   bpmData: IAudioBPM[];
   lufsData: IAudioLUFS[];
}

export interface IAudioBPM {
   si: number; // int
   ei: number; // int
   sb: number; // float
   eb: number; // float
}

export interface IAudioLUFS {
   si: number; // int
   ei: number; // int
   l: number; // float
}
