enum LogLevels {
   VERBOSE,
   DEBUG,
   INFO,
   WARN,
   ERROR,
   NONE,
}

// really simple logger
export class Logger {
   static readonly LogLevels = LogLevels;

   static LogPrefixes = new Map<LogLevels, string>([
      [LogLevels.VERBOSE, 'VERBOSE'],
      [LogLevels.DEBUG, 'DEBUG'],
      [LogLevels.INFO, 'INFO'],
      [LogLevels.WARN, 'WARN'],
      [LogLevels.ERROR, '!!ERROR!!'],
      [LogLevels.NONE, 'NONE'],
   ]);

   #logLevel = LogLevels.INFO;
   #tagPrint: (tags: string[], level: LogLevels) => string = (tags, level) =>
      `${Logger.LogPrefixes.get(level)} ${'>'} [${tags.join('::')}]`;
   #untagged = 'script';

   set logLevel(value: LogLevels) {
      this.#logLevel = value;
      this.tInfo(['logger', 'logLevel'], `Log level set to ${Logger.LogPrefixes.get(value)}`);
   }
   get logLevel() {
      return this.#logLevel;
   }

   set tagPrint(fn: (tags: string[], level: LogLevels) => string) {
      this.#tagPrint = fn;
      this.tInfo(['logger', 'tagPrint'], `Update tag print function`);
   }
   get tagPrint() {
      return this.#tagPrint;
   }

   set untagged(value: string) {
      this.#untagged = value.trim();
      this.tInfo(['logger', 'untagged'], `Update untagged string to ${this.#untagged}`);
   }
   get untagged() {
      return this.#untagged;
   }

   private log(level: LogLevels, tags: string[], ...args: any[]) {
      if (level < this.#logLevel) return;

      const log = [this.tagPrint(tags, level), ...args];

      switch (level) {
         case LogLevels.DEBUG:
            return console.debug(...log);
         case LogLevels.INFO:
            return console.info(...log);
         case LogLevels.WARN:
            return console.warn(...log);
         case LogLevels.ERROR:
            return console.error(...log);
         default:
            return console.log(...log);
      }
   }

   /** Set logging level to filter various information.
    * ```ts
    * 0 -> Verbose
    * 1 -> Debug
    * 2 -> Info
    * 3 -> Warn
    * 4 -> Error
    * 5 -> None
    * ```
    */
   setLevel(level: LogLevels) {
      level = Math.min(Math.max(level, 0), 5);
      this.#logLevel = level;
      this.tInfo(['logger', 'setLevel'], `Log level set to ${Logger.LogPrefixes.get(level)}`);
   }

   tVerbose(tags: string[], ...args: any[]) {
      this.log(LogLevels.VERBOSE, tags, ...args);
   }

   tDebug(tags: string[], ...args: any[]) {
      this.log(LogLevels.DEBUG, tags, ...args);
   }

   tInfo(tags: string[], ...args: any[]) {
      this.log(LogLevels.INFO, tags, ...args);
   }

   tWarn(tags: string[], ...args: any[]) {
      this.log(LogLevels.WARN, tags, ...args);
   }

   tError(tags: string[], ...args: any[]) {
      this.log(LogLevels.ERROR, tags, ...args);
   }

   verbose(...args: any[]) {
      this.tVerbose([this.#untagged], ...args);
   }

   debug(...args: any[]) {
      this.tDebug([this.#untagged], ...args);
   }

   info(...args: any[]) {
      this.tInfo([this.#untagged], ...args);
   }

   warn(...args: any[]) {
      this.tWarn([this.#untagged], ...args);
   }

   error(...args: any[]) {
      this.tError([this.#untagged], ...args);
   }
}

/** Simple logging system. */
export default new Logger();
