import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { AngularFireAuth } from "angularfire2/auth";
import firebase from "firebase";
import "firebase/firestore";

import { ChatPage } from '../chat/chat';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private toastCtrl: ToastController) { }

  ionViewDidLoad() { }

  Redireccionar(sala: string, ionColor: string, color: string) {

    let config = {"sala": sala, "ionColor": ionColor, "color": color};

    localStorage.setItem("config", JSON.stringify(config));
    this.navCtrl.push(ChatPage);
  }
}
