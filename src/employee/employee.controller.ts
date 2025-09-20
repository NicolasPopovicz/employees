import { Body, Controller, HttpStatus, Param, Get, Post, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { EmployeeDTO } from './dto/EmployeeDTO';
import { EmployeeService } from 'src/employee/employee.service';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Post('/new')
    create(@Body() employeeDto: EmployeeDTO, @Res() res: Response): Response {
        const data = this.employeeService.createEmployee(employeeDto);

        return res.status(!data.status ? HttpStatus.BAD_REQUEST : HttpStatus.CREATED).json({
            success: data.status,
            data: data
        });
    }

    @Put('/update')
    update(@Body() employeeDto: EmployeeDTO, @Res() res: Response): Response {
        const data = this.employeeService.updateEmployee(employeeDto);

        return res.status(!data.status ? HttpStatus.BAD_REQUEST : HttpStatus.OK).json({
            success: data.status,
            data: data
        });
    }

    @Get('/:id/documents/status')
    listDocumentsStatus(@Param('id') id: string, @Res() res: Response): Response {
        const data = this.employeeService.listEmployeeDocumentsStatus(id);

        return res.status('status' in data && !data.status ? HttpStatus.BAD_REQUEST : HttpStatus.OK).json({
            success: 'documents' in data,
            data: data
        });
    }

    @Get('/list/documents/pending')
    listPendingDocuments(@Res() res: Response): Response {
        const data = this.employeeService.listEmployeesPendingDocuments();

        return res.status(typeof data === "object" ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json({
            success: true,
            data: data
        });
    }

    // @Post('/:id/document/send')
    // sendDocument(@Param('id') id: string, @Res() res: Response): Response  {

    // }

    // @Post('/:id/documents/link')
    // linkDocuments(@Res() res: Response): Response  {

    // }

    // @Post('/:id/documents/unlink')
    // unlinkDocuments(@Res() res: Response): Response  {

    // }
}
