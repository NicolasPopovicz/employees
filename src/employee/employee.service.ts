/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DefaultReturn, PagedPendingDocumentEmployee, PendingDocumentEmployee } from 'src/interfaces/ReturnObject';
import { StatusEnum } from 'src/enums/StatusDocument';
import { EmployeeDTO } from './dto/EmployeeDTO';
import { DocumentTypeDTO } from 'src/document/dto/DocumentTypeDTO';
import { Employee } from './entity/employee.entity';

@Injectable()
export class EmployeeService {
    constructor(private dataSource: DataSource, private manager: EntityManager) {}

    async createEmployee(employee: EmployeeDTO): Promise<DefaultReturn> {
        if (typeof employee === 'undefined') {
            return {
                message: 'Nenhum dado foi fornecido!',
                status: false
            };
        }

        const dbDriver: DataSource = (!this.dataSource.isInitialized) ? await this.dataSource.initialize() : this.dataSource;

        try {
            await dbDriver.createQueryBuilder()
                .insert().into(Employee)
                .values([employee])
                .execute();
        } catch (error) {
            console.log(`Ocorreu um erro durante a criação do colaborador.`, error);
            return {
                message: 'Ocorreu um erro durante a criação do colaborador.',
                error: String(error),
                status: false
            };
        } finally {
            await dbDriver.destroy();
        }

        return {
            message: `Colaborador '${employee.name}' cadastrado com sucesso!`,
            status: true
        };
    }

    async updateEmployee(employee: EmployeeDTO): Promise<DefaultReturn> {
        if (typeof employee === 'undefined') {
            return {
                message: 'Nenhum dado foi fornecido!',
                status: false
            };
        }

        if (!employee.id || typeof employee.id === 'undefined') {
            return {
                message: 'Parâmetros insuficientes para completar a requisição!',
                status: false
            };
        }

        const dbDriver: DataSource = (!this.dataSource.isInitialized) ? await this.dataSource.initialize() : this.dataSource;

        try {
            await dbDriver.createQueryBuilder()
                .update(Employee)
                .set({ name: employee.name, document: employee.document })
                .where("id = :id", { id: employee.id })
                .execute();
        } catch (error) {
            console.log(`Ocorreu um erro durante a atualização do colaborador.`, error);
            return {
                message: 'Ocorreu um erro durante a atualização do colaborador.',
                status: false
            };
        } finally {
            await dbDriver.destroy();
        }

        return {
            message: `Colaborador '${employee.name}' atualizado com sucesso!`,
            status: true
        };
    }

    async listEmployeeDocumentsStatus(id: string): Promise<DefaultReturn | PendingDocumentEmployee[]> {
        if (!/^\d+$/.test(id)) {
            return {
                message: 'Parâmetro fornecido é inválido!',
                status: false
            };
        }

        let pendingDocs: PendingDocumentEmployee[] = [];
        const dbDriver: DataSource = (!this.manager.connection.isInitialized) ? await this.manager.connection.initialize() : this.manager.connection;

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
            console.log(`Ocorreu um erro durante a criação do colaborador.`, error);
            return {
                message: 'Ocorreu um erro durante a criação do colaborador.',
                error: String(error),
                status: false
            };
        } finally {
            await dbDriver.destroy();
        }

        return pendingDocs.length === 0 ? {
            message: 'Não há colaboradores com documentos pendentes!',
            status: true
        } : pendingDocs;
    }

    async listEmployeesPendingDocuments(params: any): Promise<DefaultReturn | PagedPendingDocumentEmployee> {
        let pendingDocs: PagedPendingDocumentEmployee[];
        const dbDriver: DataSource = (!this.manager.connection.isInitialized) ? await this.manager.connection.initialize() : this.manager.connection;

        try {
            pendingDocs = await dbDriver.query<PagedPendingDocumentEmployee[]>(`
                SELECT getpendingdocumentsjson($1, $2, $3)
            `, [StatusEnum.PENDING, params.page ?? 1, params.totalrecords ?? 10]);
        } catch (error) {
            console.log(`Ocorreu um erro durante a criação do colaborador.`, error);
            return {
                message: 'Ocorreu um erro durante a criação do colaborador.',
                error: String(error),
                status: false
            };
        } finally {
            await dbDriver.destroy();
        }

        if (!pendingDocs[0]?.getpendingdocumentsjson) {
            return {
                message: 'Não há colaboradores com documentos pendentes!',
                status: true
            };
        }

        return pendingDocs[0];
    }

    async sendDocument(id: string, documentType: DocumentTypeDTO): Promise<DefaultReturn> {
        if (!/^\d+$/.test(id)) {
            return {
                message: 'Parâmetro fornecido é inválido!',
                status: false
            };
        }

        if (typeof documentType === 'undefined') {
            return {
                message: 'Nenhum dado foi fornecido!',
                status: false
            };
        }

        const dbDriver: DataSource = (!this.manager.connection.isInitialized) ? await this.manager.connection.initialize() : this.manager.connection;

        try {
            await dbDriver.query(`
                INSERT INTO document (name, status, idemployee, iddocumenttype)
                VALUES ($1, '${StatusEnum.PENDING}', $2, $3)
            `, [documentType.name, Number(id), documentType.id]);
        } catch (error) {
            console.log(`Ocorreu um erro durante a criação do colaborador.`, error);
            return {
                message: 'Ocorreu um erro durante a criação do colaborador.',
                error: String(error),
                status: false
            };
        } finally {
            await dbDriver.destroy();
        }

        return {
            message: `Documento '${documentType.name}' atribuído com sucesso ao colaborador!`,
            status: true
        };
    }
}
