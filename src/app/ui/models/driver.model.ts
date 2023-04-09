export interface DriverInfo {
    id?: number;
    docType?: string;
    docNumber?: string;
    name?: string;
    phone?: string;
    cellPhone?: string;
    email?: string;
    dept?: string;
    city?: string;
    address?: string;
    urlUserImg?: string;
    bloodType?: string;
    restTime?: number;
    contact?: string;
    phoneContact?: string;
    comments?: string;
    state?: string;
}

export interface DriverGeneralInfo{
    driverId?: number,
    bloodType?: string;
    restTime?: number;
    contact?: string;
    phoneContact?: string;
    comments?: string;
}

export interface DriverDocument{
    id?: number;
    driverId?: number;
    docId?: number;
    maturityDate?: string;
    docName?: string;
    docUrl?: string;
    state?: string;
}

