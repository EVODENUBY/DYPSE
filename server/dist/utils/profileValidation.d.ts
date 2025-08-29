import { Request, Response, NextFunction } from 'express';
export declare const validatePhoneNumber: (phone: string) => boolean;
export declare const validateDateOfBirth: (dateString: string) => {
    valid: boolean;
    error?: string;
};
export declare const validateExperienceDates: (startDate: string, endDate?: string, isCurrent?: boolean) => {
    valid: boolean;
    error?: string;
};
export declare const validateEducationDates: (startDate: string, endDate?: string, isCurrent?: boolean) => {
    valid: boolean;
    error?: string;
};
export declare const sanitizeTextInput: (text: string) => string;
export declare const sanitizeBio: (bio: string) => string;
export declare const sanitizePhoneNumber: (phone: string) => string;
export declare const sanitizeUrl: (url: string) => string;
export declare const enhancedProfileValidation: import("express-validator").ValidationChain[];
export declare const enhancedExperienceValidation: import("express-validator").ValidationChain[];
export declare const enhancedEducationValidation: import("express-validator").ValidationChain[];
export declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const profileUpdateLimiter: {
    windowMs: number;
    max: number;
    message: {
        success: boolean;
        message: string;
    };
    standardHeaders: boolean;
    legacyHeaders: boolean;
};
//# sourceMappingURL=profileValidation.d.ts.map