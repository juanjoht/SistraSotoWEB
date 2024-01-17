import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { order, paginationInfo, providerOrder } from '../models/order.model';

@Injectable()
export class OrderService {
    constructor(private http: HttpClient) { }
  

      removeTime(date = new Date()) {
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
      }


    getOrders(pageNumber:number, pageSize:number,sortField: any = 'Id',sortOrderAsc: any = false, filters: string) {
        let newData: order = {};
        let pageInf: paginationInfo = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiOrder}?PageNumber=${pageNumber}&PageSize=${pageSize}&sortBy=${sortField}&sortOrderAsc=${sortOrderAsc}${filters}`)
        .pipe(map(data => {
            let orders =  data?.pedidos?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    startDate: this.removeTime(new Date(item.fecha)),
                    factoryId: item.plantaId,
                    factoryName: item.plantaNombre,
                    buildingId: item.obraId,
                    buildingName: item.obraNombre,
                    clientName: item.clienteNombre,
                    materialId: item.materialId,
                    materialName: item.materialNombre,
                    aut: item.automatico ? 'Si': 'No',
                    UnitMeasure: item.unidadMedida,
                    requestAmount: item.cantidadPedida,
                    aprobeAmount : item.cantidadAprobada,
                    deliveredAmount: item.cantidadDespachada,
                    state: item.estado
                }
            });
            pageInf =  {
                    currentPage: data?.paginationInfo?.currentPage,
                    itemsPerPage: data?.paginationInfo?.itemsPerPage,
                    totalItems: data?.paginationInfo?.totalItems,
                    totalPages: data?.paginationInfo?.totalPages
             };
            return {
                orders,
                pageInf
               }
        }));
    }

    postOrder(request: order){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiOrder}`,
        {
            pedido: {
                Fecha : request.startDate,
                PlantaId: request.factoryId,
                ObraId: request.buildingId,
                MaterialId: request.materialId,
                Automatico: request.automatic,
                UnidadMedida: request.UnitMeasure,
                Dias:{
                    Lunes: request.monday,
                    Martes: request.tuesday,
                    Miercoles: request.wednesday,
                    Jueves: request.thursday,
                    Viernes: request.friday,
                    Sabado: request.saturday,
                    Domingo: request.sunday
                },
                CantidadTotal: request.totalAmount,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.pedido?.id !== 0 && user.pedido?.id != null) {
                    return user.pedido; 
                }
            }));
    }

    putOrder(request: order){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiOrder}`,
        {
            pedido: {
                id: request.id,
                fecha: request.startDate,
                plantaId:request.factoryId,
                obraId: request.buildingId,
                materialId: request.materialId,
                automatico: request.automatic,
                unidadMedida: request.UnitMeasure,
                cantidadPedida: request.totalAmount,
                cantidadAprobada: request.aprobeAmount,
                cantidadDespachada: request.deliveredAmount,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.pedido?.id !== 0 && user.pedido?.id != null) {
                    return user.pedido; 
                }
            }));
    }

    putApprove(requestIds: number[], amountApprove: number){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiOrderApprove}`,
        {
            aprobarPedido: {
                id: requestIds,
                cantidadAprobada: amountApprove
            }   
          })
            .pipe(map(user => {
                if (user?.pedidoAprobado !== null && user?.pedidoAprobado !== undefined) {
                    return user.pedidoAprobado; 
                }
            }));
    }

    getProviderOrders() {
        let newData: providerOrder = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiProviderOrder}`)
        .pipe(map(data => {
            return data?.pedidoProveedores?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    shipmentDate: this.removeTime(new Date(item.fechaDespacho)),
                    providerId: item.proveedorId,
                    providerName: item.proveedorNombre,
                    buildingId: item.obraId,
                    buildingName: item.obraNombre,
                    clientName: item.clienteNombre,
                    materialId: item.materialId,
                    materialName: item.materialNombre,
                    amount: item.cantidad,
                    state: item.estado
                }
            })
        }));
    }

    postProviderOrder(request: providerOrder){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiProviderOrder}`,
        {
            pedidoProveedor: {
                fechaDespacho : request.shipmentDate,
                proveedorId: request.providerId,
                obraId: request.buildingId,
                materialId: request.materialId,
                cantidad: request.amount,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.pedidoProveedor?.id !== 0 && user.pedidoProveedor?.id != null) {
                    return user.pedidoProveedor; 
                }
            }));
    }

    putProviderOrder(request: providerOrder){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiProviderOrder}`,
        {
            pedidoProveedor: {
                id: request.id,
                fechaDespacho : request.shipmentDate,
                proveedorId: request.providerId,
                obraId: request.buildingId,
                materialId: request.materialId,
                cantidad: request.amount,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.pedidoProveedor?.id !== 0 && user.pedidoProveedor?.id != null) {
                    return user.pedidoProveedor; 
                }
            }));
    }

    getSchedulesData() {
        return [
            {
                id: '1000',
                day: 'Lunes',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1001',
                day: 'Martes',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1002',
                day: 'Miércoles',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1003',
                day: 'Jueves',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1004',
                day: 'Viernes',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1005',
                day: 'Sábado',
                receive: 'No',
                schedule: ''
            },
            {
                id: '1006',
                day: 'Domingo',
                receive: 'No',
                schedule: ''
            }
        ];
    }



}