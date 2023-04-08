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

    getCustomersSmall() {
        return this.http.get<any>('assets/demo/data/customers-small.json')
            .toPromise()
            .then(res => res.data as Customer[])
            .then(data => data);
    }

    getCustomersMedium() {
        return this.http.get<any>('assets/demo/data/customers-medium.json')
            .toPromise()
            .then(res => res.data as Customer[])
            .then(data => data);
    }

    getCustomersLarge() {
        return this.http.get<any>('assets/demo/data/customers-large.json')
            .toPromise()
            .then(res => res.data as Customer[])
            .then(data => data);
    }

    getCustomersList() {
        return this.http.get<any>('assets/ui/data/customers.json')
            .toPromise()
            .then(res => res.data as CustomerBasicInfo[])
            .then(data => data);
    }

    getCustomerBuildingsList() {
        return this.http.get<any>('assets/ui/data/customers-buildings.json')
            .toPromise()
            .then(res => res.data as CustomerBuildings[])
            .then(data => data);
    }

    getCustomerTransportersList() {
        return this.http.get<any>('assets/ui/data/customers-transporters.json')
            .toPromise()
            .then(res => res.data as CustomerTransport[])
            .then(data => data);
    }

    getCustomerShippingList() {
        return this.http.get<any>('assets/ui/data/customers-shippings.json')
            .toPromise()
            .then(res => res.data as CustomerShipping[])
            .then(data => data);
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
                    email: item.CorreoElectronico,
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
        .pipe(map(data => {
            return data?.informacionComercial?.map((item: any) =>{
                 return newCommerciaInfo =  {
                    id: item.id,
                    priorityGroup: item.grupoPrioridad,
                    customerType: item.tipoCliente,
                    iva: item.iva,
                    assignedQuota: item.cupoAsignado,
                    usedQuota: item.cupoUtilizado,
                    availableQuota: item.cupoDisponible,
                    maturityDays: item.diasVencimiento,
                    delayDays: item.diasMora,
                    intermediationPercentage: item.porcentajeIntermediacion,
                    measureUnit: item.unidadMedida
                }
            })
        }));
    }

    getBuildingsByClient(clientId: number) {
        let newCommerciaInfo: CustomerBuildings; 
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiCustomerBuilding}?ClienteId=${clientId}`)
        .pipe(map(data => {
            return data?.obras?.map((item: any) =>{
                 return newCommerciaInfo =  {
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
                    //receptionTimes : item[];
                    allowedVehicleTypes: item.tipoVehiculoPermitido,
                    simpleLoadingTime: parseInt((item.tiempoDescargue as string).split(';')[0]),
                    doubleLoadingTime: parseInt((item.tiempoDescargue as string).split(';')[1]),
                    truckLoadingTime: parseInt((item.tiempoDescargue as string).split(';')[2]),
                    state : item.estado
                }
            })
        }));
    }


    postCustomerBasic(requestCustmerBasic: CustomerBasicInfo){
            let action = this.http.post<any>;
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
                  direccion: requestCustmerBasic.address
                }
              })
                .pipe(map(user => {
                    if (user.cliente?.id !== 0 && user.cliente?.id != null) {
                        return user.cliente; 
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
              DiasVencimiento: requestCustmerCommercial.maturityDays,
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

    
}
