import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { map } from 'rxjs';
import { ProviderBasicInfo } from '../models/provider.model';

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
}