import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true,           // Essencial para converter body em classe DTO
        whitelist: true,           // Remove props extras não definidas no DTO
        forbidNonWhitelisted: true // Lança erro se houver props extras
    }));
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
