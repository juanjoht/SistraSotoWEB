export interface ProviderBasicInfo {
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
    waitingTime?: string;
    state?: string;
}

export interface ProviderPrices{
    id?: number;
    providerId?: number;
    material?: string;
    valueM3?:number;
    valueTon?:  number;
    state?: string;
}

export interface ProviderTimes{
    id?: number;
    providerId?: number;
    material?: string;
    simple?:number;
    double?:  number;
    tractor?:  number;
    state?: string;
}
