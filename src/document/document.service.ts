import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { DefaultReturn } from 'src/interfaces/ReturnObject';
import { DocumentTypeDTO } from './dto/DocumentTypeDTO';
import { DocumentType } from './entity/documenttype.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DocumentService {
    constructor(
        private manager: EntityManager,
        @InjectRepository(DocumentType)
        private documentTypeRepository: Repository<DocumentType>,
    ) {}

    async createDocument(documentType: DocumentTypeDTO): Promise<DefaultReturn> {
        if (!documentType || typeof documentType === 'undefined') {
            return {
                message: 'Nenhum dado foi fornecido!',
                status: false
            };
        }

        if (documentType.name.length === 0) {
            return {
                message: 'O nome não pode ser vazio!',
                status: false
            };
        }

        try {
            await this.manager.query(`
                INSERT INTO documenttype (name)
                VALUES ($1)
            `, [documentType.name]);
        } catch (error) {
            console.log(`Ocorreu um erro durante a criação do tipo de documento.`, error);
            return {
                message: 'Ocorreu um erro durante a criação do tipo de documento.',
                error: String(error),
                status: false
            };
        }

        return {
            status: true,
            message: `Documento '${documentType.name}' criado com sucesso!`
        }
    }
}
