import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { RateTransport } from '../models/rate-transport.model';

@Injectable()
export class RateTransportService {
    constructor(private http: HttpClient) { }

    getRates() {
        let newData: RateTransport = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiRateTransport}`)
        .pipe(map(data => {
            return data?.tarifaTransportes?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    routeId: item.rutaId,
                    routeName: item.rutaNombre,
                    valueM3: item.valorMetroCubico,
                    valueMinM3: item.valorMinimoMetroCubico,
                    valueMaxM3:item.valorMaximoMetroCubico,
                    valueTon: item.valorTonelada,
                    valueMinTon: item.valorMinimoTonelada,
                    valueMaxTon: item.valorMaximoTonelada,
                    state: item.estado
                }
            })
        }));
    }

    postRate(request: RateTransport){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiRateTransport}`,
        {
            tarifaTransporte: {
                rutaId : request.routeId,
                valorMetroCubico: request.valueM3,
                valorMinimoMetroCubico: request.valueMinM3,
                valorMaximoMetroCubico: request.valueMaxM3,
                valorTonelada: request.valueTon,
                valorMinimoTonelada: request.valueMinTon,
                valorMaximoTonelada: request.valueMaxTon,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.tarifaTransporte?.id !== 0 && user.tarifaTransporte?.id != null) {
                    return user.tarifaTransporte; 
                }
            }));
    }

    putRate(request: RateTransport){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiRateTransport}`,
        {
            tarifaTransporte: {
                id: request.id,
                rutaId : request.routeId,
                valorMetroCubico: request.valueM3,
                valorMinimoMetroCubico: request.valueMinM3,
                valorMaximoMetroCubico: request.valueMaxM3,
                valorTonelada: request.valueTon,
                valorMinimoTonelada: request.valueMinTon,
                valorMaximoTonelada: request.valueMaxTon,
                estado: request.state
            }
          })
            .pipe(map(user => {
                if (user.tarifaTransporte?.id !== 0 && user.tarifaTransporte?.id != null) {
                    return user.tarifaTransporte; 
                }
            }));
    }


}