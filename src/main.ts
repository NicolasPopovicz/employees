import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true,           // Essencial para converter body em classe DTO
        whitelist: true,           // Remove props extras não definidas no DTO
        forbidNonWhitelisted: true // Lança erro se houver props extras
    }));

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
