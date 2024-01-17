import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { Driver, Vehicle, VehicleDocuments, VehiclePlate, VehicleRestrictedDestination, allowedMaterial } from '../models/vehicles.model';
import { RestrictedDestination } from '../models/route.model';

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


    getVehiclePlate() {
        let newData: VehiclePlate = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiVehiclePlate}`)
        .pipe(map(data => {
            return data?.placas?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre
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
               //transportador: requestBasic.transporter,
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
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiMaterialVehicle}`,
        {
            materialVehiculo: {
                materialId: request.materialId,
                vehiculoId: request.vehicleId,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.materialVehiculo !== undefined && user.materialVehiculo != null) {
                    return user.materialVehiculo; 
                }
            }));
    }

    getVehicleDriver(vehicleId: number) {
        let newData: Driver = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiDriverVehicle}?VehiculoId=${vehicleId}`)
        .pipe(map(data => {
            return data?.conductores?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre,
                    state: item.estado,
                }
            })
        }));
    }

    postVehicleDriver(request: Driver){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiLinkDriverVehicle}`,
        {
            conductorRelacionVehiculo: {
                vehiculoId: request.vehicleId,
                conductorId: request.id,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.conductorRelacionadoVehiculo !== undefined && user.conductorRelacionadoVehiculo != null) {
                    return user.conductorRelacionadoVehiculo; 
                }
            }));
    }

    getDriverRelated(vehicleId?: number, driverId?: number) {
        let newData: boolean = false;
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiDriverRelatedToVehicle}?ConductorId=${driverId}&VehiculoId=${vehicleId}`)
        .pipe(map(data => {
                if (data?.conductorRelacionado !== null && data?.conductorRelacionado !== undefined){
                    newData = data?.conductorRelacionado;
                }
                 return newData;
        }));
    }

    getVehicleDocs(vehicleId: number) {
        let newData: VehicleDocuments = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiDocsByVehicle}?VehiculoId=${vehicleId}`)
        .pipe(map(data => {
            return data?.documentos?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    docName: item.nombreDocumento,
                    docUrl: item.urlDocumento,
                    state: item.estado,
                    maturityDate : item.creado
                }
            })
        }));
    }

    postVehicleDoc(request: VehicleDocuments){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiVehicleDocument}`,
        {
            documentoVehiculo: {
                vehiculoId: request.vehicleId,
                documentoId: request.docId,
                estado: request.state,
                fechaVencimiento: request.maturityDate
            }
          })
            .pipe(map(client => {
                if (client?.documentoRelacionado !== undefined && client?.documentoRelacionado != null) {
                    return client.documentoRelacionado; 
                }
            }));
    }
    
    putVehicleDoc(request: VehicleDocuments){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiVehicleDocument}`,
        {
            documentoVehiculo: {
                vehiculoId: request.vehicleId,
                documentoId: request.docId,
                urlDocumento: request.docUrl,
                estado: request.state,
                fechaVencimiento: request.maturityDate
            }
          })
            .pipe(map(client => {
                if (client?.documentoRelacionActualizado !== undefined && client?.documentoRelacionActualizado != null) {
                    return client.documentoRelacionActualizado; 
                }
            }));
    }

    postUploadVehicleDoc(formData: any){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiUploadVehicleDoc}`,formData)
            .pipe(map(client => {
                if (client?.fileUrl !== '' && client?.fileUrl != null) {
                    return client.fileUrl; 
                }
            }));
    }

    
    getRestrictedDestination() {
        let newData: RestrictedDestination = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiRestrictedDestination}`)
        .pipe(map(data => {
            return data?.destinosRestringidos?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre,
                    description: item.description,
                    state: item.estado
                }
            })
        }));
    }

    getRestrictedDestinationVehicle(vehicleId : number) {
        let newData: RestrictedDestination = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiRestrictedDestinationByVehicle}?VehiculoId=${vehicleId}`)
        .pipe(map(data => {
            return data?.destinosRestringidos?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre,
                    description: item.description,
                    state: item.estado
                }
            })
        }));
    }

    postRestrictedDestinationVehicle(request: VehicleRestrictedDestination){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiLinkRestrictedDestinationVehicle}`,
        {
            destinoRestringidoRelacionVehiculo: {
                obraId: request.restrictedDestinationId,
                vehiculoId: request.vehicleId
            }
          })
            .pipe(map(client => {
                if (client?.destinoRestringidoVehiculoRelacionado !== undefined && client?.destinoRestringidoVehiculoRelacionado != null) {
                    return client.destinoRestringidoVehiculoRelacionado; 
                }
            }));
    }

    deleteRestrictedDestinationVehicle(restrictedDestinationId: number, vehicleId: number){
        return this.http.delete<any>(`${environment.urlBaseApi}${Constants.apiRestrictedDestinationByVehicle}?ObraId=${restrictedDestinationId}&VehiculoId=${vehicleId}`)
            .pipe(map(client => {
                    return (client?.destinoRestringidoVehiculoEliminado !== null || client?.destinoRestringidoVehiculoEliminado !== undefined) ? client?.destinoRestringidoVehiculoEliminado: false;
            }));
    }

    


    


    
}
