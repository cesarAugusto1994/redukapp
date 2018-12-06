import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { PlanoPage } from '../pages/plano/plano';
import { PerfilPage } from '../pages/perfil/perfil';
import { PerfilEditarPage } from '../pages/perfil-editar/perfil-editar';
import { MedidasPage } from '../pages/medidas/medidas';
import { MedidasAddPage } from '../pages/medidas-add/medidas-add';
import { RecomendacaoPage } from '../pages/recomendacao/recomendacao';

import { AlterarSenhaPage } from '../pages/alterar-senha/alterar-senha';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AuthProvider } from '../providers/auth/auth';

import { Storage, IonicStorageModule } from "@ionic/storage";

import { ConsultasProvider } from '../providers/consultas/consultas';
import { PacienteProvider } from '../providers/paciente/paciente';

import { LocalNotifications } from '@ionic-native/local-notifications';

import { Session } from '../providers/session/session';

import { GooglePlus } from '@ionic-native/google-plus';

import { Db } from '../storage/db';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';

import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    PlanoPage,
    PerfilPage,
    PerfilEditarPage,
    MedidasPage,
    RecomendacaoPage,
    MedidasAddPage,
    AlterarSenhaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrMaskerModule
  ],
  exports: [
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PlanoPage,
    PerfilPage,
    PerfilEditarPage,
    MedidasPage,
    RecomendacaoPage,
    MedidasAddPage,
    AlterarSenhaPage
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
    GooglePlus,
    FileTransfer,
    File,
    Camera,
  ]
})
export class AppModule {}
