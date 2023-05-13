import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { ProviderBasicInfo, ProviderPrices } from '../models/provider.model';
import { material } from '../models/material.model';

@Injectable()
export class MaterialService {
    constructor(private http: HttpClient) { }

    getMaterial() {
        let newData: material = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiMaterial}`)
        .pipe(map(data => {
            return data?.materiales?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre,
                    unitMass: item.masaUnitaria,
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
}