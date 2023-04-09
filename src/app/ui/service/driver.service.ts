import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import { CustomerBasicInfo, CustomerBuildings, CustomerCommercialInfo, CustomerShipping, CustomerTransport } from '../models/customer.model';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TransporterBasicInfo, TransporterDocuments, TransporterDriver, TransporterRoutes, TransporterVehicles } from '../models/transporter.model';
import { DriverDocument, DriverGeneralInfo, DriverInfo } from '../models/driver.model';

@Injectable()
export class DriverService {

    constructor(private http: HttpClient) { }

    getDrivers() {
        let newData: DriverInfo = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiDriver}`)
        .pipe(map(data => {
            return data?.conductores?.map((item: any) =>{
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
                    urlUserImg: item.urlImagenUsuario,
                    bloodType: item.tipoSangre,
                    restTime: item.tiempoDescanso,
                    contact: item.personaContacto,
                    phoneContact: item.telefonoPersonaContacto,
                    comments: item.observaciones,
                    state: item.estado
                }
            })
        }));
    }

    getDriverDocs(driverId: number) {
        let newData: DriverDocument = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiDocsByDriver}?ConductorId=${driverId}`)
        .pipe(map(data => {
            return data?.documentos?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    docName: item.nombreDocumento,
                    docUrl: item.urlDocumento,
                    state: item.estado,
                    maturityDate : item.fechaVencimiento
                }
            })
        }));
    }

    postDriverBasic(requestDriverBasic: DriverInfo){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiDriver}`,
        {
            conductor: {
              tipoDocumento: requestDriverBasic.docType,
              numeroDocumento: requestDriverBasic.docNumber,
              nombre: requestDriverBasic.name,
              telefono: requestDriverBasic.phone,
              celular: requestDriverBasic.cellPhone,
              CorreoElectronico: requestDriverBasic.email,
              departamento: requestDriverBasic.dept,
              municipio: requestDriverBasic.city,
              direccion: requestDriverBasic.address,
              urlImagen: requestDriverBasic.urlUserImg,
              estado: requestDriverBasic.state
            }
          })
            .pipe(map(user => {
                if (user.conductor?.id !== 0 && user.conductor?.id != null) {
                    return user.conductor; 
                }
            }));
}

putDriverBasic(requestDriverBasic: DriverInfo){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiDriver}`,
    {
        transportador: {
            id: requestDriverBasic.id,
            tipoDocumento: requestDriverBasic.docType,
            numeroDocumento: requestDriverBasic.docNumber,
            nombre: requestDriverBasic.name,
            telefono: requestDriverBasic.phone,
            celular: requestDriverBasic.cellPhone,
            CorreoElectronico: requestDriverBasic.email,
            departamento: requestDriverBasic.dept,
            municipio: requestDriverBasic.city,
            direccion: requestDriverBasic.address,
            urlImagen: requestDriverBasic.urlUserImg,
            estado: requestDriverBasic.state
        }
      })
        .pipe(map(user => {
            if (user.conductor?.id !== 0 && user.conductor?.id != null) {
                return user.conductor; 
            }
        }));
}

postDriverGeneralInfo(requestDriverGeneral: DriverGeneralInfo){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiDriverGeneralInfo}`,
    {
        conductorInfoGeneral: {
          tipoSangre: requestDriverGeneral.bloodType,
          tiempoDescanso: requestDriverGeneral.restTime,
          personaContacto: requestDriverGeneral.contact,
          telefonoPersonaContacto: requestDriverGeneral.phoneContact,
          observaciones: requestDriverGeneral.comments
        }
      })
        .pipe(map(user => {
            if (user.conductor?.id !== 0 && user.conductor?.id != null) {
                return user.conductor; 
            }
        }));
}


putDriverGeneralInfo(requestDriverGeneral: DriverGeneralInfo){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiDriverGeneralInfo}`,
    {
        conductorInfoGeneral: {
            conductorId: requestDriverGeneral.driverId,
            tipoSangre: requestDriverGeneral.bloodType,
            tiempoDescanso: requestDriverGeneral.restTime,
            personaContacto: requestDriverGeneral.contact,
            telefonoPersonaContacto: requestDriverGeneral.phoneContact,
            observaciones: requestDriverGeneral.comments
        }
      })
        .pipe(map(user => {
            if (user.conductor?.id !== 0 && user.conductor?.id != null) {
                return user.conductor; 
            }
        }));
}

postDriverDoc(requestDriverDoc: DriverDocument){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiDriverDocument}`,
    {
        documentoConductor: {
            conductorId: requestDriverDoc.driverId,
            documentoId: requestDriverDoc.docId
        }
      })
        .pipe(map(client => {
            if (client.documento?.id !== 0 && client.documento?.id != null) {
                return client.documento; 
            }
        }));
}


    

    
}