import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ScreenOrientation } from '@ionic-native/screen-orientation';

import firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-cosas-feas-chart',
  templateUrl: 'cosas-feas-chart.html',
})
export class CosasFeasChartPage {

  public firebase = firebase;

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      yAxes : [{
          ticks : {
              min : 0
          }
      }]
  }
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[];
  public config;
  public sala;
  public usuario;
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

    let fotosRef = this.firebase.database().ref("Cosasfeas").child("imagenes");
    this.barChartData = [{ data: [], label: 'Votos' }];

      fotosRef.once("value", (snap) => {

        let data = snap.val();
        this.barChartData = [{ data: [], label: 'Votos' }];

        
        for (let item in data) {
    
          this.barChartLabels.push('');
          this.barChartData[0].data.push(data[item].votos);
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
    console.log('ionViewDidLoad CosasFeasChartPage'); 
  }

  ionViewDidLeave() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }
}
