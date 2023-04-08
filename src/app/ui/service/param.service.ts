import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { params } from '../models/param.model';

@Injectable()
export class ParamService {

    constructor(private http: HttpClient) { }

    getParamByType(type: string) {
        let newParam: params = {
            id: '',
            type: '',
            name: ''
        };
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiParamsByType}?Tipo=${type}`)
        .pipe(map(data => {
            return data?.parametros?.map((item: { id: string, tipo : string, descripcion: string; }) =>{
                 return newParam =  {
                    id: item.id,
                    type: item.tipo,
                    name: item.descripcion
                }
            })
        }));
    }
    
}
