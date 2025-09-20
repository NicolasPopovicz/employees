import { StatusEnum } from "src/enums/StatusDocument";

export interface Document {
    id: string;
    name: string;
    status: StatusEnum;
    employeeid: number;
    documenttypeid: number;
}