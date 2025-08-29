import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
export declare const uploadProfilePicture: multer.Multer;
export declare const uploadCV: multer.Multer;
export declare const handleUploadError: (error: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const cleanupOldFile: (filePath: string) => void;
//# sourceMappingURL=upload.middleware.d.ts.map