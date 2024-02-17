import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { route } from '../models/route.model';

@Injectable()
export class RouteService {
    constructor(private http: HttpClient) { }

    getRoutes() {
        let newData: route = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiRoute}`)
        .pipe(map(data => {
            return data?.rutas?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre,
                    runningTime: item.tiempoRecorrido,
                    distanceKm: item.kilometros,
                    returnTime: item.tiempoRetorno,
                    originType: item.tipoOrigen,
                    originClient: item.clienteDepartamentoOrigen,
                    origin: item.obraMunicipioOrigen,
                    destinationType:item.tipoDestino,
                    destinationClient: item.clienteDepartamentoDestino,
                    destination: item.obraMunicipioDestino,
                    state: item.estado
                }
            })
        }));
    }

    getRoutesList() {
        let newData: route = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiRouteList}`)
        .pipe(map(data => {
            return data?.rutas?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre                
                }
            })
        }));
    }

    postRoute(request: route){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiRoute}`,
        {
            ruta: {
                nombre : request.name,
                tiempoRecorrido: request.runningTime,
                kilometros: request.distanceKm,
                tiempoRetorno: request.returnTime,
                tipoOrigen: request.originType,
                clienteDepartamentoOrigen: request.originClient,
                obraMunicipioOrigen: request.origin,
                tipoDestino: request.destinationType,
                clienteDepartamentoDestino: request.destinationClient,
                obraMunicipioDestino: request.destination,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.ruta?.id !== 0 && user.ruta?.id != null) {
                    return user.ruta; 
                }
            }));
    }

    putRoute(request: route){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiRoute}`,
        {
            ruta: {
                id: request.id,
                nombre: request.name,
                tiempoRecorrido: request.runningTime,
                kilometros: request.distanceKm,
                tiempoRetorno: request.returnTime,
                tipoOrigen: request.originType,
                clienteDepartamentoOrigen: request.originClient,
                obraMunicipioOrigen: request.origin,
                tipoDestino: request.destinationType,
                clienteDepartamentoDestino: request.destinationClient,
                obraMunicipioDestino: request.destination,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.ruta?.id !== 0 && user.ruta?.id != null) {
                    return user.ruta; 
                }
            }));
    }


}