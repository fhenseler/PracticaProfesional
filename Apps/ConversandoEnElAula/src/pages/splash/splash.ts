import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeAudio } from "@ionic-native/native-audio";

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public splashScreen: SplashScreen,
    private toastCtrl: ToastController,
    private nativeAudio: NativeAudio) {

      this.nativeAudio.preloadSimple('intro', 'assets/audio/intro.mp3').catch(() => {  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

  ionViewDidEnter() {
 
    this.splashScreen.hide();
 
    setTimeout(() => {

      this.nativeAudio.play('intro').catch(() => {  });

      this.viewCtrl.dismiss();

      if(localStorage.getItem("auth")) {
        setTimeout(() => {

          this.toastCtrl.create({
            message: "Selecciona una sala para conversar.",
            duration: 3000,
            position: 'top',
            cssClass: "normalToast"
          }).present();
        }, 500); 
      }
    }, 4000);
  }
}
