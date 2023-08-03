import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/ui/service/auth.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
  providers: [MessageService]
})
export class RecoveryComponent {
  formGroupRecovery!: FormGroup;
  submittedLogin : boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService) { }
  
  ngOnInit() {
    this.formGroupRecovery = this.formBuilder.group({
     username: ['',[Validators.required]],
    });


 }

 recover()
 {
  this.submittedLogin = true;
    if (this.formGroupRecovery.invalid) {
        return;
    }
  this.authService.recovery(this.f.username.value)
      .subscribe({
          next: (data) => {
            if(data !== null)
            {
              if(data.enviado)
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: data.mensaje, life: 3000 });  
              }
          },
          error: error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error?.detail, life: 5000 });
            setTimeout(()=>{this.goToLogin()}, 5000);
          }
      });
 }
 goToLogin() {
  this.router.navigate(["/login"])
}

 cancel(){
  this.goToLogin();
 }
 get f() { return this.formGroupRecovery?.controls; }
}
