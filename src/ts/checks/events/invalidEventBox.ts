import {
   EnvironmentName,
   EnvironmentV3Name,
   IndexFilterType,
   TrackDefinitions,
   wrapper,
} from 'bsmap';
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
import { UIInput } from '../../ui/helpers/input';

const name = 'Invalid Event Box';
const description = 'Check for valid event box group usage.';
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
}

const tool: ICheck = {
   name,
   description,
   type: CheckType.EVENT,
   order: {
      input: CheckInputOrder.EVENTS_INVALID_EVENT_BOX,
      output: CheckOutputOrder.EVENTS_INVALID_EVENT_BOX,
   },
   input: {
      params: { enabled },
      ui: UIInput.createBlock(htmlInput, htmlLabel),
      update,
   },
   run,
};

// FIXME: EDMEnvironment special case 12 and 13 filter is 1 for rotation
function check(map: wrapper.IWrapLightshow, environment: EnvironmentName) {
   const defectID: wrapper.IWrapEventBoxGroup[] = [];
   const defectFilter: wrapper.IWrapEventBoxGroup[] = [];

   if (!TrackDefinitions[environment as EnvironmentV3Name]) {
      return { defectID: [], defectFilter: [] };
   }
   const envV3 = environment as EnvironmentV3Name;
   const eventListEBG = Object.keys(TrackDefinitions[envV3][1]).map(Number);

   const ebg = [
      ...map.lightColorEventBoxGroups,
      ...map.lightRotationEventBoxGroups,
      ...map.lightTranslationEventBoxGroups,
   ];
   for (const g of ebg) {
      if (!eventListEBG.includes(g.id)) {
         defectID.push(g);
      }
      for (const eb of g.boxes) {
         const filter = eb.filter;
         if (filter.type === IndexFilterType.STEP_AND_OFFSET) {
            if (filter.p0 > TrackDefinitions[envV3][1]![g.id].count) {
               defectFilter.push(g);
            }
         }
      }
   }

   return {
      defectID: defectID,
      defectFilter: defectFilter,
   };
}

function run(args: CheckArgs): ICheckOutput[] {
   const result = check(args.beatmap.data.lightshow, args.beatmap.environment);

   const results: ICheckOutput[] = [];
   if (result.defectID.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid event box group ID',
         type: OutputType.TIME,
         value: result.defectID,
      });
   }
   if (result.defectFilter.length) {
      results.push({
         status: OutputStatus.ERROR,
         label: 'Invalid event box filter',
         type: OutputType.TIME,
         value: result.defectFilter,
      });
   }

   return results;
}

export default tool;
