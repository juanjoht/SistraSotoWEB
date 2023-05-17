import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { Vehicles } from '../models/vehicles.model';

@Injectable()
export class VehicleService {

    constructor(private http: HttpClient) { }

    getVehicle() {
        let newData: Vehicles = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiVehicle}`)
        .pipe(map(data => {
            return data?.vehiculos?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    licensePlate: item.placa,
                    type: item.tipo,
                    model: item.modelo,
                    color: item.color,
                    chassisNumber: item.numeroChasis,
                    grossWeight: item.pesoBruto,
                    cubed: item.cubicado,
                    capacityTon: item.capacidadTonelada,
                    capacityM3: item.capacidadMetroCubico,
                    transporter: item.transportador,
                    kilometerToInspection: item.kilometroParaInspeccion,
                    kilometerLastInspection: item.kilometroUltimaInspeccion,
                    dateLastInspection: item.fechaUltimaInspeccion,
                    AuthCode:item.codigoAutorizacion,
                    state: item.estado,
                }
            })
        }));
    }


    
}
