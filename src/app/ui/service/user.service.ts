import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { User, thirdParty } from '../models/user.model';


@Injectable()
export class UserService {

    constructor(private http: HttpClient) { }

    getUsers() {
        let newData: User = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiAuthUsers}`)
        .pipe(map(res => {
            return res?.usuarios?.map((item: any) =>{
                 return newData =  {
                    userId: item.id,
                    thirdPartyId: item.terceroId,
                    thirdPartyType: item.terceroTipo,
                    thirdParty: item.terceroNombre,
                    userName: item.userName,
                    name: item.nombre,
                    phone:item.telefono,
                    email: item.email,
                    profile: item.perfil,
                    factoryId: item.plantaId,
                    docNumber: item.numeroDocumento,
                    state: item.estado
                }
            })
        }));
    }   

    getAllThirdParties() {
        let newData: thirdParty = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiAllThirdParties}`)
        .pipe(map(res => {
            return res?.terceros?.map((item: any) =>{
                 return newData =  {
                    id: item.terceroId,
                    type: item.terceroTipo,
                    name: item.terceroNombre
                }
            })
        }));
    }   

    postBasic(requestBasic: User){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiAuthUsers}`,
        {
            usuario: {
                terceroId: requestBasic.thirdPartyId,
                terceroTipo: requestBasic.thirdPartyType,
                userName: requestBasic.userName,
                contrasena: requestBasic.password,
                nombre: requestBasic.name,
                telefono: requestBasic.phone,
                email: requestBasic.email,
                perfil: requestBasic.profile,
                plantaId: requestBasic.factoryId,
                codigoVerificacion: requestBasic.verificationCode,
                numeroDocumento: requestBasic.docNumber,
                estado: requestBasic.state
            }
          })
            .pipe(map(user => {
                if (user.usuario?.identificacion !== '' && user.usuario?.identificacion != null) {
                    return user.usuario; 
                }
            }));
}

putUser(requestBasic: User){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiAuthUsers}`,
    {
        usuario: {
            id: requestBasic.userId,
            terceroId: requestBasic.thirdPartyId,
            terceroTipo: requestBasic.thirdPartyType,
            userName: requestBasic.userName,
            nombre: requestBasic.name,
            telefono: requestBasic.phone,
            email: requestBasic.email,
            perfil: requestBasic.profile,
            plantaId: requestBasic.factoryId,
            codigoVerificacion: requestBasic.verificationCode,
            numeroDocumento: requestBasic.docNumber,
            estado: requestBasic.state
        }
      })
        .pipe(map(user => {
            if (user.usuario?.id !== 0 && user.usuario?.id != null) {
                return user.usuario; 
            }
        }));
}

resetPassword(username: string, password: string)
{
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiAuthResetPassword}`,
    {
        usuario: {
            nombreUsuario: username,
            contrasena: password
        }
      })
        .pipe(map(user => {
            if (user.contrasenaCambiada != null) {
                return user.contrasenaCambiada; 
            }
        }));
}

}
