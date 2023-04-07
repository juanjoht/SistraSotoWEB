import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, throwError } from 'rxjs';
import { Constants } from 'src/app/common/constants';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Common } from 'src/app/common/common';
//import { MessageService } from 'primeng/api';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient
) { }


 // Http Options
 httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

// Handle API errors
handleError(error: HttpErrorResponse) {
  if (error.error instanceof ErrorEvent) {
    // A client-side or network error occurred. Handle it accordingly.
    console.error('An error occurred:', error.error.message);
  } else {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.error(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error}`);
  }
  // return an observable with a user-facing error message
  return throwError(
    'Something bad happened; please try again later.');
}

login(username: string, password: string) {
  return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiLogin}`, { usuario:{ nombreUsuario: username, contrasena: password }})
      .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          if (user.usuario?.token !== '' && user.usuario?.token != null) {
            Common.Token = user.usuario?.token;
            this.router.navigate([Constants.pathHome]);
          }
      }));
}

isLoggedIn() {
  const token = Common.Token;
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(token);
  const expirationDate = helper.getTokenExpirationDate(token);
  const isExpired = helper.isTokenExpired(token);
  // Now let's log the above values on the console.
  return false;
}



}
