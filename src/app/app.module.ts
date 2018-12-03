import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { PlanoPage } from '../pages/plano/plano';
import { PerfilPage } from '../pages/perfil/perfil';
import { PerfilEditarPage } from '../pages/perfil-editar/perfil-editar';
import { MedidasPage } from '../pages/medidas/medidas';
import { MedidasAddPage } from '../pages/medidas-add/medidas-add';
import { RecomendacaoPage } from '../pages/recomendacao/recomendacao';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '../providers/auth/auth';

import {Storage, IonicStorageModule} from "@ionic/storage";
import {JWT_OPTIONS, JwtModule} from '@auth0/angular-jwt';

import { ConsultasProvider } from '../providers/consultas/consultas';
import { PacienteProvider } from '../providers/paciente/paciente';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { Session } from '../providers/session/session';

import { Db } from '../storage/db';

export function jwtOptionsFactory(storage: Storage) {
  return {
    tokenGetter: () => storage.get('jwt_token'),
    whitelistedDomains: ['localhost:8080']
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    PlanoPage,
    PerfilPage,
    PerfilEditarPage,
    MedidasPage,
    RecomendacaoPage,
    MedidasAddPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage]
      }
    }),
    IonicStorageModule.forRoot(),
  ],
  exports: [
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    PlanoPage,
    PerfilPage,
    PerfilEditarPage,
    MedidasPage,
    RecomendacaoPage,
    MedidasAddPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ConsultasProvider,
    PacienteProvider,
    LocalNotifications,
    Session,
    Db,
  ]
})
export class AppModule {}
