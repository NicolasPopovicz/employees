import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DocumentModule } from './document/document.module';
import { EmployeeModule } from './employee/employee.module';

import { DocumentType } from './document/entity/documenttype.entity';
import { Document } from './document/entity/document.entity';
import { Employee } from './employee/entity/employee.entity';

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
        DocumentModule,
        EmployeeModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
