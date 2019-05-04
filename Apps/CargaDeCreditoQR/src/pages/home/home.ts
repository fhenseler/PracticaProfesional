import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';

import { AngularFireAuth } from "angularfire2/auth";
import firebase from "firebase";
import "firebase/firestore";

import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Vibration } from '@ionic-native/vibration';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public db = firebase.firestore();
  public scanSub;
  public estado = "container";
  public usuario;
  public saldo = 0;
  public ocultarSpinner = false;
  public ocultarAlert = true;
  public ocultarBotonCancelar = false;
  public tituloAlert = "";
  public mensajeAlert = "";
  public handlerAlert;

  constructor(public navCtrl: NavController,
    private authInstance: AngularFireAuth,
    private alertCtrl: AlertController,
    private qrScanner: QRScanner,
    private toastCtrl: ToastController,
    private vibration: Vibration) {

    this.db.settings({ timestampsInSnapshots: true });

    this.usuario = JSON.parse(localStorage.getItem("auth"));
    this.authInstance.auth.signInWithEmailAndPassword(this.usuario.mail, this.usuario.password)
      .catch((e) => this.presentToast(e));

    let docRef = this.db.collection("codigos-qr").doc(this.usuario.mail)
    docRef.get()
      .then((doc) => {
        this.saldo = doc.data().saldo;
        this.ocultarSpinner = true;
      })
      .catch((e) => this.MostrarAlert("Ups...", "No podemos establecer conexión. Asegurate de estar conectado.", this.OcultarAlert, true));
  }

  InicializarLectorQR() {

    this.OcultarAlert();

    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {

        if (status.authorized) {

          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {

            this.vibration.vibrate(300);

            this.VerificarQR(text)
              .then(() => this.MostrarAlert("Éxito", "Se ha cargado saldo a tu cuenta.", this.InicializarLectorQR, true))
              .catch((error) => this.MostrarAlert("", `${error}`, this.InicializarLectorQR, true));
          });

          this.qrScanner.show().then(() => {
            (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
            (window.document.querySelector('.close') as HTMLElement).classList.add('mostrar');
            (window.document.querySelector('.scroll-content') as HTMLElement).style.backgroundColor = "transparent";
            this.estado = "ocultar";
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there

        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => this.presentToast(e));
  }

  OcultarLectorQR() {

    this.qrScanner.hide().then(() => {
      (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
      (window.document.querySelector('.close') as HTMLElement).classList.remove('mostrar');
      (window.document.querySelector('.scroll-content') as HTMLElement).style.backgroundColor = "#FDE8C9";
      this.estado = "container";
    });

    this.scanSub.unsubscribe();
  }

  presentToast(mensaje: string) {

    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      cssClass: "normalToast"
    });

    toast.present();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Cerrar sesión.',
      message: '¿Cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.Logout();
          }
        }
      ]
    });
    alert.present();
  }

  MostrarAlert(titulo: string, mensaje: string, handler, ocultarBotonCancelar?: boolean) {

    this.ocultarAlert = false;
    this.tituloAlert = titulo;
    this.mensajeAlert = mensaje;
    this.handlerAlert = handler;

    if(ocultarBotonCancelar) { this.ocultarBotonCancelar = true; } else { this.ocultarBotonCancelar = false; }
  }

  OcultarAlert() { this.ocultarAlert = true; }

  Logout() {

    firebase.auth().signOut()
      .then(() => {

        localStorage.clear();
        this.navCtrl.setRoot(LoginPage);
      })
      .catch((error) => {

        this.presentToast(error);
      });
  }

  VerificarQR(qr: string): Promise<any> {

    let referenciaAbase = this.db.collection("codigos-qr").doc(this.usuario.mail);
    let codigosCargados = [];
    let saldo = 0;

    return referenciaAbase.get()
      .then((doc) => {

        codigosCargados = doc.data().codigos;
        saldo = doc.data().saldo;

        switch (qr) {

          case "8c95def646b6127282ed50454b73240300dccabc":
            this.ChequearSiElCodigoFueCargado("8c95def646b6127282ed50454b73240300dccabc", codigosCargados);
            codigosCargados.push("8c95def646b6127282ed50454b73240300dccabc");
            referenciaAbase.update({
              saldo: saldo + 10,
              codigos: codigosCargados
            });
            this.saldo += 10;
            break;

          case "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ":
            this.ChequearSiElCodigoFueCargado("ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ", codigosCargados);
            codigosCargados.push("ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ");
            referenciaAbase.update({
              saldo: saldo + 50,
              codigos: codigosCargados
            });
            this.saldo += 50;
            break;

          case "2786f4877b9091dcad7f35751bfcf5d5ea712b2f":
            this.ChequearSiElCodigoFueCargado("2786f4877b9091dcad7f35751bfcf5d5ea712b2f", codigosCargados);
            codigosCargados.push("2786f4877b9091dcad7f35751bfcf5d5ea712b2f");
            referenciaAbase.update({
              saldo: saldo + 100,
              codigos: codigosCargados
            });
            this.saldo += 100;
            break;

          case "deleteCredit":
            codigosCargados = [];
            referenciaAbase.update({saldo:0, codigos: codigosCargados});
            this.saldo = 0;
            break;

          default:
            throw "El código escaneado no es válido.";
        }
      });
  }

  eliminarSaldo(){
    this.VerificarQR("deleteCredit");
  }

  ChequearSiElCodigoFueCargado(codigo: string, codigosCargados) {

    for (let item of codigosCargados) {

      if (item == codigo) {
        throw "Este código ya fue cargado. Probar con otro."
      }
    }
  }
}