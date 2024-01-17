export interface order {
    id?: number,
    startDate?: Date,
    startDateFormat?: string,
    factoryId? : number,
    factoryName?: string,
    buildingId?: number,
    buildingName?: string,
    materialId?: number,
    materialName?: number,
    clientId?: number,
    clientName?: string,
    aut?: string,
    automatic? : boolean,
    UnitMeasure?: string,
    monday?: number,
    tuesday?: number,
    wednesday?: number,
    thursday?: number,
    friday?: number,
    saturday?: number,
    sunday?: number,
    requestAmount?: number,
    deliveredAmount?:number,
    aprobeAmount?: number,
    totalAmount?: number,
    state?: string,

}

export interface paginationInfo {
    currentPage?: number,
    itemsPerPage?: number,
    totalItems?: number,
    totalPages?: number
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