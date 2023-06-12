export interface RestrictedDestination{
    id?: number;
    name?:string;
    description?:number;
    state?: string;
}

export interface route{
    id?: number,
    name?: string,
    originType?: string,
    originClient?: string,
    origin?: string,
    destinationType?: string,
    destinationClient?: string,
    destination?: string,
    state?: string
}

export interface routeType{
    id?: number,
    name?: string
}