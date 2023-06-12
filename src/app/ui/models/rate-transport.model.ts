export interface RateTransport{
    id?: number;
    routeId?:string;
    routeName?:string;
    valueM3?: number;
    valueMinM3?: number;
    valueMaxM3?: number;
    valueTon?: number;
    valueMinTon?: number;
    valueMaxTon?: number;
    state?: string;
}