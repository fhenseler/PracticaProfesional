import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public email:string;
  public password:string;
  public mostrar:boolean;
  public direccion:string;

  constructor(public navCtrl: NavController) {
    this.mostrar=false;
  }

  MostrarDatos(em, pas){
    this.email = em;
    this.password = pas;
    this.mostrar = true;
  }

}
