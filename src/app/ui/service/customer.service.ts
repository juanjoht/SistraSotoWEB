import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import { CustomerBasicInfo, CustomerBuildingOrder, CustomerBuildings, CustomerCommercialInfo, CustomerLicensePlate, CustomerShipping, CustomerTransport } from '../models/customer.model';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable()
export class CustomerService {

    constructor(private http: HttpClient) { }


    getCustomerTransporterVehicle(vehicleId: number) {
        let newCustomerBasic: CustomerBasicInfo = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiCustomerTransporterVehicle}?VehiculoId=${vehicleId}`)
        .pipe(map(data => {
            return data?.clientes?.map((item: any) =>{
                 return newCustomerBasic =  {
                    id: item.id,
                    name: item.nombre
                }
            })
        }));
    }

    getCustomerList() {
        let newCustomerBasic: CustomerBasicInfo = {};
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiCustomerList}`)
        .pipe(map(data => {
            return data?.clientes?.map((item: any) =>{
                 return newCustomerBasic =  {
                    id: item.id,
                    name: item.nombre
                }
            })
        }));
    }



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
                    measureUnit: item.informacionComercial.unidadMedida,
                    creditBalance: item.informacionComercial.saldoFavor,
                    exclusiveTransport : item.informacionComercial.transporteExclusivo,
                    allowsChangesLoadPlant: item.informacionComercial.permiteCambiosCarguePlanta
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
                    zone: item.zona,
                    email: item.correoElectronico,
                    scale: item.bascula === 'Si' ? true: false,
                    latitude: item.latitud,
                    length: item.longitud,
                    isAdminBySoto13: item.administraSotoTrece,
                    tolerancePercentage: item.porcentajeTolerancia,
                    intermediationPercentage: item.porcentajeIntermediacion,
                    deliveryConfirmation: item.confirmacionEntrega,
                    receptionTimes : item.horariosRecepcion,
                    allowedVehicleTypes: item.tipoVehiculoPermitido,
                    allCost: item.todoCosto,
                    profitability : item.calificacionRentabilidad,
                    roadCondition: item.calificacionEstadoVia,
                    unloadingAgility: item.calificacionAgilidadDescargue,
                    weightedRating: item.calificacionPonderada,                    
                    state : item.estado
                }
            })
        }));
    }

    getBuildings() {
        let newCommerciaInfo: CustomerBuildings; 
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiBuilding}`)
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
                    zone: item.zona,
                    email: item.correoElectronico,
                    scale: item.bascula === 'Si' ? true: false,
                    latitude: item.latitud,
                    length: item.longitud,
                    isAdminBySoto13: item.administraSotoTrece,
                    tolerancePercentage: item.porcentajeTolerancia,
                    intermediationPercentage: item.porcentajeIntermediacion,
                    deliveryConfirmation: item.confirmacionEntrega,
                    receptionTimes : item.horariosRecepcion,
                    allowedVehicleTypes: item.tipoVehiculoPermitido,
                    allCost: item.todoCosto,
                    profitability : item.calificacionRentabilidad,
                    roadCondition: item.calificacionEstadoVia,
                    unloadingAgility: item.calificacionAgilidadDescargue,
                    weightedRating: item.calificacionPonderada,                    
                    state : item.estado
                }
            })
        }));
    }

    getBuildingsByClientOrder(clientId: number) {
        let newInfo: CustomerBuildingOrder; 
        let now: any = new Date();
        const yyyy = now.getFullYear();
        let mm = now.getMonth() + 1;
        let dd = now.getDate();
        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm; 
        const values = mm + '/' + dd + '/' + yyyy;
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiCustomerBuildingOrder}?ClienteId=${clientId}&Fecha=${values}`)
        .pipe(map(data => {
            return data?.obras?.map((item: any) =>{
                 return newInfo =  {
                    id: item.id,
                    name: item.nombre
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
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiShippingRateByClient}/cliente?ClienteId=${clientId}`)
        .pipe(map(data => {
            return data?.clienteTarifaFletes?.map((item: any) =>{
                 return newInfo =  {
                    id: item.id,
                    routeId: item.rutaId,
                    route: item.rutaNombre,
                    material: item.tipoMaterialNombre,
                    materialId: item.tipoMaterialId,
                    m3Value: item.valorMetroCubico,
                    tonValue: item.valorTonelada,
                    state: item.estado
                }
            })
        }));
    }

    getLicensePlatesByClient(clientId: number) {
        let newInfo: CustomerLicensePlate; 
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiCustomerPlate}?ClienteId=${clientId}`)
        .pipe(map(data => {
            return data?.placas?.map((item: any) =>{
                 return newInfo =  {
                    id: item.id,
                    name: item.nombre
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
              UnidadMedida: requestCustmerCommercial.measureUnit,
              saldoFavor: requestCustmerCommercial.creditBalance,
              transporteExclusivo: requestCustmerCommercial.exclusiveTransport,
              permiteCambiosCarguePlanta: requestCustmerCommercial.allowsChangesLoadPlant
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
          UnidadMedida: requestCustmerCommercial.measureUnit,
          transporteExclusivo: requestCustmerCommercial.exclusiveTransport,
          permiteCambiosCarguePlanta: requestCustmerCommercial.allowsChangesLoadPlant
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
            zona: requestCustmerBuilding.zone,
            direccion: requestCustmerBuilding.address,
            correoElectronico: requestCustmerBuilding.email,
            bascula: requestCustmerBuilding.scale ? 'Si': 'No',
            latitud: requestCustmerBuilding.latitude,
            longitud: requestCustmerBuilding.length,
            administraSotoTrece: requestCustmerBuilding.isAdminBySoto13,
            porcentajeTolerancia: requestCustmerBuilding.tolerancePercentage,
            confirmacionEntrega: requestCustmerBuilding.deliveryConfirmation,
            horariosRecepcion: requestCustmerBuilding.receptionTimes,
            tipoVehiculoPermitido: requestCustmerBuilding.allowedVehicleTypes,
            porcentajeIntermediacion: requestCustmerBuilding.intermediationPercentage,
            todoCosto: requestCustmerBuilding.allCost,
            calificacionRentabilidad: requestCustmerBuilding.profitability,
            calificacionEstadoVia: requestCustmerBuilding.roadCondition,
            calificacionAgilidadDescargue: requestCustmerBuilding.unloadingAgility,
            calificacionPonderada: requestCustmerBuilding.weightedRating,
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
            zona: requestCustmerBuilding.zone,
            direccion: requestCustmerBuilding.address,
            correoElectronico: requestCustmerBuilding.email,
            bascula: requestCustmerBuilding.scale ? 'Si': 'No',
            latitud: requestCustmerBuilding.latitude,
            longitud: requestCustmerBuilding.length,
            administraSotoTrece: requestCustmerBuilding.isAdminBySoto13,
            porcentajeTolerancia: requestCustmerBuilding.tolerancePercentage,
            confirmacionEntrega: requestCustmerBuilding.deliveryConfirmation,
            horariosRecepcion: requestCustmerBuilding.receptionTimes,
            tipoVehiculoPermitido: requestCustmerBuilding.allowedVehicleTypes,
            porcentajeIntermediacion: requestCustmerBuilding.intermediationPercentage,
            todoCosto: requestCustmerBuilding.allCost,
            calificacionRentabilidad: requestCustmerBuilding.profitability,
            calificacionEstadoVia: requestCustmerBuilding.roadCondition,
            calificacionAgilidadDescargue: requestCustmerBuilding.unloadingAgility,
            calificacionPonderada: requestCustmerBuilding.weightedRating,
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
        clienteTarifaFlete: {
            clienteId: requestCustmerShipping.customerId,
            rutaId: requestCustmerShipping.routeId,
            tipoMaterialId: requestCustmerShipping.materialId,
            valorMetroCubico: requestCustmerShipping.m3Value,
            valorTonelada: requestCustmerShipping.tonValue,
            estado : requestCustmerShipping.state
        }
      })
        .pipe(map(client => {
            if (client.clienteTarifaFlete?.id !== 0 && client.clienteTarifaFlete?.id != null) {
                return client.clienteTarifaFlete; 
            }
        }));
}

putCustomerShipping(requestCustmerShipping: CustomerShipping, clientId: number){
    return this.http.put<any>(`${environment.urlBaseApi}${Constants.apiRateShipping}`,
    {
        clienteTarifaFlete: {
                id: requestCustmerShipping.id,
                clienteId: clientId,
                rutaId: requestCustmerShipping.routeId,
                tipoMaterialId: requestCustmerShipping.materialId,
                valorMetroCubico: requestCustmerShipping.m3Value,
                valorTonelada: requestCustmerShipping.tonValue,
                estado : requestCustmerShipping.state
            }
      })
        .pipe(map(client => {
                return (client.clienteTarifaFlete !== null && client.clienteTarifaFlete !== undefined) ? client.clienteTarifaFlete : false; 
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

deleteTransporterClient(clientId: number, transporterId: number){
    return this.http.delete<any>(`${environment.urlBaseApi}${Constants.apiDeleteCustomerTransporter}?ClienteId=${clientId}&TransportadorId=${transporterId}`)
        .pipe(map(client => {
                return (client?.clienteTransportadorEliminado !== null || client?.clienteTransportadorEliminado !== undefined) ? client?.clienteTransportadorEliminado: false;
        }));
}

}
