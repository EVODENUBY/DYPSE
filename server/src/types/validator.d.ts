declare module 'validator' {
  interface ValidatorStatic {
    isEmail(email: string, options?: any): boolean;
    isURL(url: string, options?: any): boolean;
    isMobilePhone(phone: string, locale?: string | string[], options?: any): boolean;
    isISO8601(date: string, options?: any): boolean;
    isLength(str: string, options: { min?: number; max?: number }): boolean;
    isAlphanumeric(str: string, locale?: string): boolean;
    isNumeric(str: string, options?: any): boolean;
    isPostalCode(str: string, locale: string): boolean;
    isBoolean(str: string): boolean;
    equals(str: string, comparison: string): boolean;
    contains(str: string, elem: any, options?: any): boolean;
    escape(input: string): string;
    normalizeEmail(email: string, options?: any): string | false;
    trim(input: string, chars?: string): string;
    toDate(input: string): Date | null;
    [key: string]: any;
  }

  const validator: ValidatorStatic;
  export = validator;
}
