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
    state?: string;
    payDeadline? :string;
    thirdParty?:string;
    urlUserImg?:string;
}

export interface CustomerCommercialInfo {
    id?: number;
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
    id?: number;
    customerId?: number;
    name?: string;
    phone?: string;
    contactName?: string;
    dept?: string;
    city?:string;
    address?: string;
    email?: string;
    scale?:boolean;
    latitude?: number;
    length?: number;
    isAdminBySoto13?: boolean;
    queueWaitingTime?: number;
    tolerancePercentage?: number;
    deliveryConfirmation?: string;
    receptionTimes? : string;
    allowedVehicleTypes?: string;
    loadingTime?: string;
    simpleLoadingTime?: number;
    doubleLoadingTime?: number;
    truckLoadingTime?: number;
    state?:string;
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
    transportName?: string;
    status?: string;
}

export interface CustomerShipping{
    customerId?: number;
    id?: number;
    origin?: string;
    destination?: string;
    material?: string;
    measureUnit?: string;
    shippingValue?: number;
    tonValue?: number;
    m3Value?: number;

}