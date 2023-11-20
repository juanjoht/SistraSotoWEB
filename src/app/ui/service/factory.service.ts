import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { factory } from '../models/factory.model';

@Injectable()
export class FactoryService {
    constructor(private http: HttpClient) { }

    getFactory() {
        let newData: factory = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiFactories}`)
        .pipe(map(data => {
            return data?.plantas?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    providerId: item.proveedorId,
                    name: item.nombre,
                    phone: item.telefono,
                    contactName: item.nombreContacto,
                    dept: item.departamento,
                    city:item.municipio,
                    address: item.direccion,
                    zone: item.zona,
                    email: item.correoElectronico,
                    latitude: item.latitud,
                    length: item.longitud,
                    haveSoto13System: item.tieneSistemaSotoTrece === 'Si' ? true: false,
                    workTimes : item.horariosDespacho,
                    state : item.estado
                }
            })
        }));
    }


}