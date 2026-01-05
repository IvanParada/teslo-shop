import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) { }

  @Get('product/:imgName')
  findProductImage(
    @Res() res: Response,
    @Param('imgName') imgName: string) {
    const path = this.filesService.getStaticProductImage(imgName);

    res.sendFile(path);


    //custom res
    // res.status(403).json({
    //   ok: false,
    //   path: path,
    // })

  }


  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    }),
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException('File is empty');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return {
      secureUrl,
    }
  }

}
