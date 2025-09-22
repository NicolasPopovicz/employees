import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Employee } from './entity/employee.entity';
import { Document } from 'src/document/entity/document.entity';

import { EmployeeService } from './employee.service';

import { EmployeeController } from './employee.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Employee, Document])],
    providers: [EmployeeService],
    controllers: [EmployeeController],
})
export class EmployeeModule {}
