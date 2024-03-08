export interface IBPMInfoRegion {
   _startSampleIndex: number;
   _endSampleIndex: number;
   _startBeat: number;
   _endBeat: number;
}

export interface IBPMInfo {
   _version: '2.0.0';
   _songSampleCount: number;
   _songFrequency: number;
   _regions: IBPMInfoRegion[];
}
