import * as general from '../general/index.ts';
import * as notes from '../notes/index.ts';
import * as obstacles from '../obstacles/index.ts';
import * as events from '../events/index.ts';
import * as others from '../others/index.ts';
import type { InputParamsList } from './_type';
import { deepCopy } from 'bsmap/utils';

const preset: InputParamsList = {
   aprilFools: {
      params: deepCopy(general.aprilFools.input.params),
   },
   audio: {
      params: deepCopy(general.audio.input.params),
   },
   coverImage: {
      params: deepCopy(general.coverImage.input.params),
   },
   previewTime: {
      params: deepCopy(general.previewTime.input.params),
   },
   progression: {
      params: deepCopy(general.progression.input.params),
   },
   zip: {
      params: deepCopy(general.zip.input.params),
   },
   acceptablePrec: {
      params: deepCopy(notes.acceptablePrec.input.params),
   },
   colorCheck: {
      params: deepCopy(notes.colorCheck.input.params),
   },
   doubleDirectional: {
      params: deepCopy(notes.doubleDirectional.input.params),
   },
   effectiveBPM: {
      params: deepCopy(notes.effectiveBPM.input.params),
   },
   hitboxInline: {
      params: deepCopy(notes.hitboxInline.input.params),
   },
   hitboxPath: {
      params: deepCopy(notes.hitboxPath.input.params),
   },
   hitboxReverseStair: {
      params: deepCopy(notes.hitboxReverseStair.input.params),
   },
   hitboxStair: {
      params: deepCopy(notes.hitboxStair.input.params),
   },
   improperArc: {
      params: deepCopy(notes.improperArc.input.params),
   },
   improperChain: {
      params: deepCopy(notes.improperChain.input.params),
   },
   improperWindow: {
      params: deepCopy(notes.improperWindow.input.params),
   },
   inlineAngle: {
      params: deepCopy(notes.inlineAngle.input.params),
   },
   oneSaber: {
      params: deepCopy(notes.oneSaber.input.params),
   },
   parity: {
      params: deepCopy(notes.parity.input.params),
   },
   shradoAngle: {
      params: deepCopy(notes.shradoAngle.input.params),
   },
   slowSlider: {
      params: deepCopy(notes.slowSlider.input.params),
   },
   speedPause: {
      params: deepCopy(notes.speedPause.input.params),
   },
   stackedNote: {
      params: deepCopy(notes.stackedNote.input.params),
   },
   varySwing: {
      params: deepCopy(notes.varySwing.input.params),
   },
   visionBlock: {
      params: deepCopy(notes.visionBlock.input.params),
   },
   centerObstacle: {
      params: deepCopy(obstacles.centerObstacle.input.params),
   },
   shortObstacle: {
      params: deepCopy(obstacles.shortObstacle.input.params),
   },
   zeroObstacle: {
      params: deepCopy(obstacles.zeroObstacle.input.params),
   },
   insufficientLight: {
      params: deepCopy(events.insufficientLight.input.params),
   },
   invalidEventBox: {
      params: deepCopy(events.invalidEventBox.input.params),
   },
   unlitBomb: {
      params: deepCopy(events.unlitBomb.input.params),
   },
   difficultyLabel: {
      params: deepCopy(others.difficultyLabel.input.params),
   },
   hotStart: {
      params: deepCopy(others.hotStart.input.params),
   },
   invalidObject: {
      params: deepCopy(others.invalidObject.input.params),
   },
   njs: {
      params: deepCopy(others.njs.input.params),
   },
   outsidePlayable: {
      params: deepCopy(others.outsidePlayable.input.params),
   },
};

export default preset;
