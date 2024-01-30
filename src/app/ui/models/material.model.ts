export interface material {
    id?: number;
    name?: string;
    materialTypeId?: number,
    materialType?: string,
    unitMass?: number;
    valueM3?: number;
    valueMinM3?: number;
    valueMaxM3?: number;
    valueTon?: number;
    valueMinTon?: number;
    valueMaxTon?: number;
    state?: string;
}

export interface materialOrder {
    id?: number;
    name?: string;
}