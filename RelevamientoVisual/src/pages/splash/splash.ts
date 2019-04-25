import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NativeAudio } from '@ionic-native/native-audio';

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
    private nativeAudio: NativeAudio) {

    this.nativeAudio.preloadSimple('intro', 'assets/audio/intro.mp3').catch(() => { });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SplashPage');
  }

  ionViewDidEnter() {
 
    this.splashScreen.hide();

    setTimeout(() => {
      this.nativeAudio.play('intro').catch(() => { });
      this.viewCtrl.dismiss();
    }, 4000);
  }
}