import { Injectable, OnInit } from '@angular/core';
//import { Constants } from '../common/constants';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Common } from 'src/app/common/common';
import { Constants } from 'src/app/common/constants';


@Injectable({
    providedIn: 'root',
})
export class HttpHelperService {
    private UrlBaseapi: string;
    public fnCallBackError = this.callBackError.bind(this);

    constructor(private http: HttpClient, private messageService: MessageService, public router: Router) {
        this.UrlBaseapi = Common.urlBaseApi;
    }
    // Http Headers
      httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
    };

    callBackError(errorMessaje: string) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessaje, life: 3000 });
    }

    GET<T>(obj: any, urlapi: string, callBack: any) {
        console.log(obj);
        this.http.get<T>(this.UrlBaseapi + urlapi, {
            params: obj,
            headers: this.httpOptions.headers
            })
            .subscribe(fm => {
                this.OK<T>(fm, callBack);
            },
                (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.unauthorice();
                    }
                    this.callBackError(err.message);

                }
            );
      }

      POST<T>(obj: any, urlapi: string, callBack: any) {
        this.http.post<T>(this.UrlBaseapi + urlapi, JSON.stringify(obj), this.httpOptions)
            .subscribe(fm => {
                this.OK<T>(fm, callBack);
            },
                (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.unauthorice();
                    } else if (err.error !== undefined) {
                        this.callBackError(err.error.detail);
                    } else {
                        this.callBackError(err.message);
                    }
                }
            );
      }

      PUT<T>(obj: any, urlapi: string, callBack: any) {
        this.http.put<T>(this.UrlBaseapi + urlapi, JSON.stringify(obj), this.httpOptions)
            .subscribe(fm => {
                this.OK<T>(fm, callBack);
            },
                (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.unauthorice();
                    } else if (err.error !== undefined) {
                        this.callBackError(err.error.detail);
                    } else {
                        this.callBackError(err.message);
                    }
                }
            );
      }

      DELETE<T>(urlapi: string, callBack: any) {
        this.http.delete<T>(this.UrlBaseapi + urlapi, this.httpOptions)
            .subscribe(fm => {
                this.OK<T>(fm, callBack);
            },
                (err: HttpErrorResponse) => {
                    if (err.status === 401) {
                        this.unauthorice();
                    } else if (err.error !== undefined) {
                        this.callBackError(err.error.detail);
                    } else {
                        this.callBackError(err.message);
                    }
                }
            );
      }


    private unauthorice() {
        Common.Token = '';
        this.router.navigate([Constants.pathLogin]);
    }

    private OK<T>(fm: T, callBack:any) {
            callBack(fm as T, Constants.dataSuccess);
    }

}
