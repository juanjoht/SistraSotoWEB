export interface Vehicle{
    id?: number;
    transporter?:string;
    licensePlate?: string;
    model?: string;
    color?: string;
    chassisNumber?: string;
    grossWeight?:number;
    cubed?:string;
    kilometerToInspection?:number;
    kilometerLastInspection?:number;
    dateLastInspection?: string;
    type?: string;
    capacityTon?:number;
    capacityM3?:  number;
    AuthCode?: string;
    state?: string;
}

export interface allowedMaterial{
    id?: number;
    name?:string;
    materialId?: number;
    vehicleId?: number;
    materialsId?: number[]
    state?: string;
}