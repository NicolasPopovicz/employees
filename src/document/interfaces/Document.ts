import { StatusEnum } from "../../enums/StatusDocument";

export interface Document {
    id:             string;
    name:           string;
    status:         StatusEnum;
    employeeid:     number;
    documenttypeid: number;
}