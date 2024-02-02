import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { order, paginationInfo, providerOrder } from '../models/order.model';
import { preassignment } from '../models/preassignment.model';

@Injectable()
export class PreassignmentService {
    constructor(private http: HttpClient) { }
  

      removeTime(date = new Date()) {
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
      }

      formatAMPM(date: Date) {
        var hours = date.getHours();
        var minutes: any = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }


    getPreassignment(pageNumber:number, pageSize:number,sortField: any = 'Id',sortOrderAsc: any = false, filters: string) {
        let pageInf: paginationInfo = {};
        let newData: preassignment = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiPreassignment}?PageNumber=${pageNumber}&PageSize=${pageSize}&sortBy=${sortField}&sortOrderAsc=${sortOrderAsc}${filters}`)
        .pipe(map(data => {
            let preassignments =  data?.preasignaciones?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    serviceDate: this.removeTime(new Date(item.fechaServicio)),
                    originalServiceDate: new Date(item.fechaServicio),
                    serviceHour: this.formatAMPM(new Date(item.fechaServicio)),
                    buildingId: item.obraId,
                    buildingName: item.obraNombre,
                    clientName: item.clienteNombre,
                    materialId: item.materialId,
                    materialName: item.materialNombre,
                    measureUnit: item.unidadMedida,
                    amount: item.cantidad,
                    vehicleId : item.vehiculoId,
                    vehiclePlate: item.vehiculoPlaca,
                    driverId: item.conductorId,
                    driverName: item.conductorNombre,
                    factoryId: item.plantaId,
                    factoryName: item.plantaNombre,
                    rejectionReason: item.motivoRechazo,
                    orderId: item.pedidoId,
                    state: item.estado
                }
            })
            pageInf =  {
                currentPage: data?.paginationInfo?.currentPage,
                itemsPerPage: data?.paginationInfo?.itemsPerPage,
                totalItems: data?.paginationInfo?.totalItems,
                totalPages: data?.paginationInfo?.totalPages
         };
        return {
            preassignments,
            pageInf
           }
        }));
    }

    getPreassignmentByPlate(plate: string, factoryId: number,isAnticipated: boolean = false) {
        let newData: preassignment = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiPreassignmentByPlate}?Placa=${plate}&PlantaId=${factoryId}&EsCargaAnticipada=${isAnticipated}`)
        .pipe(map(data => {
            return data?.preasignaciones?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    serviceDate: this.removeTime(new Date(item.fechaServicio)),
                    originalServiceDate: new Date(item.fechaServicio),
                    serviceHour: this.formatAMPM(new Date(item.fechaServicio)),
                    buildingId: item.obraId,
                    buildingName: item.obraNombre,
                    clientName: item.clienteNombre,
                    clientId: item.clienteId,
                    materialId: item.materialId,
                    materialName: item.materialNombre,
                    measureUnit: item.unidadMedida,
                    amount: item.cantidad,
                    vehicleId : item.vehiculoId,
                    vehiclePlate: item.vehiculoPlaca,
                    driverId: item.conductorId,
                    driverName: item.conductorNombre,
                    factoryId: item.plantaId,
                    rejectionReason: item.motivoRechazo,
                    factoryEnterDoc: item.plantaIngresaDocumento,
                    buildingAllCost: item.obraTodoCosto,
                    state: item.estado,
                    allowChangesLoanPlant: item.permiteCambiosCarguePlanta
                }
            })
        }));
    }

    postPreassignment(request: preassignment){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiPreassignment}`,
        {
            preasignacion: {
                fechaServicio : request.serviceDate,
                obraId: request.buildingId,
                materialId: request.materialId,
                unidadMedida: request.measureUnit,
                cantidad: request.amount,
                vehiculoId: request.vehicleId,
                conductorId: request.driverId,
                plantaId: request.factoryId,
                motivoRechazo: request.rejectionReason,
                pedidoId: request.orderId,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.preasignacion?.id !== 0 && user.preasignacion?.id != null) {
                    return user.preasignacion; 
                }
            }));
    }

    putPreassignment(request: preassignment){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiPreassignment}`,
        {
            preasignacion: {
                id: request.id,
                fechaServicio : request.serviceDate,
                obraId: request.buildingId,
                materialId: request.materialId,
                unidadMedida: request.measureUnit,
                cantidad: request.amount,
                vehiculoId: request.vehicleId,
                conductorId: request.driverId,
                plantaId: request.factoryId,
                motivoRechazo: request.rejectionReason,
                pedidoId: request.orderId,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.preasignacion?.id !== 0 && user.preasignacion?.id != null) {
                    return user.preasignacion; 
                }
            }));
    }

    putApprove(requestIds: number[], amountApprove: number){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiPreassignmentApprove}`,
        {
            aprobarPreasignacion: {
                id: requestIds,
                cantidad: amountApprove
            }
          })
            .pipe(map(user => {
                if (user?.preasignacionAprobado !== null && user?.preasignacionAprobado !== undefined) {
                    return user.preasignacionAprobado; 
                }
            }));
    }

    putReject(Id: number, rejectReason: string){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiPreassignmentReject}`,
        {
            rechazarPreasignacion: {
                id: Id,
                motivoRechazo: rejectReason
            }
          })
            .pipe(map(user => {
                if (user?.preasignacionRechazado !== null && user?.preasignacionRechazado !== undefined) {
                    return user.preasignacionRechazado; 
                }
            }));
    }

    

    

    


}