import { Component, Input } from '@angular/core';

import { HomePage } from "../../pages/home/home";

/**
 * Generated class for the AlertComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-alert',
  templateUrl: 'alert.html'
})
export class AlertComponent {

  text: string;
  @Input() titulo;
  @Input() mensaje;
  @Input() cancelar; 
  mensajeAlert =" estoy en el componente"

  constructor() {
    console.log('Hello AlertComponent Component');
    this.text = 'Hello World';
  }
}