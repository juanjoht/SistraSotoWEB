export interface CustomerBasicInfo {
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
    isActive?: boolean;
}

export interface CustomerCommercialInfo {
    customerId?: number;
    priorityGroup?: string;
    customerType?: string;
    iva?: number;
    assignedQuota?: number;
    usedQuota?: number;
    availableQuota?: number;
    maturityDays?: number;
    additionalDays?: number;
    delayDays?: number;
    intermediationPercentage?: number;
    measureUnit?: string;
}

export interface CustomerBuildings{
    customerId?: number;
    name?: string;
    phone?: string;
    contactName?: string;
    dept?: string;
    city?:string;
    address?: string;
    email?: string;
    scale?:string;
    latitude?: number;
    length?: number;
    isAdminBySoto13?: boolean;
    queueWaitingTime?: number;
    tolerancePercentage?: number;
    deliveryConfirmation?: string;
    receptionTimes? : BuildingsReceptionTimes[];
    allowedVehicleTypes: string;
    simpleLoadingTime: number;
    doubleLoadingTime: number;
    truckLoadingTime: number;
}

export interface BuildingsReceptionTimes{
    id?: number;
    day?: string;
    receive?: boolean;
    time?: string
}

export interface CustomerTransport{
    customerId?: number;
    transportId?: number;
    status?: string;
}

export interface CustomerShipping{
    customerId?: number;
    origin?: number;
    destination?: number;
    material?: number;
    measureUnit: number;
    shippingValue: number;
}