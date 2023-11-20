import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { ProviderBasicInfo, ProviderFactories, ProviderPrices, ProviderTimes } from '../models/provider.model';

@Injectable()
export class ProviderService {
    constructor(private http: HttpClient) { }

    getProvider() {
        let newData: ProviderBasicInfo = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiProvider}`)
        .pipe(map(data => {
            return data?.proveedores?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    docType: item.tipoDocumento,
                    docNumber: item.numeroDocumento,
                    name: item.nombre,
                    phone: item.telefono,
                    cellPhone:item.celular,
                    email: item.correoElectronico,
                    dept: item.departamento,
                    city: item.municipio,
                    address: item.direccion,
                    state: item.estado,
                    waitingTime : item.tiempoEsperaCargue
                }
            })
        }));
    }

    getProviderPrices(providerId: number) {
        let newData: ProviderPrices = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiProviderPrices}/proveedorId?ProveedorId=${providerId}`)
        .pipe(map(data => {
            return data?.preciosMaterialesProveedor?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    providerId: item.proveedorId,
                    materialId: item.materialId,
                    material: item.material,
                    valueM3: item.valorMetroCubico,
                    valueTon: item.valorTonelada,
                    state:item.estado
                }
            })
        }));
    }

    getProviderTimes(providerId: number) {
        let newData: ProviderTimes = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiProviderTimes}/proveedorId?ProveedorId=${providerId}`)
        .pipe(map(data => {
            return data?.plantas?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    providerId: item.proveedorId,
                    material: item.material,
                    simple: item.sencillo,
                    double: item.doble,
                    tractor: item.tractomula,
                    state:item.estado
                }
            })
        }));
    }

    getProviderFactories(providerId: number) {
        let newData: ProviderFactories = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiProviderFactories}?ProveedorId=${providerId}`)
        .pipe(map(data => {
            return data?.plantas?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    providerId: item.proveedorId,
                    name: item.nombre,
                    phone: item.telefono,
                    contactName: item.nombreContacto,
                    dept: item.departamento,
                    city:item.municipio,
                    address: item.direccion,
                    zone: item.zona,
                    email: item.correoElectronico,
                    latitude: item.latitud,
                    length: item.longitud,
                    haveSoto13System: item.tieneSistemaSotoTrece === 'Si' ? true: false,
                    enterDoc: item.ingresaDocumento === 'Si' ? true: false,
                    workTimes : item.horariosDespacho,
                    state : item.estado
                }
            })
        }));
    }



    postProviderBasic(requestProveedorBasic: ProviderBasicInfo){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiProvider}`,
        {
            proveedor: {
              tipoDocumento: requestProveedorBasic.docType,
              numeroDocumento: requestProveedorBasic.docNumber,
              nombre: requestProveedorBasic.name,
              telefono: requestProveedorBasic.phone,
              celular: requestProveedorBasic.cellPhone,
              CorreoElectronico: requestProveedorBasic.email,
              departamento: requestProveedorBasic.dept,
              municipio: requestProveedorBasic.city,
              direccion: requestProveedorBasic.address,
              tiempoEsperaCargue: requestProveedorBasic.waitingTime?.toString(),
              estado: requestProveedorBasic.state
            }
          })
            .pipe(map(user => {
                if (user.proveedor?.id !== 0 && user.proveedor?.id != null) {
                    return user.proveedor; 
                }
            }));
}

putProviderBasic(requestProveedorBasic: ProviderBasicInfo){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiProvider}`,
    {
        proveedor: {
          id: requestProveedorBasic.id,
          tipoDocumento: requestProveedorBasic.docType,
          numeroDocumento: requestProveedorBasic.docNumber,
          nombre: requestProveedorBasic.name,
          telefono: requestProveedorBasic.phone,
          celular: requestProveedorBasic.cellPhone,
          CorreoElectronico: requestProveedorBasic.email,
          departamento: requestProveedorBasic.dept,
          municipio: requestProveedorBasic.city,
          direccion: requestProveedorBasic.address,
          tiempoEsperaCargue: requestProveedorBasic.waitingTime?.toString(),
          estado: requestProveedorBasic.state
        }
      })
        .pipe(map(user => {
            if (user.proveedor?.id !== 0 && user.proveedor?.id != null) {
                return user.proveedor; 
            }
        }));
}

postProviderPrice(requestProveedorPrice: ProviderPrices){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiProviderPrices}`,
    {
        precioMaterialProveedor: {
            proveedorId: requestProveedorPrice.providerId,
            materialId: requestProveedorPrice.materialId,
            valorMetroCubico: requestProveedorPrice.valueM3,
            valorTonelada: requestProveedorPrice.valueTon,
            estado: requestProveedorPrice.state
        }
      })
        .pipe(map(user => {
            if (user.precioMaterialProveedor?.id !== 0 && user.precioMaterialProveedor?.id != null) {
                return user.precioMaterialProveedor; 
            }
        }));
}

putProviderPrice(requestProveedorPrice: ProviderPrices){
return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiProviderPrices}`,
{
    precioMaterialProveedor: {
      id: requestProveedorPrice.id,
      proveedorId: requestProveedorPrice.providerId,
      materialId: requestProveedorPrice.materialId,
      valorMetroCubico: requestProveedorPrice.valueM3,
      valorTonelada: requestProveedorPrice.valueTon,
      estado: requestProveedorPrice.state
    }
  })
    .pipe(map(user => {
        if (user.precioMaterialProveedor?.id !== 0 && user.precioMaterialProveedor?.id != null) {
            return user.precioMaterialProveedor; 
        }
    }));
}

postProviderTime(requestProveedorTime: ProviderTimes){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiProviderTimes}`,
    {
        tiempoCargueProveedor: {
            proveedorId: requestProveedorTime.providerId,
            material: requestProveedorTime.material,
            sencillo: requestProveedorTime.simple,
            doble: requestProveedorTime.double,
            tractomula: requestProveedorTime.tractor,
            estado: requestProveedorTime.state
        }
      })
        .pipe(map(user => {
            if (user.tiempoCargueProveedor?.id !== 0 && user.tiempoCargueProveedor?.id != null) {
                return user.tiempoCargueProveedor; 
            }
        }));
}

putProviderTime(requestProveedorTime: ProviderTimes){
return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiProviderTimes}`,
{
    tiempoCargueProveedor: {
      id: requestProveedorTime.id,
      proveedorId: requestProveedorTime.providerId,
      material: requestProveedorTime.material,
      sencillo: requestProveedorTime.simple,
      doble: requestProveedorTime.double,
      tractomula: requestProveedorTime.tractor,
      estado: requestProveedorTime.state
    }
  })
    .pipe(map(user => {
        if (user.tiempoCargueProveedor?.id !== 0 && user.tiempoCargueProveedor?.id != null) {
            return user.tiempoCargueProveedor; 
        }
    }));
}

postProviderFactory(requestProviderFactory: ProviderFactories){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiFactories}`,
    {
        planta: {
            proveedorId: requestProviderFactory.providerId,
            nombre: requestProviderFactory.name,
            telefono: requestProviderFactory.phone,
            nombreContacto: requestProviderFactory.contactName,
            departamento: requestProviderFactory.dept,
            municipio: requestProviderFactory.city,
            zona: requestProviderFactory.zone,
            direccion: requestProviderFactory.address,
            correoElectronico: requestProviderFactory.email,
            latitud: requestProviderFactory.latitude,
            longitud: requestProviderFactory.length,
            tieneSistemaSotoTrece: requestProviderFactory.haveSoto13System,
            ingresaDocumento:  requestProviderFactory.enterDoc,
            horariosDespacho: requestProviderFactory.workTimes,
            estado: requestProviderFactory.state     
        }
      })
        .pipe(map(client => {
            if (client.planta?.id !== 0 && client.planta?.id != null) {
                return client.planta; 
            }
        }));
}

putProviderFactory(requestProviderFactory: ProviderFactories){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiFactories}`,
    {
        planta: {
            id: requestProviderFactory.id,
            proveedorId: requestProviderFactory.providerId,
            nombre: requestProviderFactory.name,
            telefono: requestProviderFactory.phone,
            nombreContacto: requestProviderFactory.contactName,
            departamento: requestProviderFactory.dept,
            municipio: requestProviderFactory.city,
            zona: requestProviderFactory.zone,
            direccion: requestProviderFactory.address,
            correoElectronico: requestProviderFactory.email,
            latitud: requestProviderFactory.latitude,
            longitud: requestProviderFactory.length,
            tieneSistemaSotoTrece: requestProviderFactory.haveSoto13System,
            ingresaDocumento:  requestProviderFactory.enterDoc,
            horariosDespacho: requestProviderFactory.workTimes,
            estado: requestProviderFactory.state     
        }
      })
        .pipe(map(client => {
            if (client.planta?.id !== 0 && client.planta?.id != null) {
                return client.planta; 
            }
        }));
}

}