import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../api/customer';
import { CustomerBasicInfo, CustomerBuildings, CustomerShipping, CustomerTransport } from '../models/customer.model';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/common/constants';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Cities, Depts } from '../models/param-static.model';

@Injectable()
export class ParamStaticService {

    constructor(private http: HttpClient) { }

    

    getDepts() {
        let newDept: Depts = {
            id: '',
            name: ''
        };
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiParamStaticDept}`)
        .pipe(map(dept => {
            return dept?.departamentos?.map((item: { id: string; nombre: string; }) =>{
                 return newDept =  {
                    id: item.id,
                    name: item.nombre
                }
            })
        }));
    }

    getCitiesByDept(id: string) {
        let newCities: Cities = {
            id: '',
            deptId: '',
            name: ''
        };
        return this.http.get<any>(`${environment.urlBaseApi}${Constants.apiParamStaticCitiesByDept}?DepartamentoId=${id}`)
        .pipe(map(dept => {
            return dept?.municipios?.map((item: { id: string, departamentoId: string, nombre: string; }) =>{
                 return newCities =  {
                    id: item.id,
                    deptId: item.departamentoId,
                    name: item.nombre
                }
            })
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
