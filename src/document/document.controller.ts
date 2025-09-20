import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { DocumentTypeDTO } from './dto/DocumentTypeDTO';
import { DocumentService } from './document.service';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @Post('/create')
    create(@Body() documentType: DocumentTypeDTO, @Res() res: Response): Response {
        const data = this.documentService.createDocument(documentType);

        return res.status(!data.status ? HttpStatus.BAD_REQUEST : HttpStatus.CREATED).json({
            success: data.status,
            data: {
                message: data.message
            }
        });
    }
}
