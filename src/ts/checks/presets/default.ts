import type { InputParamsList } from './_type';

const preset: InputParamsList = {
   aprilFools: {
      params: { enabled: true },
   },
   audio: {
      params: { enabled: true },
   },
   coverImage: {
      params: { enabled: true },
   },
   previewTime: {
      params: { enabled: true },
   },
   progression: {
      params: {
         enabled: true,
         'Expert+': true,
         ExpertPlus: true,
         Expert: true,
         Hard: true,
         Normal: true,
         Easy: true,
      },
   },
   zip: {
      params: { enabled: true },
   },
   acceptablePrec: {
      params: { enabled: true, prec: [8, 6] },
   },
   colorCheck: {
      params: { enabled: true },
   },
   doubleDirectional: {
      params: { enabled: true },
   },
   effectiveBPM: {
      params: { enabled: true, ebpmThres: 450, ebpmsThres: 350 },
   },
   hitboxInline: {
      params: { enabled: true },
   },
   hitboxPath: {
      params: { enabled: true },
   },
   hitboxReverseStair: {
      params: { enabled: true },
   },
   hitboxStair: {
      params: { enabled: true },
   },
   improperArc: {
      params: { enabled: true },
   },
   improperChain: {
      params: { enabled: true },
   },
   improperWindow: {
      params: { enabled: true },
   },
   inlineAngle: {
      params: { enabled: true, maxTime: 0.15 },
   },
   oneSaber: {
      params: { enabled: true },
   },
   parity: {
      params: { enabled: true, allowedRot: 90, errorThres: 0, warningThres: 0 },
   },
   shradoAngle: {
      params: { enabled: true, distance: 0, maxTime: 0 },
   },
   slowSlider: {
      params: { enabled: true, minSpeed: 0.025 },
   },
   speedPause: {
      params: { enabled: true, maxTime: 0.075 },
   },
   stackedNote: {
      params: { enabled: true },
   },
   varySwing: {
      params: { enabled: true },
   },
   visionBlock: {
      params: { enabled: true, maxTime: 0.15, minTime: 0.075, specific: 'time' },
   },
   centerObstacle: {
      params: { enabled: true, recovery: 0.25 },
   },
   shortObstacle: {
      params: { enabled: true, minDur: 0.015 },
   },
   zeroObstacle: {
      params: { enabled: true },
   },
   insufficientLight: {
      params: { enabled: true },
   },
   invalidEventBox: {
      params: { enabled: true },
   },
   unlitBomb: {
      params: { enabled: true },
   },
   difficultyLabel: {
      params: { enabled: true },
   },
   hotStart: {
      params: { enabled: true, time: 1.5 },
   },
   invalidObject: {
      params: { enabled: true },
   },
   njs: {
      params: { enabled: true },
   },
   outsidePlayable: {
      params: { enabled: true },
   },
};

export default preset;
