import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { material, materialOrder } from '../models/material.model';

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
                    materialTypeId: item.tipoMaterialId,
                    materialType: item.tipoMaterial,
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

    getMaterialOrder(buildingId: number) {
        let newData: materialOrder = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiMaterialOrder}?ObraId=${buildingId}&Fecha=${new Date().toISOString()}`)
        .pipe(map(data => {
            return data?.materiales?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    name: item.nombre
                }
            })
        }));
    }

    getMaterialById(id: number) {
        let newData: material = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiMaterial}/id?Id=${id}`)
        .pipe(map(data => {
            let item = data?.material;
                 return newData =  {
                    id: item.id,
                    name: item.nombre,
                    materialTypeId: item.tipoMaterialId,
                    materialType: item.tipoMaterial,
                    unitMass: item.masaUnitaria,
                    valueM3: item.valorMetroCubico,
                    valueMinM3: item.valorMinimoMetroCubico,
                    valueMaxM3:item.valorMaximoMetroCubico,
                    valueTon: item.valorTonelada,
                    valueMinTon: item.valorMinimoTonelada,
                    valueMaxTon: item.valorMaximoTonelada,
                    state: item.estado
                }
        }));
    }

    postMaterial(request: material){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiMaterial}`,
        {
            material: {
                nombre: request.name,
                tipoMaterialId: request.materialTypeId,
                masaUnitaria: request.unitMass,
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
                if (user.material?.id !== 0 && user.material?.id != null) {
                    return user.material; 
                }
            }));
    }

    putMaterial(request: material){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiMaterial}`,
        {
            material: {
                id: request.id,
                nombre: request.name,
                tipoMaterialId: request.materialTypeId,
                masaUnitaria: request.unitMass,
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
                if (user.material?.id !== 0 && user.material?.id != null) {
                    return user.material; 
                }
            }));
    }


}