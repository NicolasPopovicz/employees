import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { WinstonModule } from 'nest-winston';
import winston from 'winston';

import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptor/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: WinstonModule.createLogger({
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/app.log' }),
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
            ],
        }),
    });

    app.useGlobalPipes(new ValidationPipe({
        transform: true,           // Essencial para converter body em classe DTO
        whitelist: true,           // Remove props extras não definidas no DTO
        forbidNonWhitelisted: true // Lança erro se houver props extras
    }));

    app.useGlobalInterceptors(new LoggingInterceptor());

    const config = new DocumentBuilder()
        .setTitle('Colab API')
        .setDescription('API para controle de documentação de colaboradores')
        .setVersion('1.0')
        .addTag('employees')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, documentFactory, {
        jsonDocumentUrl: 'swagger/json',
    });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
