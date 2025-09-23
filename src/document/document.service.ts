import { HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ILike, Repository } from 'typeorm';

import { DefaultReturn } from 'src/interfaces/ReturnObject';

import { DocumentType } from './entity/documenttype.entity';

import { DocumentTypeDTO } from './dto/DocumentTypeDTO';

@Injectable()
export class DocumentService {
    private readonly logger = new Logger(DocumentService.name);

    constructor(
        @InjectRepository(DocumentType)
        private readonly documentRepository: Repository<DocumentType>,
    ) {}

    async createDocument(documentType: DocumentTypeDTO): Promise<DefaultReturn> {
        try {
            const checkIfExists = await this.documentRepository.find({
                where: { name: ILike(`%${documentType.name}%`) }
            })

            if (checkIfExists.length) {
                return {
                    success: false,
                    status:  HttpStatus.BAD_REQUEST,
                    message: `O documento '${documentType.name}' já existe!`,
                };
            }

            const partialCreate = this.documentRepository.create({
                name: documentType.name
            });

            await this.documentRepository.save(partialCreate);
        } catch (error) {
            this.logger.error('Erro ao criar tipo de documento', error.stack);
            throw new InternalServerErrorException('Ocorreu um erro durante a criação do tipo de documento.');
        }

        return {
            success: true,
            status:  HttpStatus.CREATED,
            message: `Documento '${documentType.name}' criado com sucesso!`,
        };
    }
}