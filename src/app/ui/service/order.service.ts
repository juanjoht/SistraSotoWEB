import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { order } from '../models/order.model';

@Injectable()
export class OrderService {
    constructor(private http: HttpClient) { }

    getOrders() {
        let newData: order = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiOrder}`)
        .pipe(map(data => {
            return data?.pedidos?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    startDate: item.fechaInicial,
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
                sabado: request.sunday,
                domingo: request.saturday,
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
                sabado: request.sunday,
                domingo: request.saturday,
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


}