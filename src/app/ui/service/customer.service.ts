import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import { CustomerBasicInfo, CustomerBuildings, CustomerShipping, CustomerTransport } from '../models/customer.model';

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

    
}
