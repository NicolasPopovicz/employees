import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { DocumentTypeDTO } from './dto/DocumentTypeDTO';

import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post('/create')
    async create(
        @Body() documentType: DocumentTypeDTO,
        @Res() res: Response,
    ): Promise<Response> {
        const data = await this.documentService.createDocument(documentType);

        return res.status(HttpStatus.CREATED).json({
            success: data.status,
            data: {
                message: data.message,
                error:   data.error
            },
        });
    }
}