import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import { CustomerBasicInfo, CustomerBuildings, CustomerCommercialInfo, CustomerShipping, CustomerTransport } from '../models/customer.model';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TransporterBasicInfo, TransporterDocuments, TransporterDriver, TransporterRoutes, TransporterVehicles, transporterShipping } from '../models/transporter.model';

@Injectable()
export class TransporterService {

    constructor(private http: HttpClient) { }

    getTransporter() {
        let newData: TransporterBasicInfo = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiTransporter}`)
        .pipe(map(data => {
            return data?.transportadores?.map((item: any) =>{
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
                    payDeadline : item.plazoPago
                }
            })
        }));
    }

    getShippingRatesByTransporter(TransporterId: number) {
        let newInfo: transporterShipping; 
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiShippingRateByTransporter}?TransportadorId=${TransporterId}`)
        .pipe(map(data => {
            return data?.tarifaFletes?.map((item: any) =>{
                 return newInfo =  {
                    id: item.id,
                    origin: item.origen,
                    destination: item.destino,
                    material: item.material,
                    measureUnit: item.unidadMedida,
                    shippingValue: item.valorFlete,
                    m3Value: item.valorMetroCubico,
                    tonValue: item.valorTonelada,
                    state: item.estado
                }
            })
        }));
    }

    getTransporterRoutes(TransporterId: number) {
        let newData: TransporterRoutes = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiRoutesByTransporter}?TransportadorId=${TransporterId}`)
        .pipe(map(data => {
            return data?.rutas?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    origin: item.origen,
                    destination: item.destino,
                    state: item.estado,
                    routeName: `${item.origen} - ${item.destino}`
                }
            })
        }));
    }

    getTransporterDocs(TransporterId: number) {
        let newData: TransporterDocuments = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiDocsByTransporter}?TransportadorId=${TransporterId}`)
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

    getTransporterVehicles(TransporterId: number) {
        let newData: TransporterVehicles = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiVehiclesByTransporter}?TransportadorId=${TransporterId}`)
        .pipe(map(data => {
            return data?.vehiculos?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    licensePlate: item.placa,
                    type: item.tipo,
                    capacityTon:item.capacidadTonelada,
                    capacityM3:  item.capacidadMetroCubico,
                    AuthCode: item.codigoAutorizacion,
                    state: item.estado
                }
            })
        }));
    }

    getTransporterDrivers(TransporterId: number) {
        let newData: TransporterDriver = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiDriversByTransporter}?TransportadorId=${TransporterId}`)
        .pipe(map(data => {
            return data?.conductores?.map((item: any) =>{
                 return newData =  {
                    id: item.id,
                    docType: item.tipoDocumento,
                    docNum: item.numeroDocumento,
                    name: item.nombre,
                    phone: item.telefono,
                    cellPhone: item.celular,
                    email: item.email,
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




    postTransporterBasic(requestTransporterBasic: TransporterBasicInfo){
            return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiTransporter}`,
            {
                transportador: {
                  tipoDocumento: requestTransporterBasic.docType,
                  numeroDocumento: requestTransporterBasic.docNumber,
                  nombre: requestTransporterBasic.name,
                  telefono: requestTransporterBasic.phone,
                  celular: requestTransporterBasic.cellPhone,
                  CorreoElectronico: requestTransporterBasic.email,
                  departamento: requestTransporterBasic.dept,
                  municipio: requestTransporterBasic.city,
                  direccion: requestTransporterBasic.address,
                  plazoPago: requestTransporterBasic.payDeadline,
                  estado: 'Activo'
                }
              })
                .pipe(map(user => {
                    if (user.transportador?.id !== 0 && user.transportador?.id != null) {
                        return user.transportador; 
                    }
                }));
    }

    putTransporterBasic(requestTransporterBasic: TransporterBasicInfo){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiTransporter}`,
        {
            transportador: {
              id: requestTransporterBasic.id,
              tipoDocumento: requestTransporterBasic.docType,
              numeroDocumento: requestTransporterBasic.docNumber,
              nombre: requestTransporterBasic.name,
              telefono: requestTransporterBasic.phone,
              celular: requestTransporterBasic.cellPhone,
              CorreoElectronico: requestTransporterBasic.email,
              departamento: requestTransporterBasic.dept,
              municipio: requestTransporterBasic.city,
              direccion: requestTransporterBasic.address,
              plazoPago: requestTransporterBasic.payDeadline,
              estado: 'Activo'
            }
          })
            .pipe(map(user => {
                if (user.transportador?.id !== 0 && user.transportador?.id != null) {
                    return user.transportador; 
                }
            }));
}

postTransporterShipping(requestCustmerShipping: CustomerShipping){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiTransporterRateShipping}`,
    {
        tarifaFleteTransportador: {
            transportadorId: requestCustmerShipping.customerId,
            origen: requestCustmerShipping.origin,
            destino: requestCustmerShipping.destination,
            material: requestCustmerShipping.material,
            valorMetroCubico: requestCustmerShipping.m3Value,
            valorTonelada: requestCustmerShipping.tonValue,
            estado: "Activo" 
        }
      })
        .pipe(map(client => {
            if (client.tarifaFlete?.id !== 0 && client.tarifaFlete?.id != null) {
                return client.tarifaFlete; 
            }
        }));
}

putTransporterShipping(requestCustmerShipping: CustomerShipping){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiTransporterRateShipping}`,
    {
        tarifaFlete: {
            id: requestCustmerShipping.id,
            origen: requestCustmerShipping.origin,
            destino: requestCustmerShipping.destination,
            material: requestCustmerShipping.material,
            valorMetroCubico: requestCustmerShipping.m3Value,
            valorTonelada: requestCustmerShipping.tonValue,
            unidadMedida: requestCustmerShipping.measureUnit,
            valorFlete: requestCustmerShipping.shippingValue,
            estado: "Activo" 
        }
      })
        .pipe(map(client => {
            if (client.tarifaFlete?.id !== 0 && client.tarifaFlete?.id != null) {
                return client.tarifaFlete; 
            }
        }));
}

postTransporterRoute(requestTransporterRoute: TransporterRoutes){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiTransporterRoute}`,
    {
        rutaTransportador: {
            transportadorId: requestTransporterRoute.transporterId,
            ruta: {
                origen: requestTransporterRoute.origin,
                destino: requestTransporterRoute.destination,
                estado: "Activo"
              }
        }
      })
        .pipe(map(client => {
            if (client.ruta?.id !== 0 && client.ruta?.id != null) {
                return client.ruta; 
            }
        }));
}

postTransporterDoc(requestTransporterRoute: TransporterDocuments){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiTransporterDocument}`,
    {
        documentoTransportador: {
            transportadorId: requestTransporterRoute.transporterId,
            documentoId: requestTransporterRoute.docId
        }
      })
        .pipe(map(client => {
            if (client.documento?.id !== 0 && client.documento?.id != null) {
                return client.documento; 
            }
        }));
}

putTransporterDoc(requestTransporterRoute: TransporterDocuments){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiTransporterDocument}`,
    {
        documentoTransportador: {
            transportadorId: requestTransporterRoute.transporterId,
            documentoId: requestTransporterRoute.docId
        }
      })
        .pipe(map(client => {
            if (client.documento?.id !== 0 && client.documento?.id != null) {
                return client.documento; 
            }
        }));
}


deleteTransporterRoute(transporterId: number){
    return this.http.delete<any>(`${environment.urlBaseApi}${Constants.apiTransporterRoute}?id=${transporterId}`)
        .pipe(map(client => {
            if (client.rutaEliminado) {
                return client.rutaEliminado; 
            }
        }));
}

postLinkTransporterVehicle(requestTransporterVehicle: TransporterVehicles){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiLinkTransporterVehicle}`,
    {
        vehiculoRelacionTransportador: {
            transportadorId: requestTransporterVehicle.transporterId,
            vehiculoId: requestTransporterVehicle.vehicleId,
        }
      })
        .pipe(map(client => {
            if (client.vehiculo?.id !== 0 && client.vehiculo?.id != null) {
                return client.vehiculo; 
            }
        }));
}

postLinkTransporterDriver(requestTransporterDriver: TransporterDriver){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiLinkTransporterDriver}`,
    {
        conductorRelacionTransportador: {
            transportadorId: requestTransporterDriver.transporterId,
            conductorId: requestTransporterDriver.driverId,
        }
      })
        .pipe(map(client => {
            if (client.conductor?.id !== 0 && client.conductor?.id != null) {
                return client.conductor; 
            }
        }));
}


    
}
