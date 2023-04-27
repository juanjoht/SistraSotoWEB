export interface Profile{
    id?:number;
    name?: string;
    desc?: string;
    state?:string;
}

export interface ProfileModule{
    profileId?:number;
    profileName?: string;
    moduleId?: string;
    module?:string;
    permission?:boolean
}

