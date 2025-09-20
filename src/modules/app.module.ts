import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { EmployeeController } from 'src/controllers/employee/employee.controller';
import { AppService } from '../services/app.service';
import { EmployeeService } from 'src/services/employee/employee.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    EmployeeController
  ],
  providers: [
    AppService,
    EmployeeService
  ],
})
export class AppModule {}
