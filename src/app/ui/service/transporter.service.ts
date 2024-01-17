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
        let newInfo: CustomerShipping; 
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiShippingRateByTransporter}/transportador?TransportadorId=${TransporterId}`)
        .pipe(map(data => {
            return data?.transportadorTarifaFletes?.map((item: any) =>{
                 return newInfo =  {
                    id: item.id,
                    routeId: item.rutaId,
                    route: item.rutaNombre,
                    material: item.tipoMaterialNombre,
                    materialId: item.tipoMaterialId,
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
                    route: item.origen,
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
                    maturityDate : item.creado
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
                  estado: requestTransporterBasic.state
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
              estado: requestTransporterBasic.state
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
        transportadorTarifaFlete: {
            transportadorId: requestCustmerShipping.customerId,
            rutaId: requestCustmerShipping.routeId,
            tipoMaterialId: requestCustmerShipping.materialId,
            valorMetroCubico: requestCustmerShipping.m3Value,
            valorTonelada: requestCustmerShipping.tonValue,
            estado: requestCustmerShipping.state
        }
      })
        .pipe(map(client => {
            if (client.transportadorTarifaFlete?.id !== 0 && client.transportadorTarifaFlete?.id != null) {
                return client.transportadorTarifaFlete; 
            }
        }));
}

putTransporterShipping(requestCustmerShipping: CustomerShipping, transporterId: number){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiTransporterRateShipping}`,
    {
        transportadorTarifaFlete: {
            id: requestCustmerShipping.id,
            transportadorId:transporterId,
            rutaId: requestCustmerShipping.routeId,
            tipoMaterialId: requestCustmerShipping.materialId,
            valorMetroCubico: requestCustmerShipping.m3Value,
            valorTonelada: requestCustmerShipping.tonValue,
            estado: requestCustmerShipping.state
        }
      })
        .pipe(map(client => {
            if (client.transportadorTarifaFlete?.id !== 0 && client.transportadorTarifaFlete?.id != null) {
                return client.transportadorTarifaFlete; 
            }
        }));
}

postTransporterRoute(requestTransporterRoute: TransporterRoutes){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiTransporterRoute}`,
    {
        rutaTransportador: {
            transportadorId: requestTransporterRoute.transporterId,
            estado: "Activo",
            rutaId: requestTransporterRoute.routeId,
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
            documentoId: requestTransporterRoute.docId,
            estado: requestTransporterRoute.state
        }
      })
        .pipe(map(client => {
            if (client.documento?.id !== 0 && client.documento?.id != null) {
                return client.documento; 
            }
        }));
}

putTransporterDoc(requestTransporterDoc: TransporterDocuments){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiTransporterDocument}`,
    {
        documentoTransportador: {
            transportadorId: requestTransporterDoc.transporterId,
            documentoId: requestTransporterDoc.docId,
            urlDocumento: requestTransporterDoc.docUrl,
            estado: requestTransporterDoc.state
        }
      })
        .pipe(map(client => {
            if (client.documento?.id !== 0 && client.documento?.id != null) {
                return client.documento; 
            }
        }));
}


deleteTransporterRoute(routeId: number, transporterId: number){
    return this.http.delete<any>(`${environment.urlBaseApi}${Constants.apiTransporterRoute}?RutaId=${routeId}&TransportadorId=${transporterId}`)
        .pipe(map(client => {
            if (client.rutaTransportadorEliminado) {
                return client.rutaTransportadorEliminado; 
            }
        }));
}

postLinkTransporterVehicle(requestTransporterVehicle: TransporterVehicles){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiLinkTransporterVehicle}`,
    {
        transportadorRelacionVehiculo: {
            transportadorId: requestTransporterVehicle.transporterId,
            vehiculoId: requestTransporterVehicle.vehicleId,
        }
      })
        .pipe(map(client => {
                return (client?.vehiculoTransportador !== undefined && client?.vehiculoTransportador !== null) ? client.vehiculoTransportador: false; 
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

postUploadTransporterDoc(formData: any){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiUploadTransporterDoc}`,formData)
        .pipe(map(client => {
            if (client?.fileUrl !== '' && client?.fileUrl != null) {
                return client.fileUrl; 
            }
        }));
}

sendVehicleCode(requestTransporterVehicle: TransporterVehicles){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiSendVehicleCode}`, {
        generarCodigoVerificacion: {
            transportadorId: requestTransporterVehicle.transporterId,
            vehiculoId: requestTransporterVehicle.vehicleId
        }
      })
        .pipe(map(client => {
                return (client?.codigoVerificacionGenerado !== null || client?.codigoVerificacionGenerado !== undefined) ? client?.codigoVerificacionGenerado: false;
        }));
}

postAuthorizeVehile(requestTransporterVehicle: TransporterVehicles){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiAuthorizeVehicle}`, {
        autorizarVehiculo: {
            transportadorId: requestTransporterVehicle.transporterId,
            vehiculoId: requestTransporterVehicle.vehicleId,
            codigoAutorizacion: requestTransporterVehicle.AuthCode
        }
      })
        .pipe(map(client => {
                return (client?.vehiculoAutorizado !== null || client?.vehiculoAutorizado !== undefined) ? client?.vehiculoAutorizado: false;
        }));
}

deleteTransporterVehicle(transporterId: number, vehicleId: number){
    return this.http.delete<any>(`${environment.urlBaseApi}${Constants.apiDeleteTransporterVehicle}?TransportadorId=${transporterId}&VehiculoId=${vehicleId}`)
        .pipe(map(client => {
                return (client?.transportadorVehiculoEliminado !== null || client?.transportadorVehiculoEliminado !== undefined) ? client?.transportadorVehiculoEliminado: false;
        }));
}




    
}
