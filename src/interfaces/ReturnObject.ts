export interface DefaultReturn {
    message: string;
    status: boolean;
};

interface Document {
    type: string;
    status: 'PENDENTE' | 'ENVIADO';
}

export interface ListDocuments {
    id: number;
    employee: string;
    documents: Document [];
}