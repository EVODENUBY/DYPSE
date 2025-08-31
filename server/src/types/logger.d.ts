declare module 'winston' {
  interface Logger {
    info: (message: string, meta?: any) => void;
    error: (message: string, meta?: any) => void;
    warn: (message: string, meta?: any) => void;
    debug: (message: string, meta?: any) => void;
  }
}

declare module '../../utils/logger' {
  import { Logger } from 'winston';
  const logger: Logger;
  export default logger;
}
