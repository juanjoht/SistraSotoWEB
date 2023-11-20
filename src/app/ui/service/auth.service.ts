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


recovery(username: string) {
  return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiRecovery}`, { nombreUsuario: username })
      .pipe(map(user => {
          if (user.contrasenaEnviada) {
            return user.contrasenaEnviada
          }
      }));
}

changePw(username: string, pw: string) {
  return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiChangePw}`, { usuario: {nombreUsuario: username, contrasena: pw }})
      .pipe(map(user => {
          if (user.contrasenaCambiada) {
            return user.contrasenaCambiada
          }
      }));
}


login(username: string, password: string) {
  return this.http.post<any>(`${environment.urlBaseApi}${Constants.apiLogin}`, { usuario:{ nombreUsuario: username, contrasena: password }})
      .pipe(map(user => {
          if (user.usuario?.token !== '' && user.usuario?.token != null && user.usuario?.modulosPerfil?.length !== 0) {
            Common.Token = user.usuario?.token;
            Common.UserName = user.usuario?.nombre;
            Common.UserId = username;
            Common.Modules = user.usuario?.modulosPerfil;
            Common.FactoryId = user.usuario?.plantaId;
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
