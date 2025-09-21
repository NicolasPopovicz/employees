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

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post('/new')
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
