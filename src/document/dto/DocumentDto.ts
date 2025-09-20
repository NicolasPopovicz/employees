import { StatusEnum } from "src/enums/StatusDocument";

export interface DocumentDTO {
    name: string;
    status: StatusEnum;
    employeeid: number;
    documenttypeid: number;
}