import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

import firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-cosas-lindas-chart',
  templateUrl: 'cosas-lindas-chart.html',
})
export class CosasLindasChartPage {

  public firebase = firebase;
  public doughnutChartLabels: string[] = [];
  public doughnutChartData: number[];
  public doughnutChartType: string = 'doughnut';
  public config;
  public usuario;
  public sala;

  public image = "";
  public imgURLs = [];
  public ocultarImagen = true;

  // events
  public chartClicked(e: any): void {

    try {

      this.image = this.imgURLs[e.active[0]._index];
      this.ocultarImagen = false;
    } catch (error) { }
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation) {

    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).catch(() => { });

    let fotosRef = this.firebase.database().ref("Cosaslindas").child("imagenes");

      fotosRef.once("value", (snap) => {

        let data = snap.val();
        this.doughnutChartData = [];

        for (let item in data) {
    
          this.doughnutChartLabels.push(data[item].votos);
          this.doughnutChartData.push(data[item].votos);
          this.imgURLs.push(data[item].url);
        }
      });

      this.config = JSON.parse(localStorage.getItem("config"));
      this.usuario = JSON.parse(localStorage.getItem("auth"));

      if (this.config.sala == "Cosaslindas") {

        this.sala = "Cosas lindas";
      } else {
  
        this.sala = "Cosas feas";
      }
  }

  OcultarImagen() {
    this.ocultarImagen = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CosasLindasChartPage');
  }

  ionViewDidLeave() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

}