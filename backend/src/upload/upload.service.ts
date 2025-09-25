import { Injectable } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class UploadService {
  generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = extname(originalName);
    return `${timestamp}-${randomString}${extension}`;
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }
}
