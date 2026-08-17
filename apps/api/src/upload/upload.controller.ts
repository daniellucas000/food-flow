// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard } from '../auth/guard/auth.guard';

interface UploadedImageFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@UseGuards(AuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: UploadedImageFile) {
    const url = await this.uploadService.uploadImage(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
    return { url };
  }
}
