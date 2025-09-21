import { Body, Controller, HttpStatus, Param, Get, Post, Put, Res, Query } from '@nestjs/common';
import type { Response } from 'express';
import type { EmployeeDTO } from './dto/EmployeeDTO';
import type { DocumentTypeDTO } from 'src/document/dto/DocumentTypeDTO';
import { EmployeeService } from 'src/employee/employee.service';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post('/new')
    async create(@Body() employeeDto: EmployeeDTO, @Res() res: Response): Promise<Response> {
        const data = await this.employeeService.createEmployee(employeeDto);

        return res.status(!data.status ? HttpStatus.BAD_REQUEST : HttpStatus.CREATED).json({
            success: data.status,
            data: {
                message: data.message
            }
        });
    }

    @Put('/update')
    async update(@Body() employeeDto: EmployeeDTO, @Res() res: Response): Promise<Response> {
        const data = await this.employeeService.updateEmployee(employeeDto);

        return res.status(!data.status ? HttpStatus.BAD_REQUEST : HttpStatus.OK).json({
            success: data.status,
            data: {
                message: data.message
            }
        });
    }

    @Get('/:id/status/documents')
    async listDocumentsStatus(@Param('id') id: string, @Res() res: Response): Promise<Response> {
        const data = await this.employeeService.listEmployeeDocumentsStatus(id);

        return res.status('status' in data && !data.status ? HttpStatus.BAD_REQUEST : HttpStatus.OK).json({
            success: 'status' in data || data.length > 0,
            data: data
        });
    }

    @Get('/list/pending/documents')
    async listPendingDocuments(@Query() params: any, @Res() res: Response): Promise<Response> {
        const data = await this.employeeService.listEmployeesPendingDocuments(params);

        return res.status('status' in data && !data.status ? HttpStatus.BAD_REQUEST : HttpStatus.OK).json({
            success: 'status' in data || 'getpendingdocumentsjson' in data,
            data: 'getpendingdocumentsjson' in data ? data.getpendingdocumentsjson : data
        });
    }

    @Post('/:id/send/document')
    async sendDocument(@Param('id') id: string, @Body() documentType: DocumentTypeDTO, @Res() res: Response): Promise<Response>  {
        const data = await this.employeeService.sendDocument(id, documentType);

        return res.status(!data.status ? HttpStatus.BAD_REQUEST : HttpStatus.CREATED).json({
            success: data.status,
            data: {
                message: data.message,
                error: data.error
            }
        });
    }

    // @Post('/:id/link/documents')
    // linkDocuments(@Res() res: Response): Response  {

    // }

    // @Post('/:id/unlink/documents')
    // unlinkDocuments(@Res() res: Response): Response  {

    // }
}
