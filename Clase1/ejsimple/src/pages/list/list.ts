import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
  
    this.selectedItem = navParams.get('item');

    // Returns the current stack of views in this nav controller
    console.log(this.navCtrl.getViews());
    
    //Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

   this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }

  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
   console.log(event);
    this.navCtrl.push(ListPage, { item: item }, {animate:true, animation:"flap"} );
    //this.navCtrl.goToRoot({animate:false});
  }
}
