// really simple logger
enum LogLevels {
    VERBOSE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    NONE,
}

const logPrefixes = new Map<LogLevels, string>([
    [LogLevels.VERBOSE, 'VERBOSE'],
    [LogLevels.DEBUG, 'DEBUG'],
    [LogLevels.INFO, 'INFO'],
    [LogLevels.WARN, 'WARN'],
    [LogLevels.ERROR, '!!ERROR!!'],
    [LogLevels.NONE, 'NONE'],
]);

class logger {
    logLevel = LogLevels.INFO;

    // deno-lint-ignore no-explicit-any
    private log(level: LogLevels, ...args: any[]) {
        if (level < this.logLevel) return;

        const log = [logPrefixes.get(level), '>', ...args];

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
    public setLevel(level: LogLevels) {
        level = Math.min(level, 5);
        this.logLevel = level;
        this.info('[logger::setLevel]', `Log level set to ${logPrefixes.get(level)}`);
    }

    // deno-lint-ignore no-explicit-any
    public verbose(...args: any[]) {
        this.log(LogLevels.VERBOSE, ...args);
    }

    // deno-lint-ignore no-explicit-any
    public debug(...args: any[]) {
        this.log(LogLevels.DEBUG, ...args);
    }

    // deno-lint-ignore no-explicit-any
    public info(...args: any[]) {
        this.log(LogLevels.INFO, ...args);
    }

    // deno-lint-ignore no-explicit-any
    public warn(...args: any[]) {
        this.log(LogLevels.WARN, ...args);
    }

    // deno-lint-ignore no-explicit-any
    public error(...args: any[]) {
        this.log(LogLevels.ERROR, ...args);
    }
}

/** Simple logging system. */
export default new logger();
