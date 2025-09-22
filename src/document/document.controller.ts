import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { DocumentTypeDTO } from './dto/DocumentTypeDTO';

import { DocumentService } from './document.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post('/create')
    @ApiOperation({ summary: 'Cria um tipo de documento.' })
    @ApiResponse({ status: 201, description: 'Documento "CNH" criado com sucesso!' })
    @ApiResponse({ status: 400, description: 'Ocorreu um erro durante a criação do tipo de documento. Parece que o documento "CNH" já existe!' })
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