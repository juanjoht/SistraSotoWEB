import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { order, providerOrder } from '../models/order.model';

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


    getOrders() {
        let newData: order = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiOrder}`)
        .pipe(map(data => {
            return data?.pedidos?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    startDate: this.removeTime(new Date(item.fechaInicial)),
                    buildingName: item.obraNombre,
                    materialName: item.materialNombre,
                    clientName: item.clienteNombre,
                    buildingId: item.obraId,
                    materialId: item.materialId,
                    monday: item.lunes,
                    tuesday:item.martes,
                    wednesday: item.miercoles,
                    thursday: item.jueves,
                    friday: item.viernes,
                    sunday:item.sabado,
                    saturday: item.domingo,
                    totalAmount: item.cantidadTotal,
                    aprobeAmount : item.cantidadAprobada,
                    state: item.estado
                }
            })
        }));
    }

    postOrder(request: order){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiOrder}`,
        {
            pedido: {
                fechaInicial : request.startDate,
                obraId: request.buildingId,
                materialId: request.materialId,
                lunes: request.monday,
                martes: request.tuesday,
                miercoles: request.wednesday,
                jueves: request.thursday,
                viernes: request.friday,
                sabado: request.saturday,
                domingo: request.sunday,
                cantidadTotal: request.totalAmount,
                cantidadAprobada: request.aprobeAmount,
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
                fechaInicial: request.startDate,
                obraId: request.buildingId,
                materialId: request.materialId,
                lunes: request.monday,
                martes: request.tuesday,
                miercoles: request.wednesday,
                jueves: request.thursday,
                viernes: request.friday,
                sabado: request.saturday,
                domingo: request.sunday,
                cantidadTotal: request.totalAmount,
                cantidadAprobada: request.aprobeAmount,
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
                id: requestIds
            },
            cantidadAprobada: amountApprove
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