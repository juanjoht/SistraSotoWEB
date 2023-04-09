import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/ui/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formGroupLogin!: FormGroup;
  submittedLogin : boolean = false;
  error = '';
  constructor(
    private router: Router,
    public layoutService: LayoutService,
    private authService: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
     this.formGroupLogin = this.formBuilder.group({
      username: ['',[Validators.required]],
      password: ['', [Validators.required]]
     });


  }
  get f() { return this.formGroupLogin?.controls; }

  logIn()
  {
    this.submittedLogin = true;
    // stop here if form is invalid
    if (this.formGroupLogin.invalid) {
        return;
    }
    this.error = '';
    this.authService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe({
            next: () => {
                // get return url from route parameters or default to '/'
                this.router.navigate(["/dashboard"]);
            },
            error: error => {
                this.error = error;
            }
        });    
  }

}