import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import { CustomerBasicInfo, CustomerBuildings, CustomerCommercialInfo, CustomerShipping, CustomerTransport } from '../models/customer.model';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable()
export class CustomerService {

    constructor(private http: HttpClient) { }

    getCustomerBasic() {
        let newCustomerBasic: CustomerBasicInfo = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiCustomer}`)
        .pipe(map(data => {
            return data?.clientes?.map((item: any) =>{
                 return newCustomerBasic =  {
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
                    state: item.estado
                }
            })
        }));
    }

    getCommercialInfoByClient(clientId: number) {
        let newCommerciaInfo: CustomerCommercialInfo; 
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiCustomerCommercialInfo}?ClienteId=${clientId}`)
        .pipe(map(item => {
                 return newCommerciaInfo =  {
                    id: item.informacionComercial.id,
                    priorityGroup: item.informacionComercial.grupoPrioridad,
                    customerType: item.informacionComercial.tipoCliente,
                    iva: item.informacionComercial.iva,
                    assignedQuota: item.informacionComercial.cupoAsignado,
                    usedQuota: item.informacionComercial.cupoUtilizado,
                    availableQuota: item.informacionComercial.cupoDisponible,
                    maturityDays: item.informacionComercial.diasVencimiento,
                    additionalDays: item.informacionComercial.diasAdicionales,
                    delayDays: item.informacionComercial.diasMora,
                    intermediationPercentage: item.informacionComercial.porcentajeIntermediacion,
                    measureUnit: item.informacionComercial.unidadMedida
                }
        }));
    }

    getBuildingsByClient(clientId: number) {
        let newCommerciaInfo: CustomerBuildings; 
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiCustomerBuilding}?ClienteId=${clientId}`)
        .pipe(map(data => {
            return data?.obras?.map((item: any) =>{
                 return newCommerciaInfo =  {
                    id: item.id,
                    customerId: item.clienteId,
                    name: item.nombre,
                    phone: item.telefono,
                    contactName: item.nombreContacto,
                    dept: item.departamento,
                    city:item.municipio,
                    address: item.direccion,
                    email: item.correoElectronico,
                    scale: item.bascula === 'Si' ? true: false,
                    latitude: item.latitud,
                    length: item.longitud,
                    isAdminBySoto13: item.administraSotoTrece === 'Si' ? true: false,
                    queueWaitingTime: item.tiempoEsperaCola,
                    tolerancePercentage: item.porcentajeTolerancia,
                    deliveryConfirmation: item.confirmacionEntrega,
                    receptionTimes : item.horariosRecepcion,
                    allowedVehicleTypes: item.tipoVehiculoPermitido,
                    simpleLoadingTime: parseInt((item.tiempoDescargue as string)?.split(';')[0]?.split(':')[1]),
                    doubleLoadingTime: parseInt((item.tiempoDescargue as string)?.split(';')[1]?.split(':')[1]),
                    truckLoadingTime: parseInt((item.tiempoDescargue as string)?.split(';')[2]?.split(':')[1]),
                    state : item.estado
                }
            })
        }));
    }

    getTransportersByClient(clientId: number) {
        let newInfo: CustomerTransport; 
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiTransportersByClient}?ClienteId=${clientId}`)
        .pipe(map(data => {
            return data?.transportadores?.map((item: any) =>{
                 return newInfo =  {
                    transportId: item.id,
                    transportName: item.nombre,
                    status: item.estado
                }
            })
        }));
    }

    getShippingRatesByThirdParty(clientId: number) {
        let newInfo: CustomerShipping; 
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiShippingRateByClient}?ClienteId=${clientId}`)
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

    getThirdParty(docNumber: number) {
        let newBasic: CustomerBasicInfo = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiThirdParty}?NumeroDocumento=${docNumber}`)
        .pipe(map(data => {
                let thirdPartyData = data?.terceroInfoPersonal;
                if(thirdPartyData !== null)
                {
                    newBasic.id= thirdPartyData.id;
                    newBasic.docType= thirdPartyData.tipoDocumento;
                    newBasic.docNumber= thirdPartyData.numeroDocumento;
                    newBasic.name= thirdPartyData.nombre;
                    newBasic.phone= thirdPartyData.telefono;
                    newBasic.cellPhone=thirdPartyData.celular;
                    newBasic.email= thirdPartyData.correoElectronico;
                    newBasic.dept= thirdPartyData.departamento;
                    newBasic.city= thirdPartyData.municipio;
                    newBasic.address= thirdPartyData.direccion;
                    newBasic.state= thirdPartyData.estado;
                    newBasic.payDeadline= thirdPartyData.plazoPago;
                    newBasic.thirdParty = thirdPartyData.tercero;
                }
                return newBasic;
        }));
    }


    postCustomerBasic(requestCustmerBasic: CustomerBasicInfo){
            return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiCustomer}`,
            {
                cliente: {
                  tipoDocumento: requestCustmerBasic.docType,
                  numeroDocumento: requestCustmerBasic.docNumber,
                  nombre: requestCustmerBasic.name,
                  telefono: requestCustmerBasic.phone,
                  celular: requestCustmerBasic.cellPhone,
                  CorreoElectronico: requestCustmerBasic.email,
                  departamento: requestCustmerBasic.dept,
                  municipio: requestCustmerBasic.city,
                  direccion: requestCustmerBasic.address,
                  estado: requestCustmerBasic.state
                }
              })
                .pipe(map(user => {
                    if (user.cliente?.id !== 0 && user.cliente?.id != null) {
                        return user.cliente; 
                    }
                }));
    }

    putCustomerBasic(requestCustmerBasic: CustomerBasicInfo){
        return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiCustomer}`,
        {
            cliente: {
              id: requestCustmerBasic.id,
              tipoDocumento: requestCustmerBasic.docType,
              numeroDocumento: requestCustmerBasic.docNumber,
              nombre: requestCustmerBasic.name,
              telefono: requestCustmerBasic.phone,
              celular: requestCustmerBasic.cellPhone,
              CorreoElectronico: requestCustmerBasic.email,
              departamento: requestCustmerBasic.dept,
              municipio: requestCustmerBasic.city,
              direccion: requestCustmerBasic.address,
              estado: requestCustmerBasic.state
            }
          })
            .pipe(map(user => {
                if (user.cliente?.id !== 0 && user.cliente?.id != null) {
                    return user.cliente; 
                }
            }));
}

putThirdParty(requestCustmerBasic: any){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiThirdPartyPersonalInfo}`,
    {
        terceroInfoPersonal: {
          id: requestCustmerBasic.id,
          tipoDocumento: requestCustmerBasic.docType,
          numeroDocumento: requestCustmerBasic.docNumber,
          nombre: requestCustmerBasic.name,
          telefono: requestCustmerBasic.phone,
          celular: requestCustmerBasic.cellPhone,
          CorreoElectronico: requestCustmerBasic.email,
          departamento: requestCustmerBasic.dept,
          municipio: requestCustmerBasic.city,
          direccion: requestCustmerBasic.address,
          plazoPago: requestCustmerBasic.payDeadline
        }
      })
        .pipe(map(user => {
            if (user.terceroInfoPersonal?.id !== 0 && user.terceroInfoPersonal?.id != null) {
                return user.terceroInfoPersonal; 
            }
        }));
}

    postCustomerCommercial(requestCustmerCommercial: CustomerCommercialInfo){
        return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiCustomerCommercialInfo}`,
        {
            informacionComercial: {
              clienteId: requestCustmerCommercial.customerId,
              GrupoPrioridad: requestCustmerCommercial.priorityGroup,
              TipoCliente: requestCustmerCommercial.customerType,
              IVA: requestCustmerCommercial.iva,
              CupoAsignado: requestCustmerCommercial.assignedQuota,
              CupoUtilizado: requestCustmerCommercial.usedQuota,
              CupoDisponible: requestCustmerCommercial.availableQuota,
              DiasVencimiento: requestCustmerCommercial.maturityDays,
              diasAdicionales:requestCustmerCommercial.additionalDays,
              DiasMora: requestCustmerCommercial.delayDays,
              PorcentajeIntermediacion: requestCustmerCommercial.intermediationPercentage,
              UnidadMedida: requestCustmerCommercial.measureUnit
            }
          })
            .pipe(map(client => {
                if (client.informacionComercial?.id !== 0 && client.informacionComercial?.id != null) {
                    return client.informacionComercial; 
                }
            }));
}

putCustomerCommercial(requestCustmerCommercial: CustomerCommercialInfo){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiCustomerCommercialInfo}`,
    {
        informacionComercial: {
          id: requestCustmerCommercial.id,
          clienteId: requestCustmerCommercial.customerId,
          GrupoPrioridad: requestCustmerCommercial.priorityGroup,
          TipoCliente: requestCustmerCommercial.customerType,
          IVA: requestCustmerCommercial.iva,
          CupoAsignado: requestCustmerCommercial.assignedQuota,
          CupoUtilizado: requestCustmerCommercial.usedQuota,
          DiasVencimiento: requestCustmerCommercial.maturityDays,
          diasAdicionales:requestCustmerCommercial.additionalDays,
          DiasMora: requestCustmerCommercial.delayDays,
          PorcentajeIntermediacion: requestCustmerCommercial.intermediationPercentage,
          UnidadMedida: requestCustmerCommercial.measureUnit
        }
      })
        .pipe(map(client => {
            if (client.informacionComercial?.id !== 0 && client.informacionComercial?.id != null) {
                return client.informacionComercial; 
            }
        }));
}

postCustomerBuilding(requestCustmerBuilding: CustomerBuildings){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiBuilding}`,
    {
        obra: {
            clienteId: requestCustmerBuilding.customerId,
            nombre: requestCustmerBuilding.name,
            telefono: requestCustmerBuilding.phone,
            nombreContacto: requestCustmerBuilding.contactName,
            departamento: requestCustmerBuilding.dept,
            municipio: requestCustmerBuilding.city,
            direccion: requestCustmerBuilding.address,
            correoElectronico: requestCustmerBuilding.email,
            bascula: requestCustmerBuilding.scale ? 'Si': 'No',
            latitud: requestCustmerBuilding.latitude,
            longitud: requestCustmerBuilding.length,
            administraSotoTrece: requestCustmerBuilding.isAdminBySoto13 ? 'Si': 'No',
            tiempoEsperaCola: requestCustmerBuilding.queueWaitingTime,
            porcentajeTolerancia: requestCustmerBuilding.tolerancePercentage,
            confirmacionEntrega: requestCustmerBuilding.deliveryConfirmation,
            horariosRecepcion: requestCustmerBuilding.receptionTimes,
            tipoVehiculoPermitido: requestCustmerBuilding.allowedVehicleTypes,
            tiempoDescargue: requestCustmerBuilding.loadingTime,
            estado: requestCustmerBuilding.state     
        }
      })
        .pipe(map(client => {
            if (client.obra?.id !== 0 && client.obra?.id != null) {
                return client.obra; 
            }
        }));
}

putCustomerBuilding(requestCustmerBuilding: CustomerBuildings){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiBuilding}`,
    {
        obra: {
            id: requestCustmerBuilding.id,
            nombre: requestCustmerBuilding.name,
            telefono: requestCustmerBuilding.phone,
            nombreContacto: requestCustmerBuilding.contactName,
            departamento: requestCustmerBuilding.dept,
            municipio: requestCustmerBuilding.city,
            direccion: requestCustmerBuilding.address,
            correoElectronico: requestCustmerBuilding.email,
            bascula: requestCustmerBuilding.scale ? 'Si': 'No',
            latitud: requestCustmerBuilding.latitude,
            longitud: requestCustmerBuilding.length,
            administraSotoTrece: requestCustmerBuilding.isAdminBySoto13 ? 'Si': 'No',
            tiempoEsperaCola: requestCustmerBuilding.queueWaitingTime,
            porcentajeTolerancia: requestCustmerBuilding.tolerancePercentage,
            confirmacionEntrega: requestCustmerBuilding.deliveryConfirmation,
            horariosRecepcion: requestCustmerBuilding.receptionTimes,
            tipoVehiculoPermitido: requestCustmerBuilding.allowedVehicleTypes,
            tiempoDescargue: requestCustmerBuilding.loadingTime,
            estado: requestCustmerBuilding.state     
        }
      })
        .pipe(map(client => {
            if (client.obra?.id !== 0 && client.obra?.id != null) {
                return client.obra; 
            }
        }));
}

postCustomerShipping(requestCustmerShipping: CustomerShipping){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiCustomerRateShipping}`,
    {
        tarifaFleteCliente: {
            clienteId: requestCustmerShipping.customerId,
            origen: requestCustmerShipping.origin,
            destino: requestCustmerShipping.destination,
            material: requestCustmerShipping.material,
            unidadMedida: requestCustmerShipping.measureUnit,
            valorFlete: requestCustmerShipping.shippingValue,
            estado : requestCustmerShipping.state
        }
      })
        .pipe(map(client => {
            if (client.tarifaFlete?.id !== 0 && client.tarifaFlete?.id != null) {
                return client.tarifaFlete; 
            }
        }));
}

putCustomerShipping(requestCustmerShipping: CustomerShipping){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiRateShipping}`,
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
            estado : requestCustmerShipping.state
        }
      })
        .pipe(map(client => {
            if (client.tarifaFlete?.id !== 0 && client.tarifaFlete?.id != null) {
                return client.tarifaFlete; 
            }
        }));
}

postLinkCustomerTransporter(requestCustmerTransporter: CustomerTransport){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiLinkClientTransporter}`,
    {
        clienteRelacionTransportador: {
            clienteId: requestCustmerTransporter.customerId,
            transportadorId: requestCustmerTransporter.transportId,
        }
      })
        .pipe(map(client => {
            if (client.clienteTransportadorRelacionado) {
                return client.clienteTransportadorRelacionado; 
            }
        }));
}

postAuthorizeTransporter(requestCustmerTransporter: CustomerTransport){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiAuthorizeTransporter}`, {
        autorizarTransportador: {
            clienteId: requestCustmerTransporter.customerId,
            transportadorId: requestCustmerTransporter.transportId,
            codigoAutorizacion: requestCustmerTransporter.codeAuth
        }
      })
        .pipe(map(client => {
                return (client?.transportadorAutorizado !== null || client?.transportadorAutorizado !== undefined) ? client?.transportadorAutorizado: false;
        }));
}

sendTransporterCode(requestCustmerTransporter: CustomerTransport){
    return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiSendTransporterCode}`, {
        generarCodigoVerificacion: {
            clienteId: requestCustmerTransporter.customerId,
            transportadorId: requestCustmerTransporter.transportId,
        }
      })
        .pipe(map(client => {
                return (client?.codigoVerificacionGenerado !== null || client?.codigoVerificacionGenerado !== undefined) ? client?.codigoVerificacionGenerado: false;
        }));
}

deleteTransporterClient(transporterId: number){
    return this.http.delete<any>(`${environment.urlBaseApi}${Constants.apiTransporterRoute}?id=${transporterId}`)
        .pipe(map(client => {
            if (client.rutaEliminado) {
                return client.rutaEliminado; 
            }
        }));
}

}
