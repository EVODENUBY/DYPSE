import * as winston from 'winston';

declare module 'winston' {
  interface Logger {
    error: winston.LeveledLogMethod;
    warn: winston.LeveledLogMethod;
    info: winston.LeveledLogMethod;
    http: winston.LeveledLogMethod;
    verbose: winston.LeveledLogMethod;
    debug: winston.LeveledLogMethod;
    silly: winston.LeveledLogMethod;
  }

  const format: {
    combine: winston.Logform.Format;
    colorize: winston.Logform.FormatWrap;
    timestamp: winston.Logform.TimestampOptions;
    align: winston.Logform.FormatWrap;
    printf: (format: winston.Logform.Printf) => winston.Logform.Format;
  };

  const transports: {
    Console: winston.transports.ConsoleTransportInstance;
  };
}

export = winston;
