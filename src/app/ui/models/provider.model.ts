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
    materialId?: number;
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

export interface ProviderFactories{
    id?: number;
    providerId?: number;
    name?: string;
    phone?: string;
    contactName?: string;
    dept?: string;
    city?:string;
    zone?:string;
    address?: string;
    email?: string;
    latitude?: number;
    length?: number;
    haveSoto13System?: boolean;
    enterDoc?: boolean;
    workTimes? : string;
    state?:string;
}
