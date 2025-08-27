import path from 'path';
import fs from 'fs';

export const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export function ensureUploadsDir(): void {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

export function buildStoredFilename(prefix: string, originalName: string): string {
  const safe = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ts = Date.now();
  return `${prefix}_${ts}_${safe}`;
}


