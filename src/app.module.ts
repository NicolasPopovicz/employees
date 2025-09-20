import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentController } from 'src/document/document.controller';
import { EmployeeController } from 'src/employee/employee.controller';

import { DocumentService } from './document/document.service';
import { EmployeeService } from 'src/employee/employee.service';

import { Document } from 'src/entities/document.entity';
import { DocumentType } from 'src/entities/documenttype.entity';
import { Employee } from 'src/entities/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: 5432,
      username: process.env.DB_USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'a',
      database: process.env.DB_DATABASE ?? 'employees',
      entities: [Document, DocumentType, Employee],
      synchronize: true,
    }),
  ],
  controllers: [
    DocumentController,
    EmployeeController
  ],
  providers: [
    DocumentService,
    EmployeeService
  ],
})
export class AppModule {}
