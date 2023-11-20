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
    urlImg?:string;
    waitingTime?: string;
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
    creditBalance?:number;
    exclusiveTransport?: boolean;
}

export interface CustomerBuildings{
    id?: number;
    customerId?: number;
    name?: string;
    phone?: string;
    contactName?: string;
    dept?: string;
    city?:string;
    zone?:string;
    address?: string;
    email?: string;
    scale?:boolean;
    latitude?: number;
    length?: number;
    isAdminBySoto13?: boolean;
    allCost?: boolean;
    queueWaitingTime?: number;
    tolerancePercentage?: number;
    intermediationPercentage?: number;
    deliveryConfirmation?: string;
    receptionTimes? : string;
    allowedVehicleTypes?: string;
    loadingTime?: string;
    profitability?: number;
    roadCondition?: number;
    unloadingAgility?: number;
    weightedRating?: number;
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
    codeAuth?:string;
    status?: string;
}

export interface CustomerShipping{
    customerId?: number;
    id?: number;
    route?: string;
    routeId?: number;
    material?: string;
    measureUnit?: string;
    shippingValue?: number;
    tonValue?: number;
    m3Value?: number;
    state?: string;
}

export interface CustomerLicensePlate{
    id?: number;
    name?: string;
}