import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { ScreenOrientation } from "@ionic-native/screen-orientation";

import firebase from "firebase";
import "firebase/firestore";

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public botones = []
  public idioma = "espanol";
  public tipo = "numero";
  public firebase = firebase;

  public ocultarAlert = true;
  public ocultarBotonCancelar = false;
  public tituloAlert = "";
  public mensajeAlert = "";
  public handlerAlert;
  public rotar = true;
  public bandera = "../../assets/imgs/espania.png"
  public imgTipo = "../../assets/imgs/numeros.png" 

  constructor(public navCtrl: NavController,
    private nativeAudio: NativeAudio,
    private toastCtrl: ToastController,
    private screenOrientation: ScreenOrientation) {

    for (let i = 0; i < 5; i++) {
      this.botones[i] = {"mostrar":`${i+1}.png`, "sonido":`${i+1}`};
    }

    this.observeScreenOrientation();

    this.nativeAudio.preloadSimple('espanol-1', 'assets/audio/espanol/numeros/uno.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-2', 'assets/audio/espanol/numeros/dos.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-3', 'assets/audio/espanol/numeros/tres.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-4', 'assets/audio/espanol/numeros/cuatro.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-5', 'assets/audio/espanol/numeros/cinco.mp3').catch(error => { });

    this.nativeAudio.preloadSimple('ingles-1', 'assets/audio/ingles/numeros/uno.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-2', 'assets/audio/ingles/numeros/dos.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-3', 'assets/audio/ingles/numeros/tres.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-4', 'assets/audio/ingles/numeros/cuatro.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-5', 'assets/audio/ingles/numeros/cinco.mp3').catch(error => { });

    this.nativeAudio.preloadSimple('espanol-verde', 'assets/audio/espanol/colores/verde.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-amarillo', 'assets/audio/espanol/colores/amarillo.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-negro', 'assets/audio/espanol/colores/negro.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-purpura', 'assets/audio/espanol/colores/purpura.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-azul', 'assets/audio/espanol/colores/azul.mp3').catch(error => { });

    this.nativeAudio.preloadSimple('ingles-verde', 'assets/audio/ingles/colores/verde.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-amarillo', 'assets/audio/ingles/colores/amarillo.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-negro', 'assets/audio/ingles/colores/negro.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-purpura', 'assets/audio/ingles/colores/purpura.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-azul', 'assets/audio/ingles/colores/azul.mp3').catch(error => { });

    this.nativeAudio.preloadSimple('espanol-jirafa', 'assets/audio/espanol/animales/jirafa.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-oso', 'assets/audio/espanol/animales/oso.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-tigre', 'assets/audio/espanol/animales/tigre.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-delfin', 'assets/audio/espanol/animales/delfin.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('espanol-elefante', 'assets/audio/espanol/animales/elefante.mp3').catch(error => { });

    this.nativeAudio.preloadSimple('ingles-jirafa', 'assets/audio/ingles/animales/jirafa.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-oso', 'assets/audio/ingles/animales/oso.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-tigre', 'assets/audio/ingles/animales/tigre.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-delfin', 'assets/audio/ingles/animales/delfin.mp3').catch(error => { });
    this.nativeAudio.preloadSimple('ingles-elefante', 'assets/audio/ingles/animales/elefante.mp3').catch(error => { });
  }

  public observeScreenOrientation() {

    this.screenOrientation.onChange().subscribe(() => {

      if (this.screenOrientation.type == "landscape-primary") { this.rotar = false; } 
      else { this.rotar = true; }
    });
  }

  EjecutarSonido(idioma: string, contenido: string) {

    console.log(`Idioma: ${idioma},contenido: ${contenido}`)
    this.nativeAudio.play(`${idioma}-${contenido}`).catch(error => { });
  }

  CambiarIdioma()  {

    if(this.idioma == "ingles") {

      this.idioma = "espanol"; 
      this.bandera = "../../assets/imgs/espania.png"
    } else { 

      this.idioma = "ingles";
      this.bandera = "../../assets/imgs/eeuu.png"
    }
  } 

  AlternarTipo() {

    if(this.tipo == "numero") {

      this.tipo = "color";
      this.imgTipo = "../../assets/imgs/colores.png"

      this.botones[0] = {"mostrar":"verde.png", "sonido":"verde"};
      this.botones[1] = {"mostrar":"amarillo.png", "sonido":"amarillo"};
      this.botones[2] = {"mostrar":"negro.png", "sonido":"negro"};
      this.botones[3] = {"mostrar":"purpura.png", "sonido":"purpura"};
      this.botones[4] = {"mostrar":"azul.png", "sonido":"azul"};

    } else if(this.tipo == "color"){

      this.tipo = "animal";
      this.imgTipo = "../../assets/imgs/animales.png" 

      this.botones[0] = {"mostrar":"elefante.png", "sonido":"elefante"};
      this.botones[1] = {"mostrar":"jirafa.png", "sonido":"jirafa"};
      this.botones[2] = {"mostrar":"tigre.png", "sonido":"tigre"};
      this.botones[3] = {"mostrar":"delfin.png", "sonido":"delfin"};
      this.botones[4] = {"mostrar":"oso.png", "sonido":"oso"};
    }
    else{
      this.tipo = "numero";
      this.imgTipo = "../../assets/imgs/numeros.png"

      for (let i = 0; i < 5; i++) {
        this.botones[i] = {"mostrar":`${i+1}.png`, "sonido":`${i+1}`};
      }
    }
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
