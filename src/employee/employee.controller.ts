import {
    Body,
    Controller,
    Param,
    Get,
    Post,
    Put,
    Res,
    Query,
    ParseIntPipe
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation
} from '@nestjs/swagger';

import type { Response } from 'express';

import { EmployeeDTO } from './dto/EmployeeDTO';
import { DocumentTypeDTO } from 'src/document/dto/DocumentTypeDTO';
import { ListDocumentsQueryDto } from './dto/ListDocumentsQueryDTO';
import { LinkAndUnlinkDocumentsDTO } from './dto/LinkAndUnlinkDocumentsDTO';

import { EmployeeService } from 'src/employee/employee.service';

import { DefaultReturn } from 'src/interfaces/ReturnObject';

import { StatusEnum } from 'src/enums/StatusDocument';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post('/new')
    @ApiOperation({ summary: 'Cria um novo colaborador, passando os parâmetros no corpo da requisição.' })
    @ApiCreatedResponse({ description: 'Colaborador "Fulano da Silva" cadastrado com sucesso!' })
    @ApiBadRequestResponse({ description: 'Já existe um colaborador com estes dados!' })
    @ApiInternalServerErrorResponse({ description: 'Ocorreu um erro durante a criação do colaborador "Fulano da Silva".' })
    async create(@Res() res: Response, @Body() employeeDto: EmployeeDTO): Promise<Response<DefaultReturn>> {
        const data = await this.employeeService.createEmployee(employeeDto);

        return res.status(data.status).json(data);
    }

    @Put('/update')
    @ApiOperation({ summary: 'Atualiza os dados do colaborador, passando os atributos no corpo da requisição.' })
    @ApiOkResponse({ description: 'Colaborador "Fulano da Silva" atualizado com sucesso!' })
    @ApiNotFoundResponse({ description: 'Não encontramos o colaborador "Fulano da Silva".' })
    @ApiInternalServerErrorResponse({ description: 'Ocorreu um erro durante a atualização do colaborador "Fulano da Silva".' })
    async update(@Res() res: Response, @Body() employeeDto: EmployeeDTO): Promise<Response<DefaultReturn>> {
        const data = await this.employeeService.updateEmployee(employeeDto);

        return res.status(data.status).json(data);
    }

    @Get('/:id/status/documents')
    @ApiOkResponse({ description: 'Listagem dos status dos documentos do colaborador' })
    @ApiInternalServerErrorResponse({ description: 'Ocorreu um erro durante a listagem dos status dos documentos do colaborador.' })
    @ApiOperation({ summary: 'Lista todos os documentos do colaborador, passando seu id como parâmetro' })
    async listDocumentsStatus(@Res() res: Response, @Param('id', ParseIntPipe) id: string): Promise<Response<DefaultReturn>> {
        const data = await this.employeeService.listEmployeeDocumentsStatus(id);

        return res.status(data.status).json(data);
    }

    @Get('/list/pending/documents')
    @ApiOkResponse({ description: 'Listagem de colaboradores com documentos pendentes' })
    @ApiInternalServerErrorResponse({ description: 'Ocorreu um erro durante listagem dos documentos pendentes dos colaboradores.' })
    @ApiOperation({ summary: 'Lista todos os documentos de todos os colaboradores ou de um colaborador específico.' })
    async listPendingDocuments(@Res() res: Response, @Query() query: ListDocumentsQueryDto): Promise<Response<DefaultReturn>> {
        const data = await this.employeeService.listEmployeesPendingDocuments(query);

        return res.status(data.status).json(data);
    }

    @Post('/:id/send/document')
    @ApiCreatedResponse({ description: 'Documento "Enviar CNH" atribuído com sucesso ao colaborador!' })
    @ApiNotFoundResponse({ description: 'Não encontramos o colaborador/tipo de documento com os dados fornecidos na nossa base!' })
    @ApiInternalServerErrorResponse({ description: 'Ocorreu um erro durante o envio do documento "Enviar CNH".' })
    @ApiOperation({ summary: 'Atrela um documento à um colaborador, deixando pendente o envio.' })
    async sendDocument(
        @Res() res: Response,
        @Param('id', ParseIntPipe) id: string,
        @Body() documentType: DocumentTypeDTO
    ): Promise<Response<DefaultReturn>> {
        const data = await this.employeeService.sendDocument(id, documentType);

        return res.status(data.status).json(data);
    }

    @Post('/:id/link/documents')
    @ApiCreatedResponse({ description: 'Documentos vinculados do colaborador com sucesso!' })
    @ApiNotFoundResponse({ description: 'Não encontramos o documento a ser atualizado!' })
    @ApiInternalServerErrorResponse({ description: 'Ocorreu um erro durante o vinculo dos documentos ao colaborador.' })
    @ApiOperation({ summary: 'Faz o vínculo dos documentos que foram enviados ao colaborador.' })
    async linkDocuments(
        @Res() res: Response,
        @Param('id', ParseIntPipe) id: string,
        @Body() documentType: LinkAndUnlinkDocumentsDTO
    ): Promise<Response<DefaultReturn>> {
        const data = await this.employeeService.linkOrUnlineEmployeeDocuments(id, StatusEnum.SENDED, documentType);

        return res.status(data.status).json(data);
    }

    @Post('/:id/unlink/documents')
    @ApiCreatedResponse({ description: 'Documentos desvinculados do colaborador com sucesso!' })
    @ApiNotFoundResponse({ description: 'Não encontramos o documento a ser atualizado!' })
    @ApiInternalServerErrorResponse({ description: 'Ocorreu um erro durante o desvinculo dos documentos ao colaborador.' })
    @ApiOperation({ summary: 'Desfaz o vínculo dos documentos que foram enviados ao colaborador.' })
    async unlinkDocuments(
        @Res() res: Response,
        @Param('id', ParseIntPipe) id: string,
        @Body() documentType: LinkAndUnlinkDocumentsDTO
    ): Promise<Response<DefaultReturn>> {
        const data = await this.employeeService.linkOrUnlineEmployeeDocuments(id, StatusEnum.PENDING, documentType);

        return res.status(data.status).json(data);
    }
}
