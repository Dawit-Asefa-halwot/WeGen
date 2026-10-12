import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly storageDriver: string;
  private readonly localStorageDir: string;
  private readonly s3Client: S3Client | null = null;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.storageDriver = this.configService.get<string>('STORAGE_DRIVER', 'local');
    this.localStorageDir = path.join(process.cwd(), 'uploads');
    this.bucketName = this.configService.get<string>('STORAGE_BUCKET', 'wegen-media');

    if (this.storageDriver === 's3') {
      const endpoint = this.configService.get<string>('STORAGE_ENDPOINT');
      const accessKeyId = this.configService.get<string>('STORAGE_ACCESS_KEY');
      const secretAccessKey = this.configService.get<string>('STORAGE_SECRET_KEY');
      const region = this.configService.get<string>('STORAGE_REGION', 'auto');

      if (endpoint && accessKeyId && secretAccessKey) {
        this.s3Client = new S3Client({
          region,
          endpoint,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
        this.logger.log(`Initialized S3/Cloudflare R2 client for bucket: ${this.bucketName}`);
      }
    }

    if (!fs.existsSync(this.localStorageDir)) {
      fs.mkdirSync(this.localStorageDir, { recursive: true });
    }
  }

  /**
   * Uploads a file (public or private) to S3/R2 or local filesystem
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

    if (this.storageDriver === 's3' && this.s3Client) {
      const key = `${isPrivate ? 'private' : 'public'}/${filename}`;
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
        }),
      );
      this.logger.log(`Uploaded to Cloudflare R2: ${key}`);

      const baseUrl = this.configService.get<string>('NEXT_PUBLIC_API_URL', 'http://localhost:4000/api/v1');
      const url = isPrivate ? undefined : `${baseUrl}/storage/public/${filename}`;
      return { storagePath: key, url };
    }

    // Fallback: Local storage
    const targetPath = path.join(this.localStorageDir, filename);
    await fs.promises.writeFile(targetPath, fileBuffer);
    this.logger.log(`File uploaded locally: ${filename} (Private: ${isPrivate})`);

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
   */
  async getSignedUrl(storagePath: string, expiresInSeconds: number = 900): Promise<string> {
    if (this.storageDriver === 's3' && this.s3Client) {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: storagePath,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    }

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
   * Validates temporary signed URL signature for local files
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
