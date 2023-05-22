import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { Vehicle, allowedMaterial } from '../models/vehicles.model';

@Injectable()
export class VehicleService {

    constructor(private http: HttpClient) { }

    getVehicle() {
        let newData: Vehicle = {};
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

    postVehicleBasic(requestBasic: Vehicle){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiVehicle}`,
        {
            vehiculo: {
                placa: requestBasic.licensePlate,
                tipo: requestBasic.type,
                modelo: requestBasic.model,
                color: requestBasic.color,
                numeroChasis: requestBasic.chassisNumber,
                pesoBruto: requestBasic.grossWeight,
                cubicado: requestBasic.cubed,
                capacidadTonelada: requestBasic.capacityTon,
                capacidadMetroCubico: requestBasic.capacityM3,
                transportador: requestBasic.transporter,
                //transportadorId:requestBasic.transporter,
                kilometroParaInspeccion:requestBasic.kilometerToInspection,
                kilometroUltimaInspeccion:requestBasic.kilometerLastInspection,
                fechaUltimaInspeccion:requestBasic.dateLastInspection,
                estado: requestBasic.state
            }
          })
            .pipe(map(user => {
                if (user.vehiculo?.id !== 0 && user.vehiculo?.id != null) {
                    return user.vehiculo; 
                }
            }));
    }

    putVehicleBasic(requestBasic: Vehicle){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiVehicle}`,
        {
            vehiculo: {
                id: requestBasic.id,
                placa: requestBasic.licensePlate,
                tipo: requestBasic.type,
                modelo: requestBasic.model,
                color: requestBasic.color,
                numeroChasis: requestBasic.chassisNumber,
                pesoBruto: requestBasic.grossWeight,
                cubicado: requestBasic.cubed,
                capacidadTonelada: requestBasic.capacityTon,
                capacidadMetroCubico: requestBasic.capacityM3,
                transportador: requestBasic.transporter,
                //transportadorId:requestBasic.transporter,
                kilometroParaInspeccion:requestBasic.kilometerToInspection,
                kilometroUltimaInspeccion:requestBasic.kilometerLastInspection,
                fechaUltimaInspeccion:requestBasic.dateLastInspection,
                estado: requestBasic.state
            }
          })
            .pipe(map(user => {
                if (user.vehiculo?.id !== 0 && user.vehiculo?.id != null) {
                    return user.vehiculo; 
                }
            }));
    }

    getVehicleMaterial(vehicleId: number) {
        let newData: allowedMaterial = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiMaterialVehicle}?VehiculoId=${vehicleId}`)
        .pipe(map(data => {
            return data?.materiales?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre,
                    state: item.estado,
                }
            })
        }));
    }

    postVehicleMaterial(request: allowedMaterial){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiLinkMaterialsVehicle}`,
        {
            materialesRelacionVehiculo: {
                vehiculoId: request.vehicleId,
                materialesId: request.materialsId
            }
          })
            .pipe(map(user => {
                if (user.materialVehiculoRelacionado !== undefined && user.materialVehiculoRelacionado != null) {
                    return user.materialVehiculoRelacionado; 
                }
            }));
    }

    putVehicleMaterial(request: allowedMaterial){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiMaterialVehicle}`,
        {
            materialVehiculo: {
                materialId: request.materialId,
                vehiculoId: request.vehicleId,
                state: request.state
            }
          })
            .pipe(map(user => {
                if (user.materialVehiculo !== undefined && user.materialVehiculo != null) {
                    return user.materialVehiculo; 
                }
            }));
    }


    
}
