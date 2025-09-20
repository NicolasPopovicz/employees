import { StatusEnum } from "src/enums/StatusDocument";

interface Document {
    type: string;
    status: StatusEnum.PENDING | StatusEnum.SENDED;
}

export interface DefaultReturn {
    message: string;
    status: boolean;
};

export interface ListDocuments {
    id: number;
    employee: string;
    documents: Document[];
}

export interface PendingDocumentEmployee {
    id: number;
    employee: string;
    pendingDocuments: {
        document: string;
    }[];
}