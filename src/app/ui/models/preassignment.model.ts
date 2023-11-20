export interface preassignment {
    id?: number,
    serviceDate?: Date,
    originalServiceDate?: Date,
    serviceHour?: string,
    buildingId?: number,
    buildingName?: string,
    clientName?: string,
    materialId?: number,
    materialName?: number,
    measureUnit?: string,
    amount?: number,
    vehicleId?: number,
    vehiclePlate?: String,
    driverId?: number,
    driverName?: String,
    factoryId?: number,
    factoryName?:string,
    rejectionReason?: string,
    factoryEnterDoc?: boolean,
    buildingAllCost?: boolean,
    state?: string
}

