import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, EntityManager, In, Repository } from 'typeorm';

import {
    DefaultReturn,
    PagedPendingDocumentEmployee,
    PendingDocumentEmployee
} from 'src/interfaces/ReturnObject';

import { EmployeeDTO } from './dto/EmployeeDTO';
import { DocumentTypeDTO } from 'src/document/dto/DocumentTypeDTO';
import { LinkAndUnlinkDocumentsDTO } from './dto/LinkAndUnlinkDocumentsDTO';

import { StatusEnum } from 'src/enums/StatusDocument';

import { Employee } from './entity/employee.entity';
import { Document } from 'src/document/entity/document.entity';

@Injectable()
export class EmployeeService {
    private readonly logger = new Logger(EmployeeService.name);

    constructor(
        private manager: EntityManager,

        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,

        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,
    ) {}

    async createEmployee(
        employee: EmployeeDTO
    ): Promise<DefaultReturn> {
        try {
            const partialCreate = this.employeeRepository.create({
                name: employee.name,
                document: employee.document
            });

            await this.employeeRepository.save(partialCreate);
        } catch (error) {
            this.logger.error('Erro ao criar tipo de documento', error.stack);
            throw new InternalServerErrorException('Ocorreu um erro durante a criação do tipo de documento.');
        }

        return {
            message: `Colaborador '${employee.name}' cadastrado com sucesso!`,
            status: true
        };
    }

    async updateEmployee(
        employee: EmployeeDTO
    ): Promise<DefaultReturn> {
        try {
            await this.employeeRepository.update({
                name:     employee.name,
                document: employee.document,
            }, {
                id:       employee.id,
            });
        } catch (error) {
            this.logger.error('Erro durante a atualização do colaborador.', error.stack);
            throw new InternalServerErrorException('Ocorreu um erro durante a atualização do colaborador.');
        }

        return {
            message: `Colaborador '${employee.name}' atualizado com sucesso!`,
            status: true
        };
    }

    async listEmployeeDocumentsStatus(
        id: string
    ): Promise<DefaultReturn | PendingDocumentEmployee[]> {
        let pendingDocs: PendingDocumentEmployee[] = [];

        const dbDriver: DataSource = (!this.manager.connection.isInitialized)
            ? await this.manager.connection.initialize()
            : this.manager.connection;

        try {
            pendingDocs = await dbDriver.query<PendingDocumentEmployee[]>(`
                SELECT
                    e.id   AS employeeId,
                    e.name AS employeeName,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', d.id,
                            'status', d.status,
                            'name', dt.name
                        ) ORDER BY d.id
                    ) AS pendingDocuments
                FROM employee e
                JOIN document d      ON d.idemployee = e.id AND e.id = $1
                JOIN documenttype dt ON d.iddocumenttype = dt.id
                GROUP BY e.id, e.name
            `, [Number(id)]);
        } catch (error) {
            this.logger.error('Erro durante a listagem dos status dos documentos.', error.stack);
            throw new InternalServerErrorException('Ocorreu um erro durante a listagem dos status dos documentos.');
        }

        return pendingDocs.length === 0 ? {
            message: 'Não há colaboradores com documentos pendentes!',
            status: true
        } : pendingDocs;
    }

    async listEmployeesPendingDocuments(
        params: any
    ): Promise<DefaultReturn | PagedPendingDocumentEmployee> {
        let pendingDocs: PagedPendingDocumentEmployee[];

        try {
            pendingDocs = await this.manager.connection.query<PagedPendingDocumentEmployee[]>(`
                SELECT getpendingdocumentsjson($1, $2, $3)
            `, [StatusEnum.PENDING, params.page ?? 1, params.totalrecords ?? 10]);
        } catch (error) {
            this.logger.error('Erro durante listagem dos documentos pendentes.', error.stack);
            throw new InternalServerErrorException('Ocorreu um erro durante listagem dos documentos pendentes.');
        }

        if (!pendingDocs[0]?.getpendingdocumentsjson) {
            return {
                message: 'Não há colaboradores com documentos pendentes!',
                status: true
            };
        }

        return pendingDocs[0];
    }

    async sendDocument(
        id: string,
        documentType: DocumentTypeDTO
    ): Promise<DefaultReturn> {
        try {
            const partialCreate = this.documentRepository.create({
                name:           '',
                status:         StatusEnum.PENDING,
                idemployee:     { id: Number(id) },
                iddocumenttype: { id: documentType.id }
            });

            await this.documentRepository.save(partialCreate);
        } catch (error) {
            this.logger.error(`Erro durante o envio do documento '${documentType.name}'`, error.stack);
            throw new InternalServerErrorException(`Ocorreu um erro durante o envio do documento '${documentType.name}'.`);
        }

        return {
            message: `Documento '${documentType.name}' atribuído com sucesso ao colaborador!`,
            status: true
        };
    }

    async linkEmployeeDocuments(
        id: string,
        linkDocs: LinkAndUnlinkDocumentsDTO
    ): Promise<DefaultReturn> {
        try {
            await this.documentRepository.update({
                idemployee: { id: Number(id) },
                id: In(linkDocs.documentIds),
            }, {
                status: StatusEnum.SENDED,
            });
        } catch (error) {
            this.logger.error('Erro durante o vinculo dos documentos ao colaborador.', error.stack);
            throw new InternalServerErrorException('Ocorreu um erro durante o vinculo dos documentos ao colaborador.');
        }

        return {
            message: `Documentos vinculados do colaborador com sucesso!`,
            status: true
        };
    }

    async unlinkEmployeeDocuments(
        id: string,
        linkDocs: LinkAndUnlinkDocumentsDTO
    ): Promise<DefaultReturn> {
        try {
            await this.documentRepository.update({
                idemployee: { id: Number(id) },
                id:         In(linkDocs.documentIds),
            }, {
                status:     StatusEnum.PENDING,
            });
        } catch (error) {
            this.logger.error('Erro ao desvincular dos documentos ao colaborador.', error.stack);
            throw new InternalServerErrorException('Ocorreu um erro ao desvincular dos documentos ao colaborador.');
        }

        return {
            message: `Documentos desvinculados do colaborador com sucesso!`,
            status: true
        };
    }
}
