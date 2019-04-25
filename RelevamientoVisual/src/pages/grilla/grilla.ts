import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import { LoginPage } from "../login/login";
import { CosasFeasChartPage } from "../cosas-feas-chart/cosas-feas-chart";
import { CosasLindasChartPage } from "../cosas-lindas-chart/cosas-lindas-chart";

import firebase from "firebase";
import "firebase/firestore";

@IonicPage()
@Component({
  selector: 'page-grilla',
  templateUrl: 'grilla.html',
})
export class GrillaPage {

  public config;
  public sala;
  public firebase = firebase;
  public usuario;
  public fotos = [];
  public ocultarSpinner = false;
  public childDeLaImagen;
  public icono;

  public ocultarAlert = true;
  public ocultarBotonCancelar = false;
  public tituloAlert = "";
  public mensajeAlert = "";
  public handlerAlert;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private imagePicker: ImagePicker) {

    this.config = JSON.parse(localStorage.getItem("config"));
    this.usuario = JSON.parse(localStorage.getItem("auth"));

    if (this.config.sala == "Cosaslindas") {

      this.sala = "Cosas lindas";
      this.icono = "heart";
    } else {

      this.icono = "thumbs-down";
      this.sala = "Cosas feas";
    }

    this.firebase.database().ref(this.config.sala).child("usuarios").child(this.usuario.mail.replace(".", "")).on("value", (snapshot) => {

      this.childDeLaImagen = snapshot.toJSON();

      if (!this.childDeLaImagen) { this.childDeLaImagen = { child: "" }; }

      this.ObtenerFotos();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GrillaPage');
  }

  ObtenerFotos() {

    let fotosRef = this.firebase.database().ref(this.config.sala).child("imagenes");
    console.log(fotosRef.key);

    fotosRef.on("value", (snap) => {

      let data = snap.val();
      this.fotos = [];
      let contador = 0;

      for (let item in data) {

        this.fotos.push(data[item]);
        this.fotos[contador].referencia = item
        contador++;
      }

      this.fotos.reverse();

      this.ocultarSpinner = true;
    })
  }

  async SacarFoto() {

    let date = new Date();
    let imageName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;

    try {

      let options: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };

      let result = await this.camera.getPicture(options);

      let image = `data:image/jpeg;base64,${result}`;
      let pictures = this.firebase.storage().ref(`${this.config.sala}/${imageName}`);

      pictures.putString(image, "data_url").then(() => {

        pictures.getDownloadURL().then((url) => {

          let baseRef = this.firebase.database().ref(this.config.sala).child("imagenes");
          baseRef.push({ "usuario": this.usuario.mail, "url": url, "votos": 0 });
        });
      });
    } catch (error) {

      // this.presentToast(error);
    }
  }

  async SubirFotos() {

    let date = new Date();
    let imageName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;
    let options: ImagePickerOptions = {
      quality: 50,
      width: 600,
      height: 600,
      outputType: 1
    };

    this.imagePicker.getPictures(options).then((results) => {

      for (let i = 0; i < results.length; i++) {

        try {

          let image = `data:image/jpeg;base64,${results[i]}`;
          let pictures = this.firebase.storage().ref(`${this.config.sala}/${imageName}${i}`);

          pictures.putString(image, "data_url").then(() => {

            pictures.getDownloadURL().then((url) => {

              let baseRef = this.firebase.database().ref(this.config.sala).child("imagenes");
              baseRef.push({ "usuario": this.usuario.mail, "url": url, "votos": 0 });
            });
          });
        } catch (error) {
          //this.presentAlert("se ha atrapado una excepcion", `${error}`, "aceptar")
        }
      }
    }, (err) => {

      this.presentToast(err);
    });
  }

  Votar(referencia: string) {

    let child;
    let dbRefImg = this.firebase.database().ref(this.config.sala).child("imagenes").child(referencia);
    let dbRefUser = this.firebase.database().ref(this.config.sala).child("usuarios").child(this.usuario.mail.replace(".", ""));
    let votos;
    let votosImagenVieja;

    dbRefUser.once("value", (snapshot) => {

      child = snapshot.toJSON();

    }).then(() => {

      if (!child || child.child != referencia) {

        dbRefImg.once('value', function (snapshot) {

          votos = snapshot.toJSON();
        }).then(() => {
          dbRefImg.update({ votos: votos.votos + 1 }).then(() => {

            if (child) {

              this.firebase.database().ref(this.config.sala).child("imagenes").child(child.child).once("value", (snapshot) => {

                votosImagenVieja = snapshot.toJSON();
              }).then(() => { this.firebase.database().ref(this.config.sala).child("imagenes").child(child.child).update({ votos: votosImagenVieja.votos - 1 }) });
            }

            dbRefUser.set({ child: referencia });
          });
        })
      } else {

        this.presentToast("Esa imagen ya la has votado...");
      }
    })
  }

  onScroll() {

    if (this.isElementInViewPort((document.getElementById('checkpoint') as HTMLElement), Math.max(document.documentElement.clientHeight, window.innerHeight || 0))) {

      (document.getElementById('btnSacarFoto') as HTMLElement).classList.add("ocultar");
      (document.getElementById('btnSubirFotos') as HTMLElement).classList.add("ocultar");
    } else {
      (document.getElementById('btnSacarFoto') as HTMLElement).classList.remove("ocultar");
      (document.getElementById('btnSubirFotos') as HTMLElement).classList.remove("ocultar");
    }

  }

  isElementInViewPort(element: HTMLElement, viewPortHeight: number) {
    let rect = element.getBoundingClientRect();
    return rect.top >= 0 && (rect.bottom <= viewPortHeight);
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

  MostrarAlert(titulo: string, mensaje: string, handler, ocultarBotonCancelar?: boolean) {

    this.ocultarAlert = false;
    this.tituloAlert = titulo;
    this.mensajeAlert = mensaje;
    this.handlerAlert = handler;

    if (ocultarBotonCancelar) { this.ocultarBotonCancelar = true; } else { this.ocultarBotonCancelar = false; }
  }

  OcultarAlert() { this.ocultarAlert = true; }

  MostrarGrafico() {

    if (this.config.sala == "Cosaslindas") { this.navCtrl.push(CosasLindasChartPage); } else { this.navCtrl.push(CosasFeasChartPage); }
  }

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
}
