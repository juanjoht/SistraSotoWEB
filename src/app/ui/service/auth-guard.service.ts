import { Injectable } from '@angular/core';
import { Constants } from 'src/app/common/constants';
import { Router} from '@angular/router';
import { Common } from 'src/app/common/common';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(public router: Router) { }

  canActivate() {
    return this.Validate;
  }

  isAuthenticated(): boolean {
    return Common.Token !== '';
  }

  public get Validate(): boolean {
    if (!this.isAuthenticated()) {
      // redirect the user
      this.router.navigate([Constants.pathLogin]);
      return false;
    }
    return true;
  }

  public logout(): void {
    Common.Token = '';
    const d = this.Validate;
  }
}


