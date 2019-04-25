import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GrillaPage } from '../grilla/grilla';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  Redireccionar(sala: string, ionColor: string) {

    let config = {"sala": sala,"ionColor":ionColor};
    localStorage.setItem("config", JSON.stringify(config));
    this.navCtrl.push(GrillaPage);
  }
}
