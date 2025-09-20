import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import { EmployeeDTO } from 'src/dtos/EmployeeDto';
import { EmployeeService } from 'src/services/employee/employee.service';

@Controller('/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('/new')
  create(@Body() employeeDto: EmployeeDTO, @Res() res: Response): Response {
    const data = this.employeeService.createEmployee(employeeDto);

    return res.status(!data.status ? HttpStatus.BAD_REQUEST : HttpStatus.CREATED).json({
      data: data
    });
  }

  @Put('/update')
  update(@Body() employeeDto: EmployeeDTO, @Res() res: Response): Response {
    const data = this.employeeService.updateEmployee(employeeDto);

    return res.status(!data.status ? HttpStatus.BAD_REQUEST : HttpStatus.OK).json({
      data: data
    });
  }

  @Get('/:id/documents/status')
  listDocumentsStatus(@Param('id') id: string, @Res() res: Response): Response {
    const data = this.employeeService.listEmployeeDocumentsStatus(id);

    return res.status('status' in data && !data.status ? HttpStatus.BAD_REQUEST : HttpStatus.OK).json({
      data: data
    });
  }
}
