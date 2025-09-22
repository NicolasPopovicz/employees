interface PendingDocuments {
    id:     string;
    status: string;
    name:   string;
}

export interface DefaultReturn {
    message: string;
    error?:  string;
    status:  boolean;
};

export interface PendingDocumentEmployee {
    employeeId:       number;
    employeeName:     string;
    pendingDocuments: PendingDocuments[];
}

export interface PagedPendingDocumentEmployee {
    getpendingdocumentsjson: {
        currentPage:  number;
        totalPages:   number;
        totalRecords: number;
        hasNextPage:  boolean;
        data:         PendingDocumentEmployee[]
    }
}