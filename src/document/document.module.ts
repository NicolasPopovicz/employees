import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Document } from './entity/document.entity';
import { DocumentType } from './entity/documenttype.entity';

import { DocumentService } from './document.service';

import { DocumentController } from './document.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Document, DocumentType])],
    providers: [DocumentService],
    controllers: [DocumentController],
})
export class DocumentModule {}
