import { builtinModules } from 'module';

export default {
   css: { preprocessorOptions: { scss: { charset: false } } },
   base: '/BeatSaber-MapCheck/',
   build: { // FIXME: i need to fix shims on bsmap
      rollupOptions: {
         external: [...builtinModules, /^node:/]
      }
   }
};
