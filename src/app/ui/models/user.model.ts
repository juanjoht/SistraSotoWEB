export interface User{
    userId?:number;
    thirdPartyId?: string;
    thirdPartyType?: string;
    thirdParty?: string;
    userName?: string;
    password?: string;
    name?: string;
    docNumber?:string;
    phone?: string;
    email?: string;
    profile?: string;
    verificationCode?: string;
    factoryId?: number;
    state?:string;
}

export interface thirdParty{    
    id?: string;
    type?: string;
    name?: string;
}