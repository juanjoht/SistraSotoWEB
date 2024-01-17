export interface TransporterBasicInfo {
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
    payDeadline?: string;
}

export interface TransporterRoutes{
    transporterId?:number;
    id?: number;
    route?: string;
    routeId?: number;
    state?: string;
    routeName?:string;
}

export interface TransporterDocuments{
    id?: number;
    transporterId?:number;
    docId?:number;
    docName?: string;
    docUrl?: string;
    state?: string;
    maturityDate? : string;
}

export interface TransporterVehicles{
    id?: number;
    licensePlate?: string;
    type?: string;
    capacityTon?:number;
    capacityM3?:  number;
    AuthCode?: string;
    state?: string;
}

export interface TransporterVehicles{
    transporterId?:number;
    vehicleId?:number;
    id?: number;
    licensePlate?: string;
    type?: string;
    capacityTon?:number;
    capacityM3?:  number;
    AuthCode?: string;
    state?: string;
}

export interface TransporterDriver{
    transporterId?: number;
    driverId?: number;
    id?: number;
    docType?: string;
    docNum?: string;
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

export interface transporterShipping{
    transporterId?: number;
    id?: number;
    route?: string;
    routeId?: number;
    material?: string;
    materialId?: number;
    measureUnit?: string;
    shippingValue?: number;
    tonValue?: number;
    m3Value?: number;
    state?:string;

}