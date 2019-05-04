import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CosasLindasChartPage } from './cosas-lindas-chart';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    CosasLindasChartPage,
  ],
  imports: [
    IonicPageModule.forChild(CosasLindasChartPage),
    ChartsModule
  ],
})
export class CosasLindasChartPageModule {}
