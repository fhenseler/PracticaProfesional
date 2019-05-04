import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { Vibration } from '@ionic-native/vibration';
import { Flashlight } from "@ionic-native/flashlight";
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';

import firebase from "firebase";
import "firebase/firestore";

import { LoginPage } from '../login/login';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public firebase = firebase;

  public animation = "borde";
  public imgAnimation = "";
  public activado = false;

  public ocultarAlert = true;
  public ocultarBotonCancelar = false;
  public tituloAlert = "";
  public mensajeAlert = "";
  public handlerAlert;
                            
  public deviceMotionSuscription: any;

  constructor(public navCtrl: NavController,
    private nativeAudio: NativeAudio,
    private toastCtrl: ToastController,
    private screenOrientation: ScreenOrientation,
    private vibration: Vibration,
    private flashlight: Flashlight,
    private deviceMotion: DeviceMotion) {

    this.nativeAudio.preloadSimple('activada', 'assets/audio/activada.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('desactivada', 'assets/audio/desactivada.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('hurtando', 'assets/audio/hurtando.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('epa', 'assets/audio/epa.mp3').catch(error => { });

    this.screenOrientation.onChange().subscribe(() => {

      if (this.activado) {

        if (this.screenOrientation.type == "landscape-primary") {

          this.flashlight.switchOff();
          this.vibration.vibrate(5000);
          this.nativeAudio.play("epa").catch(error => { })
        } else {

          this.vibration.vibrate(0);
          this.nativeAudio.play("hurtando").catch(error => { })

          setTimeout(() => this.flashlight.switchOn(), 500);
          setTimeout(() => this.flashlight.switchOff(), 5500);
        }
      }
    });
  }

  ActivarAlarma() {

    if (this.activado) {

      this.activado = false;
      document.getElementById("1").style.backgroundColor="#C61D3C";
      document.getElementById("1").textContent="ACTIVAR ALARMA";
      this.nativeAudio.play("desactivada").catch(error => { });
      this.animation = "borde";
      this.imgAnimation = "";

      this.flashlight.switchOff();
      this.vibration.vibrate(0);
      this.screenOrientation.lock("portrait-primary");

      this.deviceMotionSuscription.unsubscribe()
   
    } else {

      this.activado = true;
      document.getElementById("1").style.backgroundColor="green";
      document.getElementById("1").textContent="DESACTIVAR ALARMA";
      this.nativeAudio.play("activada").catch(error => { });
      this.animation = "borde rotar";
      this.imgAnimation = "opacidad-imagen";
      this.screenOrientation.unlock();
    }
  }

  MostrarAlert(titulo: string, mensaje: string, handler, ocultarBotonCancelar?: boolean) {

    this.ocultarAlert = false;
    this.tituloAlert = titulo;
    this.mensajeAlert = mensaje;
    this.handlerAlert = handler;

    if (ocultarBotonCancelar) { this.ocultarBotonCancelar = true; } else { this.ocultarBotonCancelar = false; }
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

  presentToast(mensaje: string) {

    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      cssClass: "normalToast"
    });

    toast.present();
  }
}
