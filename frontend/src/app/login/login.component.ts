import { Component } from '@angular/core';
import { AuthGuardService } from '../services/auth-guard.service';
import { LoginService } from '../services/login.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showSignUp : boolean = false;
  showSignIn : boolean = false;
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  constructor(private authService: LoginService){}
  ngOnInit() {
    this.showSignUpForm(false,true)
    this.loginForm = this.createFormGroup();
    this.signupForm = this.createUserFormGroup();
  }
  showSignUpForm(showSignUp:boolean,showSignIn:boolean): void{
    this.showSignUp = showSignUp;
    this.showSignIn = showSignIn;
  }


  createFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  login(): void {
    try {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(
          {
            next: (response) => {
              if(response !=undefined){
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Logged In Successfully!",
                  showConfirmButton: false,
                  timer: 1000
                });
              }

            },
            error: (error) => {
              // treat error
            },
            complete: () => {

            }
          }
        );
    } catch (error) {
      console.log('ssssssssssss', error);
    }
  }

  createUserFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl("", [Validators.required, Validators.minLength(2)]),
      username: new FormControl("", [Validators.required, Validators.minLength(2)]),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  signup(): void {
    this.authService.signup(this.signupForm.value).subscribe((msg) => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: `User ${this.signupForm.value.email} Registred Successfully!`,
        showConfirmButton: false,
        timer: 1000
      });
      this.showSignUpForm(false,true)
    });
  }

}
