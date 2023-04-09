import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import { CustomerBasicInfo, CustomerBuildings, CustomerCommercialInfo, CustomerShipping, CustomerTransport } from '../models/customer.model';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TransporterBasicInfo, TransporterDocuments, TransporterDriver, TransporterRoutes, TransporterVehicles } from '../models/transporter.model';
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
                    capacityTon: item.capacidadTonelada,
                    capacityM3: item.capacidadMetroCubico,
                    AuthCode:item.codigoAutorizacion,
                    state: item.estado,
                }
            })
        }));
    }


    
}
