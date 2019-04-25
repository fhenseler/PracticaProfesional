import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPageModule } from '../pages/login/login.module';
import { SplashPageModule } from '../pages/splash/splash.module';
import { GrillaPageModule } from '../pages/grilla/grilla.module';
import { CosasFeasChartPageModule } from "../pages/cosas-feas-chart/cosas-feas-chart.module";
import { CosasLindasChartPageModule } from "../pages/cosas-lindas-chart/cosas-lindas-chart.module";
import { ChartsModule } from 'ng2-charts';

// ---------------------- Firebase ----------------------
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebaseConfig } from '../config';
// ------------------------------------------------------

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from "@ionic-native/camera";
import { ImagePicker } from '@ionic-native/image-picker';
import { NativeAudio } from '@ionic-native/native-audio';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    LoginPageModule,
    SplashPageModule,
    GrillaPageModule,
    AngularFireModule.initializeApp(firebaseConfig.fire),
    ChartsModule,
    CosasFeasChartPageModule,
    CosasLindasChartPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    Camera,
    ImagePicker,
    NativeAudio,
    ScreenOrientation
  ]
})
export class AppModule {}
