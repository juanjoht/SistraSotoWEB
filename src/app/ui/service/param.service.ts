import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { paramType, params } from '../models/param.model';
import { Profile } from '../models/profile.model';

@Injectable()
export class ParamService {

    constructor(private http: HttpClient) { }

    getParamByType(type: string) {
        let newParam: params = {
            id: 0,
            type: '',
            name: '',
            expire: false
        };
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiParamsByType}?Tipo=${type}`)
        .pipe(map(data => {
            return data?.parametros?.map((item: { id: number, tipo : string, descripcion: string; expira: boolean }) =>{
                 return newParam =  {
                    id: item.id,
                    type: item.tipo,
                    name: item.descripcion,
                    expire: item.expira
                }
            })
        }));
    }

    getParams() {
        let newData: params = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiParams}`)
        .pipe(map(res => {
            return res?.parametros?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    type: item.tipo,
                    name:item.descripcion,
                    state: item.estado,
                    value1: item.valor1,
                    value2: item.valor2,
                    expire: item.expira
                }
            })
        }));
    }

    getParamTypes() {
        let newData: paramType = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiParamType}`)
        .pipe(map(res => {
            return res?.tipoParametros?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name:item.nombre,
                    state: item.estado,
                    desc: item.descripcion
                }
            })
        }));
    }


    postBasic(requestBasic: params){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiParams}`,
        {
            parametro: {
                tipo: requestBasic.type,
                descripcion: requestBasic.name,
                valor1: requestBasic.value1,
                valor2: requestBasic.value2,
                expira: requestBasic.expire,
                estado: requestBasic.state
            }
          })
            .pipe(map(user => {
                if (user.parametro?.id !== '' && user.parametro?.id != null) {
                    return user.parametro; 
                }
            }));
}

putBasic(requestBasic: params){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiParams}`,
    {
        parametro: {
            id: requestBasic.id,
            tipo: requestBasic.type,
            descripcion: requestBasic.name,
            valor1: requestBasic.value1,
            valor2: requestBasic.value2,
            expira: requestBasic.expire,
            estado: requestBasic.state
        }
      })
        .pipe(map(user => {
            if (user.parametro?.id !== 0 && user.parametro?.id != null) {
                return user.parametro; 
            }
        }));
}
    
}
