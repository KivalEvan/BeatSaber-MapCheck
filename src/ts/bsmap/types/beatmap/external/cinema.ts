import type { EnvironmentAllName } from '../shared/environment.ts';

interface IVector3Object {
   x: number;
   y: number;
   z: number;
}

// description taken directly from author's github
export interface ICinemaConfig {
   // BASIC SETTINGS
   /**
    * The YouTube video ID from the part after the &v= in the URL, e.g.: `youtube.com/watch?v=_qwnHeMKbVA`
    * @default {'none'}
    */
   videoID?: string;
   /**
    * Use this parameter instead of videoID if you want to use a video hoster other than YouTube. Provide the full video URL for this parameter.
    *
    * Currently supported are the following video sources: `YouTube`, `Facebook`, `Dailymotion`, `Vimeo`.
    * @default {'none'}
    */
   videoUrl?: string;
   /**
    * The title of the video. Will be shown to the user.
    * @default {'Unknown Video'}
    */
   title?: string;
   /**
    * The name of the video's uploader. Will be shown to the user.
    * @default {'Unknown Author'}
    */
   author?: string;
   /**
    * Name of the video file on the local file system. Path is not included, the file is assumed to be in the map's folder.
    *
    * Will be set automatically after downloading and set to the title of the video, with illegal characters replaced by _.
    * @default {'none'}
    */
   videoFile?: string;
   /**
    * Video duration in seconds `<int>`. Will be shown to the user, but has no other function than that.
    * @default {0}
    */
   duration?: number;
   /**
    * The offset in milliseconds `<int>` to align the video with the map. Use the video menu in-game to determine the offset.
    * @default {0}
    */
   offset?: number;
   /**
    * Used to indicate whether the config was created by the mapper (as opposed to by the user). Changes the UI in various small ways.
    * @default {false}
    */
   configByMapper?: boolean;
   formatVersion: number;

   // ADVANCED SETTINGS
   /**
    * The environment that is supposed to be loaded. This allows you to force a specific environment that is only used if the user has Cinema installed and the video downloaded.
    *
    * This also disables the user's choice in the Override Environment setting of the base game, so please only use it if you have a good reason to do so.
    * @default {'none'}
    */
   environmentName?: EnvironmentAllName;
   /**
    * Allows you to adjust the playback speed `<float>` of the video.
    * @default {1.0}
    */
   playbackSpeed?: number;
   /**
    * Whether the video should loop if it ends before the map does.
    * @default {false}
    */
   loop?: boolean;
   /**
    * This parameter allows you to let a video end early (e.g. to hide sponsor segments, credits, logos etc.).
    *
    * The time references the video time, not the map time. The video will start fading out one second before this time is reached.
    *
    * Value is in seconds (e.g.: 296.5 would be 4 minutes and 56.5 seconds)
    * @default {'none'}
    */
   endVideoAt?: number;
   /**
    * This setting can be used to create a custom positioning of the video player.
    *
    * x is the deviation from the center, y is up/down and z controls the distance. y should usually be about half of the video height minus 0.1 if you want the video to be above the track.
    *
    * This setting prevents the user from overriding the environment.
    * @default {{"x": 0.0, "y": 12.4, "z": 67.8}}
    */
   screenPosition?: IVector3Object;
   /**
    * Rotates the video screen. By default, it tilts down by 8 degrees for better visibility.
    * @default {{"x": -8.0, "y": 0.0, "z": 0.0}}
    */
   screenRotation?: IVector3Object;
   /**
    * Determines the size `<float>` of the screen. There is no setting for the width, since that is calculated automatically by the height and the aspect ratio of the video.
    *
    * If you change the height, you might want to also change the y positioning of the screen so it doesn't float above the ground.
    *
    * This setting prevents the user from overriding the environment.
    * @default {25.0}
    */
   screenHeight?: number;
   /**
    * Use this setting to force a specific curvature of the screen. Setting this to 0 forces curvature to be disabled.
    *
    * If this parameter is not included and the user has curvature enabled, the curvature is calculated automatically based on the distance and the width of the screen.
    *
    * Valid range: `<float> 0-180 (degrees)`
    * @default {'automatic'}
    */
   screenCurvature?: number;
   /**
    * This allows you to specify how many sub-surfaces the curved screen uses, which lets you control the smoothness of the curvature. The default of 32 looks great in most cases and doesn't cost much performance.
    *
    * Valid range: `<int> 1 to 256`
    * @default {32}
    */
   screenSubsurfaces?: number;
   /**
    * When set to false, will prevent the CustomPlatforms mod from loading a custom platform for this map if the video is playing.
    *
    * Can be used to override the user setting if the user set it to true for all maps.
    * @default {false}
    */
   allowCustomPlatform?: boolean;
   disableBigMirrorOverride?: boolean;
   /**
    * If set to true, will disable any environment modifications Cinema does by default for the selected environment.
    *
    * Only use this if you plan on modifying the environment in a different way to make the video player fit in.
    * @default {false}
    */
   disableDefaultModifications?: boolean;
   /**
    * Set this to true to have your environment modifications applied even if no video is defined or downloaded by the user.
    * @default {false}
    */
   forceEnvironmentModifications?: boolean;
   /**
    * If this is set to true, all cloned lights will be merged with existing prop groups, based on the specified z-position.
    *
    * **NOTE:** This will make lighting using light IDs nearly impossible, if you plan on using that.
    *
    * Also, if your cloned light is placed at a z-position where no pre-existing lights are, a new prop group will be created, which will change the IDs of other prop groups and potentially mess up your lightshow.
    * @default {false}
    */
   mergePropGroups?: boolean;
   /**
    * Include this in your config if you want to override the user's choice and force transparency to be enabled or disabled.
    *
    * This does not disable the color blending, it only prevents light sources behind the screen from shining through.
    * @default {true}
    */
   transparency?: boolean;
   /**
    * Sets the amount `<float>` of bloom (glow) that appears around the video player during brightly colored parts of the video.
    * @default {1.0}
    */
   bloom?: number;

   /** If you want to make slight modifications to how the video looks, you can use these color correction options which get applied at runtime. */
   colorCorrection?: {
      /**
       * Valid range: `<float> 0 to 2`
       * @default {1.0}
       */
      brightness?: number;
      /**
       * Valid range: `<float> 0 to 5`
       * @default {1.0}
       */
      contrast?: number;
      /**
       * Valid range: `<float> 0 to 5`
       * @default {1.0}
       */
      saturation?: number;
      /**
       * Valid range: `<float> 0 to 5`
       * @default {1.0}
       */
      exposure?: number;
      /**
       * Valid range: `<float> 0 to 5`
       * @default {1.0}
       */
      gamma?: number;
      /**
       * Valid range: `<float> -360 to +360 (in degrees)`
       * @default {0.0}
       */
      hue?: number;
   };

   /** Using the vignette effect you can change the shape of the video player or soften its edges. */
   vignette: {
      /**
       * Changes how the radius and softness parameters behave.
       * @default {'rectangular'}
       */
      type: 'elliptical' | 'rectangular';
      /**
       * If the type is "elliptical", the screen is only really elliptical if the radius is set to 0. Values above that simply round the corners of the screen to varying degrees.
       *
       * Valid range: `<float> 0 to 1`
       * @default {1.0}
       */
      radius: number;
      /**
       * Defines the sharpness of the cutout. If you only want to soften the edges, leave the radius at 1 and only slightly increase the softness. By default, videos have a very slight vignette which basically serves as antialiasing for the screen borders.
       *
       * Valid range: `<float> 0 to 1`
       * @default {0.005}
       */
      softness: number;
   };

   /**
    * You can create clones of the "main screen" by using the `additionalScreens` property.
    *
    * You can place, rotate and scale these screens independently from each other, but all other properties like color correction, vignetting, curvature and, most importantly, the video that is playing, are cloned from the main screen.
    *
    * Please note: Adding additional screens currently disables the bloom effect on all screens, even the main one.
    */
   additionalScreens: {
      /** Moves the object to the specified location. */
      position?: IVector3Object;
      /** Rotates the object. */
      rotation?: IVector3Object;
      /** Scales the object. Default for each axis is usually 1.0. Setting any axis to 0 may cause the object to become invisible. */
      scale?: IVector3Object;
   }[];

   /** Using this disables player overrides for the environment, since these modifications are specific to the mapper-chosen environment. */
   environment: {
      /**
       * Specifies the name of the object. The name needs to be an exact match, not a substring.
       *
       * If there are multiple objects with the given name, all of them will be modified.
       */
      name?: string;
      /**
       * Specifies the name object's parent in the scene hierarchy. Can be used to differentiate between objects with the same name.
       *
       * **Example:** KDA has two different objects named "Construction", with the parent's names being "Environment" and "PlayersPlace".
       */
      parentName?: string;
      /** If this is set, a new object will be created (cloned). In this case, the name parameter will set the name of the newly created object, while the cloneFrom parameter will be the object that is cloned. */
      cloneFrom?: string;
      /** Set this to `false` to hide the object, or to true to show it if it's hidden by default. */
      active?: boolean;
      /** Moves the object to the specified location. */
      position?: IVector3Object;
      /** Rotates the object. */
      rotation?: IVector3Object;
      /** Scales the object. Default for each axis is usually 1.0. Setting any axis to 0 may cause the object to become invisible. */
      scale?: IVector3Object;
   }[];
}
