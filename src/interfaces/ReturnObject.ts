interface PendingDocuments {
    id:     string;
    status: string;
    name:   string;
}

export interface DefaultReturn {
    success: boolean;
    status:  number;
    message: string;
    data?:   object;
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