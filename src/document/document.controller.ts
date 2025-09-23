import { Body, Controller, Post, Res } from '@nestjs/common';
import {
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation
} from '@nestjs/swagger';

import type { Response } from 'express';

import { DocumentTypeDTO } from './dto/DocumentTypeDTO';

import { DocumentService } from './document.service';

import { DefaultReturn } from 'src/interfaces/ReturnObject';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) { }

    @Post('/create')
    @ApiOperation({ summary: 'Cria um tipo de documento.' })
    @ApiOkResponse({ description: 'Documento "CNH" criado com sucesso!' })
    @ApiNotFoundResponse({ description: 'O documento "CNH" já existe!' })
    @ApiInternalServerErrorResponse({ description: 'Ocorreu um erro durante a criação do tipo de documento.' })
    async create(@Res() res: Response, @Body() documentType: DocumentTypeDTO): Promise<Response<DefaultReturn>> {
        const data = await this.documentService.createDocument(documentType);

        return res.status(data.status).json(data);
    }
}