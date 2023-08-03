export interface order {
    id?: number,
    startDate?: Date,
    startDateFormat?: string,
    buildingId?: number,
    buildingName?: string,
    materialId?: number,
    materialName?: number,
    clientId?: number,
    clientName?: string,
    monday?: number,
    tuesday?: number,
    wednesday?: number,
    thursday?: number,
    friday?: number,
    saturday?: number,
    sunday?: number,
    totalAmount?: number,
    aprobeAmount?: number,
    state?: string
}

export interface providerOrder {
    id?: number,
    shipmentDate?: Date,
    providerId?: number,
    providerName?: string,
    buildingId? :number,
    buildingName?: string,
    clientName?: string,
    materialId?: number,
    materialName?:string,
    amount? : number,
    state?: string
}