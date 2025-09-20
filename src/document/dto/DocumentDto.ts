import { StatusEnum } from "src/enums/StatusDocument";

export interface DocumentDto {
    name: string;
    status: StatusEnum;
    employeeid: number;
    documenttypeid: number;
}