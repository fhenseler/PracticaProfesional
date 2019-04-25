import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';
  splash = true;

  validation_messages = {
   'email': [
     { type: 'required', message: 'Se requiere un correo electrónico.' },
     { type: 'pattern', message: 'Por favor ingrese un correo electrónico válido.' }
   ],
   'password': [
     { type: 'required', message: 'Se requiere una contraseña.' },
     { type: 'minlength', message: 'La contraseña debe tener cinco caracteres o más.' }
   ]
 };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {

    setTimeout(() => {
      this.splash = false;
    }, 4000);

    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {
      this.router.navigate(["/home"]);
    }, err => {
      this.errorMessage = err.message;
      console.log(err)
    })
  }

  goRegisterPage(){
    this.router.navigate(["/register"]);
  }
}
