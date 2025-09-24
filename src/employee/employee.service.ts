import { HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { DataSource, EntityManager, ILike, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
    DefaultReturn,
    PagedPendingDocumentEmployee,
    PendingDocumentEmployee
} from 'src/interfaces/ReturnObject';

import { EmployeeDTO } from './dto/EmployeeDTO';
import { DocumentTypeDTO } from 'src/document/dto/DocumentTypeDTO';
import { ListDocumentsQueryDto } from './dto/ListDocumentsQueryDTO';
import { LinkAndUnlinkDocumentsDTO } from './dto/LinkAndUnlinkDocumentsDTO';

import { StatusEnum } from 'src/enums/StatusDocument';

import { Employee } from './entity/employee.entity';
import { Document } from 'src/document/entity/document.entity';
import { DocumentType } from 'src/document/entity/documenttype.entity';

@Injectable()
export class EmployeeService {
    private readonly logger = new Logger(EmployeeService.name);

    constructor(
        private manager: EntityManager,

        @InjectRepository(Employee)
        private readonly employeeRepository: Repository<Employee>,

        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,

        @InjectRepository(DocumentType)
        private readonly documentTypeRepository: Repository<DocumentType>,
    ) {}

    async createEmployee(employee: EmployeeDTO): Promise<DefaultReturn> {
        try {
            const checkIfExists = await this.employeeRepository.find({
                where: {
                    name:     ILike(`%${employee.name}%`),
                    document: ILike(`%${employee.document}%`)
                }
            });

            if (checkIfExists.length) {
                return {
                    success: false,
                    status:  HttpStatus.BAD_REQUEST,
                    message: 'Já existe um colaborador com estes dados!',
                };
            }

            const partialCreate = this.employeeRepository.create({
                name:     employee.name,
                document: employee.document
            });

            await this.employeeRepository.save(partialCreate);
        } catch (error) {
            this.logger.error('Erro ao criar tipo de documento', error.stack);
            throw new InternalServerErrorException(`Ocorreu um erro durante a criação do colaborador '${employee.name}'.`);
        }

        return {
            success: true,
            status:  HttpStatus.CREATED,
            message: `Colaborador '${employee.name}' cadastrado com sucesso!`,
        };
    }

    async updateEmployee(employee: EmployeeDTO): Promise<DefaultReturn> {
        try {
            const checkIfExists = await this.employeeRepository.findOneBy({ id: employee.id });

            if (!checkIfExists) {
                return {
                    success: false,
                    status:  HttpStatus.BAD_REQUEST,
                    message: `Não encontramos o colaborador '${employee.name}'`,
                };
            }

            await this.employeeRepository.update({
                id:       employee.id,
            }, {
                name:     employee.name,
                document: employee.document
            });
        } catch (error) {
            this.logger.error('Erro durante a atualização do colaborador.', error.stack);
            throw new InternalServerErrorException(`Ocorreu um erro durante a atualização do colaborador '${employee.name}'.`);
        }

        return {
            success: true,
            status:  HttpStatus.OK,
            message: `Colaborador '${employee.name}' atualizado com sucesso!`,
        };
    }

    async listEmployeeDocumentsStatus(id: string): Promise<DefaultReturn> {
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
            this.logger.error('Erro durante a listagem dos status dos documentos dos colaboradores.', error.stack);
            throw new InternalServerErrorException('Ocorreu um erro durante a listagem dos status dos documentos dos colaboradores.');
        }

        const message = pendingDocs.length === 0
            ? 'Este colaborador não possui documentos vinculados'
            : 'Listagem dos status dos documentos do colaborador'

        return {
            success: true,
            status:  HttpStatus.OK,
            message: message,
            data:    pendingDocs
        };
    }

    async listEmployeesPendingDocuments(query: ListDocumentsQueryDto): Promise<DefaultReturn> {
        let pendingDocs: PagedPendingDocumentEmployee[];

        try {
            pendingDocs = await this.manager.connection.query<PagedPendingDocumentEmployee[]>(`
                SELECT getpendingdocumentsjson($1, $2, $3, $4, $5)
            `, [query.employee, query.documenttype, StatusEnum.PENDING, query.page, query.totalrecords]);
        } catch (error) {
            this.logger.error('Erro durante listagem dos documentos pendentes dos colaboradores.', error.stack);
            throw new InternalServerErrorException('Ocorreu um erro durante listagem dos documentos pendentes dos colaboradores.');
        }

        const checkResult = pendingDocs[0]?.getpendingdocumentsjson;

        if (!checkResult) {
            return {
                success: true,
                status:  HttpStatus.OK,
                message: 'Não há colaboradores com documentos pendentes!',
            };
        }

        return {
            success: true,
            status:  HttpStatus.OK,
            message: 'Listagem de colaboradores com documentos pendentes',
            data:    checkResult
        };
    }

    async sendDocument(id: string, documentType: DocumentTypeDTO): Promise<DefaultReturn> {
        try {
            const checkIfEmployeeExists = await this.employeeRepository.findOneBy({ id: Number(id) });
            const checkIfDocTypeExists  = await this.documentTypeRepository.findOneBy({ id: documentType.id });

            if (!checkIfEmployeeExists) {
                return {
                    success: true,
                    status:  HttpStatus.BAD_REQUEST,
                    message: 'Não encontramos o colaborador com os dados fornecidos na nossa base!'
                };
            }

            if (!checkIfDocTypeExists) {
                return {
                    success: true,
                    status:  HttpStatus.BAD_REQUEST,
                    message: 'Não encontramos o tipo de documento com os dados fornecidos na nossa base!'
                };
            }

            const partialCreate = this.documentRepository.create({
                name:           documentType.name,
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
            success: true,
            status:  HttpStatus.OK,
            message: `Documento '${documentType.name}' atribuído com sucesso ao colaborador!`
        };
    }

    async linkOrUnlineEmployeeDocuments(id: string, status: StatusEnum, linkDocs: LinkAndUnlinkDocumentsDTO): Promise<DefaultReturn> {
        const typeMessage = status === StatusEnum.SENDED ? 'vinculo' : 'desvinculo';

        try {
            const checkIfExists = await this.documentRepository.find({
                where: {
                    id:         In(linkDocs.documentIds),
                    idemployee: { id: Number(id) }
                }
            })

            if (!checkIfExists.length) {
                return {
                    success: false,
                    status:  HttpStatus.BAD_REQUEST,
                    message: 'Não encontramos o documento a ser atualizado!',
                };
            }

            await this.documentRepository.update({
                id:         In(linkDocs.documentIds),
                idemployee: { id: Number(id) }
            }, {
                status:     status,
            });
        } catch (error) {
            this.logger.error(`Erro durante o ${typeMessage} dos documentos ao colaborador.`, error.stack);
            throw new InternalServerErrorException(`Ocorreu um erro durante o ${typeMessage} dos documentos ao colaborador.`);
        }

        return {
            success: true,
            status:  HttpStatus.CREATED,
            message: `Documentos ${status === StatusEnum.SENDED ? 'vinculados ao' : 'desvinculados do'} colaborador com sucesso!`
        };
    }
}
