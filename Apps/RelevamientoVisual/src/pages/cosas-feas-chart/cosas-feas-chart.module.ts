import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CosasFeasChartPage } from './cosas-feas-chart';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    CosasFeasChartPage,
  ],
  imports: [
    IonicPageModule.forChild(CosasFeasChartPage),
    ChartsModule
  ],
})
export class CosasFeasChartPageModule {}
