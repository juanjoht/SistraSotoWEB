import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { Profile, ProfileModule } from '../models/profile.model';


@Injectable()
export class ProfileService {

    constructor(private http: HttpClient) { }

    getProfiles() {
        let newData: Profile = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiAuthProfiles}`)
        .pipe(map(res => {
            return res?.perfiles?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre,
                    desc:item.descripcion,
                    state: item.estado
                }
            })
        }));
    }
    
    postBasic(requestBasic: Profile){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiAuthProfiles}`,
        {
            perfil: {
                descripcion: requestBasic.desc,
                nombre: requestBasic.name,
                estado: requestBasic.state
            }
          })
            .pipe(map(user => {
                if (user.perfil?.id !== '' && user.perfil?.id != null) {
                    return user.perfil; 
                }
            }));
}

putBasic(requestBasic: Profile){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiAuthProfiles}`,
    {
        perfil: {
            id: requestBasic.id,
            descripcion: requestBasic.desc,
            nombre: requestBasic.name,
            estado: requestBasic.state
        }
      })
        .pipe(map(user => {
            if (user.perfil?.id !== 0 && user.perfil?.id != null) {
                return user.perfil; 
            }
        }));
}


deleteProfile(id: number){
    return this.http.delete<any>(`${environment.urlBaseApi}${Constants.apiAuthProfiles}?id=${id}`)
        .pipe(map(client => {
            if (client.perfilEliminado) {
                return client.perfilEliminado; 
            }
        }));
}

getProfileModules(profileId: number) {
    let newData: ProfileModule = {};
    return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiAuthProfileModule}?PerfilId=${profileId}`)
    .pipe(map(res => {
        return res?.perfilModulos?.map((item: any) =>{
             return newData =  {
                profileId: item.perfilId,
                profileName: item.perfil,
                moduleId:item.moduloId,
                module: item.modulo,
                permission: item.permiso
            }
        })
    }));
}

putProfileModule(requestBasic: ProfileModule){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiAuthProfileModulePut}`,
    {
        perfilModulo: {
            perfilId: requestBasic.profileId,
            moduloId: requestBasic.moduleId,
            permiso: requestBasic.permission
        }
      })
        .pipe(map(user => {
            if (user.perfilModulo?.moduloId !== 0 && user.perfilModulo?.moduloId != null) {
                return user.perfilModulo; 
            }
        }));
}
    
}
