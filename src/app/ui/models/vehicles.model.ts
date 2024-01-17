export interface Vehicle{
    id?: number;
    transporter?:string;
    licensePlate?: string;
    model?: string;
    color?: string;
    chassisNumber?: string;
    grossWeight?:number;
    cubed?:boolean;
    kilometerToInspection?:number;
    kilometerLastInspection?:number;
    dateLastInspection?: string;
    type?: string;
    capacityTon?:number;
    capacityM3?:  number;
    AuthCode?: string;
    state?: string;
}

export interface VehiclePlate{
    id?: number;
    name?:string;
}

export interface allowedMaterial{
    id?: number;
    name?:string;
    materialId?: number;
    vehicleId?: number;
    materialsId?: number[]
    state?: string;
}

export interface Driver{
    id?: number;
    vehicleId?: number;
    name?: string;
    state?: string;
}

export interface VehicleDocuments{
    id?: number;
    vehicleId?:number;
    docId?:number;
    docName?: string;
    docUrl?: string;
    state?: string;
    maturityDate? : string;
}

export interface VehicleRestrictedDestination{
    restrictedDestinationId?: number;
    vehicleId?:number;
}