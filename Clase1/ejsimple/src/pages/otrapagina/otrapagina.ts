import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-otrapagina',
  templateUrl: 'otrapagina.html',
})
export class Otrapagina {

  public color:string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Otrapagina');
  }

  CambiarColor(){
    this.color="#ff6f60"
  }

}
