import { StatusEnum } from "src/enums/StatusDocument";

export interface DocumentDTO {
    name: string;
    status: StatusEnum;
    idemployee: number;
    iddocumenttype: number;
}