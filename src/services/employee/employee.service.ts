import { Injectable } from '@nestjs/common';
import { EmployeeDTO } from 'src/dtos/EmployeeDto';
import { DefaultReturn, ListDocuments } from 'src/interfaces/ReturnObject';

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
        message: 'Parâmetros fornecido é inválido!',
        status: false
      };
    }

    return {
      id: 3,
      employee: 'Nicolas Popovicz',
      documents: [
        {
          type: 'CPF',
          status: 'PENDENTE'
        },
        {
          type: 'CNPJ',
          status: 'ENVIADO'
        },
        {
          type: 'CTPS',
          status: 'ENVIADO'
        },
        {
          type: 'CNH',
          status: 'ENVIADO'
        }
      ]
    }
  }
}
