import {
    Body,
    Controller,
    HttpStatus,
    Param,
    Get,
    Post,
    Put,
    Res,
    Query,
    ParseIntPipe
} from '@nestjs/common';
import type { Response } from 'express';

import { EmployeeDTO } from './dto/EmployeeDTO';
import { DocumentTypeDTO } from 'src/document/dto/DocumentTypeDTO';
import { LinkAndUnlinkDocumentsDTO } from './dto/LinkAndUnlinkDocumentsDTO';

import { EmployeeService } from 'src/employee/employee.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post('/new')
    @ApiOperation({ summary: 'Cria um novo colaborador, passando os parâmetros no corpo da requisição.' })
    @ApiResponse({ status: 201, description: 'Colaborador "Fulano da Silva" cadastrado com sucesso!' })
    @ApiResponse({ status: 400, description: 'Colaborador "Fulano da Silva" já se encontra cadastrado.' })
    async create(
        @Body() employeeDto: EmployeeDTO,
        @Res() res: Response
    ): Promise<Response> {
        const data = await this.employeeService.createEmployee(employeeDto);

        return res.status(HttpStatus.CREATED).json({
            success: data.status,
            data: {
                message: data.message
            }
        });
    }

    @Put('/update')
    @ApiOperation({ summary: 'Atualiza os dados do colaborador, passando os atributos no corpo da requisição.' })
    @ApiResponse({ status: 200, description: 'Colaborador "Fulano da Silva" atualizado com sucesso!' })
    @ApiResponse({ status: 400, description: 'Não encontramos este colaborador na nossa base.' })
    async update(
        @Body() employeeDto: EmployeeDTO,
        @Res() res: Response
    ): Promise<Response> {
        const data = await this.employeeService.updateEmployee(employeeDto);

        return res.status(HttpStatus.OK).json({
            success: data.status,
            data: {
                message: data.message
            }
        });
    }

    @Get('/:id/status/documents')
    @ApiResponse({ status: 200 })
    @ApiOperation({ summary: 'Lista todos os documentos do colaborador, passando seu id como parâmetro' })
    async listDocumentsStatus(
        @Param('id', ParseIntPipe) id: string,
        @Res() res: Response
    ): Promise<Response> {
        const data = await this.employeeService.listEmployeeDocumentsStatus(id);

        return res.status('status' in data && !data.status ? HttpStatus.BAD_REQUEST : HttpStatus.OK).json({
            success: 'status' in data || data.length > 0,
            data: data
        });
    }

    @Get('/list/pending/documents')
    @ApiResponse({ status: 200 })
    @ApiOperation({ summary: 'Lista todos os documentos de todos os colaboradores ou de um colaborador específico.' })
    async listPendingDocuments(
        @Query() params: any,
        @Res() res: Response
    ): Promise<Response> {
        const data = await this.employeeService.listEmployeesPendingDocuments(params);

        return res.status('status' in data && !data.status ? HttpStatus.BAD_REQUEST : HttpStatus.OK).json({
            success: 'status' in data || 'getpendingdocumentsjson' in data,
            data: 'getpendingdocumentsjson' in data ? data.getpendingdocumentsjson : data
        });
    }

    @Post('/:id/send/document')
    @ApiResponse({ status: 201, description: 'Documento "Enviar CNH" atribuído com sucesso ao colaborador!' })
    @ApiOperation({ summary: 'Atrela um documento à um colaborador, deixando pendente o envio.' })
    async sendDocument(
        @Param('id', ParseIntPipe) id: string,
        @Body() documentType: DocumentTypeDTO,
        @Res() res: Response
    ): Promise<Response> {
        const data = await this.employeeService.sendDocument(id, documentType);

        return res.status(HttpStatus.CREATED).json({
            success: data.status,
            data: {
                message: data.message,
                error: data.error
            }
        });
    }

    @Post('/:id/link/documents')
    @ApiResponse({ status: 201, description: 'Documentos vinculados do colaborador com sucesso!' })
    @ApiOperation({ summary: 'Faz o vínculo dos documentos que foram enviados ao colaborador.' })
    async linkDocuments(
        @Param('id', ParseIntPipe) id: string,
        @Body() documentType: LinkAndUnlinkDocumentsDTO,
        @Res() res: Response
    ): Promise<Response> {
        const data = await this.employeeService.linkEmployeeDocuments(id, documentType);

        return res.status(HttpStatus.CREATED).json({
            success: data.status,
            data: {
                message: data.message
            }
        });
    }

    @Post('/:id/unlink/documents')
    @ApiResponse({ status: 201, description: 'Documentos desvinculados do colaborador com sucesso!' })
    @ApiOperation({ summary: 'Desfaz o vínculo dos documentos que foram enviados ao colaborador.' })
    async unlinkDocuments(
        @Param('id', ParseIntPipe) id: string,
        @Body() documentType: LinkAndUnlinkDocumentsDTO,
        @Res() res: Response
    ): Promise<Response> {
        const data = await this.employeeService.unlinkEmployeeDocuments(id, documentType);

        return res.status(HttpStatus.CREATED).json({
            success: data.status,
            data: {
                message: data.message
            }
        });
    }
}
