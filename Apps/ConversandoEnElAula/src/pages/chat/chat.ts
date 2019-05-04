import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Content } from 'ionic-angular';

import { AngularFireAuth } from "angularfire2/auth";
import firebase from "firebase";
import "firebase/firestore";

import { LoginPage } from '../login/login';

import { NativeAudio } from "@ionic-native/native-audio";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',

})
export class ChatPage {

  public sala: string = "";
  public ionColor: string = "";
  public db = firebase.firestore();
  public fire = firebase;
  public config;
  public usuario;
  public mensajes = [];
  public texto = "";
  public inputNoValido = false;
  public ocultarSpinner = false;
  @ViewChild(Content) content: Content;
  public flag = true;
  public ejecutarSonidos = false;

  public ocultarAlert = true;
  public ocultarBotonCancelar = false;
  public tituloAlert = "";
  public mensajeAlert = "";
  public handlerAlert;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private nativeAudio: NativeAudio) {

    this.db.settings({ timestampsInSnapshots: true });
    this.config = JSON.parse(localStorage.getItem("config"));
    this.usuario = JSON.parse(localStorage.getItem("auth"));
    
    this.sala = this.config.sala;
    this.ionColor = this.config.ionColor;

    this.nativeAudio.preloadSimple('send', 'assets/audio/send.mp3')
    .catch(error => {});

    this.nativeAudio.preloadSimple('recieve', 'assets/audio/recieve.mp3')
    .catch(error => {});

    this.nativeAudio.preloadSimple('key', 'assets/audio/key.mp3')
    .catch(error => {});
    
    this.ObtenerMensajes();

    try {

      setTimeout(() => { this.content.scrollToBottom(0); });
    } catch (error) {

      this.presentToast("ups");
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  ObtenerMensajes() {

    let mensajesRef = this.fire.database().ref().child(this.sala);

    mensajesRef.on("value", (snap) => {

      let data = snap.val();
      this.mensajes = [];

      let contador = 0; 
      for (let item in data) {

        this.mensajes.push(data[item]);

        if(Object.keys(data).length - 1 == contador && data[item].usuario != this.usuario.mail && this.ejecutarSonidos) {

          this.ejecutarSonidos = false;
        } else { contador++; }
      }

      this.ejecutarSonidos = true;
      this.ocultarSpinner = true;

      setTimeout(() => {

          try {

            this.content.scrollToBottom(0);
          } catch (error) {

              console.log("Entre al catch del scrollbottom()");
          }
      }, 100);

    })
  }

  EnviarMensaje() {

    if (this.texto != "") {

      if (!this.inputNoValido) {

        let tiempo = new Date();

        let mensajesRef = this.fire.database().ref().child(this.sala);
        mensajesRef.push({ "usuario": this.usuario.mail, "texto": this.texto, "hora": `${(tiempo.getHours()<10?'0':'') + tiempo.getHours()}:${(tiempo.getMinutes()<10?'0':'') + tiempo.getMinutes()}` }).then(() => {

          this.nativeAudio.play('send')
          .catch(error => this.presentToast(error));
        });
        this.texto = "";
      } else { this.presentToast("No se admiten más de 21 caracteres."); }
    } else { this.presentToast("No olvides escribir tu mensaje."); }
  }

  VerificarCantidadDeCaracteres() {

    let arrayAux = (this.texto).split("");

    if(this.texto == " ") { window.document.querySelector("input").value = ""; }

    if (Object.keys(arrayAux).length > 21) {

      this.inputNoValido = true;
      return;
    }

    this.inputNoValido = false;
  }

  isElementInViewPort(element: HTMLElement, viewPortHeight: number) {
    let rect = element.getBoundingClientRect();
    return rect.top >= 0 && (rect.bottom <= viewPortHeight);
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
