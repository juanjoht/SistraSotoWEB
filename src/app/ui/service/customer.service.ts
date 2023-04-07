import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import { CustomerBasicInfo, CustomerBuildings, CustomerShipping, CustomerTransport } from '../models/customer.model';
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




    postCustomerBasic(requestCustmerBasic: CustomerBasicInfo){
            return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiCustomer}`,
            {
                cliente: {
                  tipoDocumento: requestCustmerBasic.docType,
                  numeroDocumento: requestCustmerBasic.docNumber,
                  nombre: requestCustmerBasic.name,
                  telefono: requestCustmerBasic.phone,
                  celular: requestCustmerBasic.cellPhone,
                  email: requestCustmerBasic.email,
                  departamento: requestCustmerBasic.dept,
                  municipio: requestCustmerBasic.city,
                  direccion: requestCustmerBasic.address
                }
              })
                .pipe(map(user => {
                    if (user.cliente?.id !== 0 && user.cliente?.id != null) {
                        //this.customerSubject.next(user.cliente);
                        return user.cliente; 
                    }
                }));
    }

    
}
