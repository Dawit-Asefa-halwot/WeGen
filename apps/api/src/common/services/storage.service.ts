import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storageDriver: string;
  private readonly localStorageDir: string;

  constructor(private configService: ConfigService) {
    this.storageDriver = this.configService.get<string>('STORAGE_DRIVER', 'local');
    this.localStorageDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(this.localStorageDir)) {
      fs.mkdirSync(this.localStorageDir, { recursive: true });
    }
  }

  /**
   * Uploads a file (public or private)
   */
  async uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string,
    isPrivate: boolean = true
  ): Promise<{ storagePath: string; url?: string }> {
    const fileExt = path.extname(originalFilename) || '.bin';
    const hash = crypto.randomBytes(16).toString('hex');
    const filename = `${isPrivate ? 'private' : 'public'}_${Date.now()}_${hash}${fileExt}`;
    const targetPath = path.join(this.localStorageDir, filename);

    await fs.promises.writeFile(targetPath, fileBuffer);

    this.logger.log(`File uploaded: ${filename} (Private: ${isPrivate})`);

    const storagePath = `uploads/${filename}`;
    let url: string | undefined;

    if (!isPrivate) {
      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_API_URL', 'http://localhost:4000/api/v1');
      url = `${baseUrl}/storage/public/${filename}`;
    }

    return { storagePath, url };
  }

  /**
   * Generates a temporary signed URL for accessing private verification documents
   * Expires in 15 minutes by default
   */
  async getSignedUrl(storagePath: string, expiresInSeconds: number = 900): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET', 'secret');
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const token = crypto
      .createHmac('sha256', secret)
      .update(`${storagePath}:${expiresAt}`)
      .digest('hex');

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_API_URL', 'http://localhost:4000/api/v1');
    const filename = path.basename(storagePath);

    return `${baseUrl}/storage/private/${filename}?expires=${expiresAt}&signature=${token}`;
  }

  /**
   * Validates temporary signed URL signature
   */
  verifySignedUrl(filename: string, expires: number, signature: string): boolean {
    if (Math.floor(Date.now() / 1000) > expires) {
      return false;
    }
    const secret = this.configService.get<string>('JWT_SECRET', 'secret');
    const storagePath = `uploads/${filename}`;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${storagePath}:${expires}`)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  }

  getFilePath(filename: string): string {
    return path.join(this.localStorageDir, filename);
  }
}
