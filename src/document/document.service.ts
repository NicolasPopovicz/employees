import { Injectable } from '@nestjs/common';
import { DocumentTypeDTO } from './dto/DocumentTypeDTO';
import { DefaultReturn } from 'src/interfaces/ReturnObject';

@Injectable()
export class DocumentService {
    createDocument(documentType: DocumentTypeDTO): DefaultReturn {
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

        return {
            status: true,
            message: `Documento '${documentType.name}' criado com sucesso!`
        }
    }
}
