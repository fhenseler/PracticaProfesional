import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

import { HomePage } from "../home/home";
import firebase from "firebase";
import "firebase/firestore";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public email: string;
  public password: string;
  public isValid: boolean = true;
  public animation = "";
  public estadoBoton: boolean = false;
  public db = firebase.firestore();
  public textoDelBoton = "Ingresar";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private authInstance: AngularFireAuth) {

    this.db.settings({ timestampsInSnapshots: true });
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad LoginPage');
  }

  Login() {

    this.estadoBoton = true;
    this.textoDelBoton = "Espera...";

    if (!this.email) {

      this.presentToast("Introduzca su correo por favor.");
      setTimeout(() => this.estadoBoton = false, 3000);
      this.textoDelBoton = "Ingresar";
      return;
    } else {

      if (!this.password) {

        this.presentToast("No olvide escribir su contraseña.");
        setTimeout(() => this.estadoBoton = false, 3000);
        this.textoDelBoton = "Ingresar";
        return;
      }
    }

    this.animation = "ani";
    this.authInstance.auth.signInWithEmailAndPassword(this.email, this.password)

      .then(auth => {

        localStorage.setItem("auth", JSON.stringify({"mail":this.email.toLowerCase(),"password":this.password}));
        this.animation = "";
        this.navCtrl.setRoot(HomePage);
      })
      .catch(err => {

        this.animation = "";
        console.log(err);

        switch (err.code) {
          case "auth/invalid-email":
            this.presentToast("El correo ingresado no es valido.");
            this.estadoBoton = false;
            this.textoDelBoton = "Ingresar";
            break;

          case "auth/user-not-found":
          case "auth/wrong-password":
            this.presentToast("Correo o contraseña incorrectos.");
            this.estadoBoton = false;
            this.textoDelBoton = "Ingresar";
            break;

          default:
            this.presentToast("Error.");
            this.estadoBoton = false;
            this.textoDelBoton = "Ingresar";
        }
      });
  }

  SetearUsuario(email: string, password: string) {

    this.email = email;
    this.password = password;
  }

  presentToast(mensaje:string) {

    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      cssClass: "normalToast"
    });
  
    toast.present();
  }
}