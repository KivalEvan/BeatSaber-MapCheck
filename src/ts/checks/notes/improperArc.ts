import * as types from 'bsmap/types';
import {
   CheckArgs,
   CheckInputOrder,
   CheckOutputOrder,
   CheckType,
   ICheck,
   ICheckOutput,
   OutputStatus,
   OutputType,
} from '../../types';
import { ObjectContainerType } from '../../types/container';
import { UIInput } from '../../ui/helpers/input';
import { nearEqual, normalize, vectorDistance } from 'bsmap/utils';
import { PrecalculateKey } from '../../types/precalculate';
import { vectorLerp } from '../../utils/vector';
import { isNotePointing, noteDistance } from '../../utils/beatmap';

const name = 'Improper Arc';
const description = 'Check for correct use of arc.';
const enabled = true;

const [htmlInput, htmlLabel] = UIInput.createCheckbox(
   function (this: HTMLInputElement) {
      tool.input.params.enabled = this.checked;
   },
   name,
   description,
   enabled,
);

function update() {
   htmlInput.checked = tool.input.params.enabled;
   cachedHtmlDiff.Unrankable!.checked = tool.input.params.Unrankable;
   cachedHtmlDiff.Disconnected!.checked = tool.input.params.Disconnected;
   cachedHtmlDiff.Intersected!.checked = tool.input.params.Intersected;
}

type Params = { Disconnected: boolean; Intersected: boolean; Unrankable: boolean };
const tool: ICheck<Params> = {
   name,
   description,
   type: CheckType.NOTE,
   order: {
      input: CheckInputOrder.NOTES_IMPROPER_ARC,
      output: CheckOutputOrder.NOTES_IMPROPER_ARC,
   },
   input: {
      params: { enabled, Disconnected: true, Intersected: true, Unrankable: false },
      ui: () => UIInput.createBlock(UIInput.createBlock(htmlInput, htmlLabel), htmlList),
      update,
   },
   run,
};

const cachedHtmlDiff: {
   [key in keyof Params]: HTMLInputElement | null;
} = {
   Disconnected: null,
   Intersected: null,
   Unrankable: null,
};

const htmlList = document.createElement('ul');
const list: (keyof Params)[] = ['Unrankable', 'Disconnected', 'Intersected'];
for (const key of list) {
   const [htmlInput, htmlLabel] = UIInput.createCheckbox(
      function (this: HTMLInputElement) {
         tool.input.params[key] = this.checked;
      },
      key,
      `Check for ${key} angle offset.`,
      tool.input.params[key],
   );
   cachedHtmlDiff[key] = htmlInput;
   htmlList.appendChild(UIInput.createBlock(htmlInput, htmlLabel));
}

function arcImproper(args: CheckArgs) {
   const noteContainer = [...args.beatmap.noteContainer]
      .sort((a, b) =>
         a.type !== ObjectContainerType.ARC ? 1 : b.type !== ObjectContainerType.ARC ? -1 : 0,
      )
      .sort((a, b) => a.data.time - b.data.time);

   const result: types.wrapper.IWrapArc[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const arc = noteContainer[i];
      if (arc.type === ObjectContainerType.ARC) {
         if (nearEqual(arc.data.time, arc.data.tailTime)) {
            result.push(arc.data);
            continue;
         }

         for (let j = i; j < len; j++) {
            const other = noteContainer[j];
            if (
               other.data.customData[PrecalculateKey.SECOND_TIME] >
               arc.data.customData[PrecalculateKey.TAIL_SECOND_TIME] + 0.25
            ) {
               break;
            }
            if (other.type === ObjectContainerType.COLOR) {
               if (
                  arc.data.color !== other.data.color &&
                  ((arc.data.posX === other.data.posX &&
                     arc.data.posY === other.data.posY &&
                     nearEqual(other.data.time, arc.data.time)) ||
                     (arc.data.tailPosX === other.data.posX &&
                        arc.data.tailPosY === other.data.posY &&
                        nearEqual(other.data.time, arc.data.tailTime)) ||
                     (!arc.data.customData[PrecalculateKey.TAIL_NOTES].length &&
                        nearEqual(
                           arc.data.customData[PrecalculateKey.TAIL_SECOND_TIME],
                           other.data.customData[PrecalculateKey.SECOND_TIME],
                           0.25,
                        ) &&
                        noteDistance(
                           {
                              posX: arc.data.posX,
                              posY: arc.data.posY,
                              customData: {
                                 [PrecalculateKey.POSITION]:
                                    arc.data.customData[PrecalculateKey.TAIL_POSITION],
                              },
                           },
                           other.data,
                        ) <= 1.5 &&
                        isNotePointing(
                           {
                              posX: arc.data.posX,
                              posY: arc.data.posY,
                              direction: arc.data.tailDirection,
                              customData: {
                                 [PrecalculateKey.POSITION]:
                                    arc.data.customData[PrecalculateKey.TAIL_POSITION],
                                 [PrecalculateKey.ANGLE]:
                                    arc.data.customData[PrecalculateKey.TAIL_ANGLE],
                              },
                           },
                           other.data,
                           15,
                        )))
               ) {
                  result.push(arc.data);
                  break;
               }
            }
            if (other.type === ObjectContainerType.BOMB) {
               if (
                  (arc.data.posX === other.data.posX &&
                     arc.data.posY === other.data.posY &&
                     nearEqual(other.data.time, arc.data.time)) ||
                  (arc.data.tailPosX === other.data.posX &&
                     arc.data.tailPosY === other.data.posY &&
                     nearEqual(other.data.time, arc.data.tailTime)) ||
                  (nearEqual(
                     arc.data.customData[PrecalculateKey.TAIL_SECOND_TIME],
                     other.data.customData[PrecalculateKey.SECOND_TIME],
                     0.25,
                  ) &&
                     noteDistance(
                        {
                           posX: arc.data.posX,
                           posY: arc.data.posY,
                           customData: {
                              [PrecalculateKey.POSITION]:
                                 arc.data.customData[PrecalculateKey.TAIL_POSITION],
                           },
                        },
                        other.data,
                     ) <= 1.5 &&
                     isNotePointing(
                        {
                           posX: arc.data.posX,
                           posY: arc.data.posY,
                           direction: arc.data.tailDirection,
                           customData: {
                              [PrecalculateKey.POSITION]:
                                 arc.data.customData[PrecalculateKey.TAIL_POSITION],
                              [PrecalculateKey.ANGLE]:
                                 arc.data.customData[PrecalculateKey.TAIL_ANGLE],
                           },
                        },
                        other.data,
                        15,
                     ))
               ) {
                  result.push(arc.data);
                  break;
               }
            }
         }
      }
   }
   return result;
}

function arcDisconnected(args: CheckArgs) {
   const noteContainer = [...args.beatmap.noteContainer]
      .sort((a, b) =>
         a.type !== ObjectContainerType.ARC ? 1 : b.type !== ObjectContainerType.ARC ? -1 : 0,
      )
      .sort((a, b) => a.data.time - b.data.time);

   const result: types.wrapper.IWrapArc[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const arc = noteContainer[i];
      if (arc.type === ObjectContainerType.ARC) {
         for (let j = i + 1; j < len; j++) {
            const other = noteContainer[j];
            if (
               other.data.customData[PrecalculateKey.SECOND_TIME] >
               arc.data.customData[PrecalculateKey.TAIL_SECOND_TIME] + 0.25
            ) {
               break;
            }
            if (other.type === ObjectContainerType.COLOR) {
               if (
                  (other.data.color === arc.data.color &&
                     arc.data.time < other.data.time &&
                     other.data.time < arc.data.tailTime) ||
                  (!arc.data.customData[PrecalculateKey.TAIL_NOTES].length &&
                     nearEqual(
                        arc.data.customData[PrecalculateKey.TAIL_SECOND_TIME],
                        other.data.customData[PrecalculateKey.SECOND_TIME],
                        0.25,
                     ) &&
                     noteDistance(
                        {
                           posX: arc.data.posX,
                           posY: arc.data.posY,
                           customData: {
                              [PrecalculateKey.POSITION]:
                                 arc.data.customData[PrecalculateKey.TAIL_POSITION],
                           },
                        },
                        other.data,
                     ) <= 1.5 &&
                     isNotePointing(
                        {
                           posX: arc.data.posX,
                           posY: arc.data.posY,
                           direction: arc.data.tailDirection,
                           customData: {
                              [PrecalculateKey.POSITION]:
                                 arc.data.customData[PrecalculateKey.TAIL_POSITION],
                              [PrecalculateKey.ANGLE]:
                                 arc.data.customData[PrecalculateKey.TAIL_ANGLE],
                           },
                        },
                        other.data,
                        15,
                     ))
               ) {
                  result.push(arc.data);
                  break;
               }
            }
         }
      }
   }

   return result;
}

function arcIntersect(args: CheckArgs) {
   const noteContainer = [...args.beatmap.noteContainer]
      .sort((a, b) =>
         a.type !== ObjectContainerType.ARC ? 1 : b.type !== ObjectContainerType.ARC ? -1 : 0,
      )
      .sort((a, b) => a.data.time - b.data.time);

   const result = [];
   let arcs: types.wrapper.IWrapArc[] = [];
   for (let i = 0, len = noteContainer.length; i < len; i++) {
      const object = noteContainer[i];
      if (object.type === ObjectContainerType.ARC) {
         arcs.push(object.data);
         continue;
      }

      if (
         object.type === ObjectContainerType.COLOR ||
         object.type === ObjectContainerType.BOMB ||
         object.type === ObjectContainerType.LINK
      ) {
         search: for (let j = 0; j < arcs.length; j++) {
            const arc = arcs[j];
            if (
               arc.customData[PrecalculateKey.HEAD_NOTES].includes(object.data) ||
               arc.customData[PrecalculateKey.TAIL_NOTES].includes(object.data)
            ) {
               continue;
            }
            const bezier: types.Vector3[] = arc.customData[PrecalculateKey.BEZIER_PATH];
            let prevPoint = bezier[0];
            for (let k = 1; k < bezier.length; k++) {
               const currPoint = bezier[k];
               if (
                  prevPoint[2] < object.data.customData[PrecalculateKey.SECOND_TIME] &&
                  object.data.customData[PrecalculateKey.SECOND_TIME] < currPoint[2] &&
                  vectorDistance(
                     [
                        ...object.data.customData[PrecalculateKey.POSITION],
                        object.data.customData[PrecalculateKey.SECOND_TIME],
                     ],
                     vectorLerp(
                        prevPoint,
                        currPoint,
                        normalize(
                           object.data.customData[PrecalculateKey.SECOND_TIME],
                           prevPoint[2],
                           currPoint[2],
                        ),
                     ),
                  ) < 0.5
               ) {
                  result.push(object.data);
                  break search;
               }
               prevPoint = currPoint;
            }
         }
      }

      arcs = arcs.filter((a) => a.tailTime > object.data.time);
   }

   return result;
}

function arcUnrankable(args: CheckArgs) {
   const arcs = args.beatmap.data.difficulty.arcs;
   let actives: types.wrapper.IWrapArc[] = [];
   const result = [];
   for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      actives.push(arc);
      actives = actives.filter((a) => a.tailTime > arc.time);
      const blueArcCount = actives.filter((a) => a.color === types.NoteColor.BLUE).length;
      const redArcCount = actives.length - blueArcCount;
      if (
         blueArcCount > 5 ||
         redArcCount > 5 ||
         (arc.customData[PrecalculateKey.HEAD_NOTES].length &&
            arc.direction === types.NoteDirection.ANY) ||
         arc.lengthMultiplier < 0.1 ||
         arc.lengthMultiplier > 1.5 ||
         arc.tailLengthMultiplier < 0.1 ||
         arc.tailLengthMultiplier > 1.5 ||
         (!arc.customData[PrecalculateKey.HEAD_NOTES].length &&
            !arc.customData[PrecalculateKey.TAIL_NOTES].length)
      ) {
         result.push(arc);
      }
   }

   return result;
}

function run(args: CheckArgs): ICheckOutput[] {
   const improper = arcImproper(args);
   const disconnected = tool.input.params.Disconnected ? arcDisconnected(args) : [];
   const intersect = tool.input.params.Intersected ? arcIntersect(args) : [];
   const unrankable = tool.input.params.Unrankable ? arcUnrankable(args) : [];

   const results: ICheckOutput[] = [];
   if (improper.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Improper arc',
         type: OutputType.TIME,
         value: improper,
      });
   }

   if (disconnected.length) {
      results.push({
         status: OutputStatus.WARNING,
         label: 'Disconnected arc',
         type: OutputType.TIME,
         value: disconnected,
      });
   }

   if (intersect.length) {
      results.push({
         status: OutputStatus.WARNING,
         label: 'Intersecting arc',
         type: OutputType.TIME,
         value: intersect,
      });
   }

   if (unrankable.length) {
      results.push({
         status: OutputStatus.RANK,
         label: 'Unrankable arc',
         type: OutputType.TIME,
         value: unrankable,
      });
   }

   return results;
}

export default tool;
