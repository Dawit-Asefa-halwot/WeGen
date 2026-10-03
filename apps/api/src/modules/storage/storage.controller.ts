import { Controller, Get, Param, Query, Res, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { StorageService } from '../../common/services/storage.service';
import * as fs from 'fs';

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Get('public/:filename')
  getPublicFile(@Param('filename') filename: string, @Res() res: Response) {
    if (filename.startsWith('private_')) {
      throw new ForbiddenException('Access denied to private verification files');
    }
    const filePath = this.storageService.getFilePath(filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }
    return res.sendFile(filePath);
  }

  @Get('private/:filename')
  getPrivateFile(
    @Param('filename') filename: string,
    @Query('expires') expires: string,
    @Query('signature') signature: string,
    @Res() res: Response,
  ) {
    if (!expires || !signature) {
      throw new ForbiddenException('Missing temporary signature or expiration');
    }

    const isValid = this.storageService.verifySignedUrl(filename, Number(expires), signature);
    if (!isValid) {
      throw new ForbiddenException('Invalid or expired document signature');
    }

    const filePath = this.storageService.getFilePath(filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Document not found');
    }
    return res.sendFile(filePath);
  }
}
