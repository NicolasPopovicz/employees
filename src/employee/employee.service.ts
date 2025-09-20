import { Injectable } from '@nestjs/common';
import { EmployeeDTO } from 'src/employee/dto/Employee';
import { StatusEnum } from 'src/enums/StatusDocument';
import { DefaultReturn, ListDocuments, PendingDocumentEmployee } from 'src/interfaces/ReturnObject';

@Injectable()
export class EmployeeService {
  createEmployee(employee: EmployeeDTO): DefaultReturn {
    if (typeof employee === 'undefined') {
      return {
        message: 'Nenhum dado foi fornecido!',
        status: false
      };
    }

    return {
      message: 'Colaborador cadastrado com sucesso!',
      status: true
    };
  }

  updateEmployee(employee: EmployeeDTO): DefaultReturn {
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

    return {
      message: 'Colaborador atualizado com sucesso!',
      status: true
    };
  }

  listEmployeeDocumentsStatus(id: string): DefaultReturn|ListDocuments {
    if (!/^\d+$/.test(id)) {
      return {
        message: 'Parâmetro fornecido é inválido!',
        status: false
      };
    }

    return {
      id: 3,
      employee: 'Nicolas Popovicz',
      documents: [
        {
          type: 'CPF',
          status: StatusEnum.PENDING
        },
        {
          type: 'CNPJ',
          status: StatusEnum.SENDED
        },
        {
          type: 'CTPS',
          status: StatusEnum.SENDED
        },
        {
          type: 'CNH',
          status: StatusEnum.SENDED
        }
      ]
    }
  }

  listEmployeesPendingDocuments(): PendingDocumentEmployee[] {
    return [
      {
        id: 3,
        employee: 'Nicolas Popovicz',
        pendingDocuments: [
          {
            document: 'CPF',
          },
        ]
      },
      {
        id: 12,
        employee: 'Cacetinho da Silva',
        pendingDocuments: [
          {
            document: 'CPF',
          },
          {
            document: 'CNPJ',
          },
          {
            document: 'CTPS',
          },
          {
            document: 'CNH',
          }
        ]
      },
    ]
  }
}
