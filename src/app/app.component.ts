import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform, MenuController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';

import { PlanoPage } from '../pages/plano/plano';
import { PerfilPage } from '../pages/perfil/perfil';
import { MedidasPage } from '../pages/medidas/medidas';
import { RecomendacaoPage } from '../pages/recomendacao/recomendacao';

import { Paciente } from '../models/paciente/paciente';

import { Session } from '../providers/session/session';

import {Storage} from "@ionic/storage";

import {AuthProvider} from "../providers/auth/auth";
import {PacienteProvider} from "../providers/paciente/paciente";

import { Db } from '../storage/db';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  private user: any;
  private nome: any;
  private avatar: any;
  private paciente: Paciente;

  pages: Array<{title: string, component: any, icon: String}>;

  constructor(public platform: Platform,
    public app: App,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public auth: AuthProvider,
    public pacienteProvider: PacienteProvider,
    public menuCtrl: MenuController,
    private session: Session,
    public alertCtrl: AlertController,
    private db: Db,
    private readonly storage: Storage) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Início', component: HomePage, icon: 'menu' },
      { title: 'Meus Dados', component: PerfilPage, icon: 'person' },
      { title: 'Plano Alimentar', component: PlanoPage, icon: 'restaurant' },
      { title: 'Medidas', component: MedidasPage, icon: 'speedometer' },
      { title: 'Recomendações', component: RecomendacaoPage, icon: 'heart' },

    ];



  }

  getPaciente() {

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.db.get('paciente')
      .then(data=> {
        this.nome = data.nome;
        this.avatar = data.avatar;
      });
/*
      this.pacienteProvider.getPaciente().then(data=>{
        console.log(data);
        this.nome = data.nome;
        this.avatar = data.avatar;
      });
*/
      //this.user = JSON.parse(this.auth.storage.get('currentUser'));
      this.rootPage = this.session.exist()
                    ? HomePage
                    : LoginPage;

    });

    this.platform.registerBackButtonAction(() => {
        // Catches the active view
        let nav = this.app.getActiveNavs()[0];
        let activeView = nav.getActive();
        // Checks if can go back before show up the alert
        if(activeView.name === 'HomePage') {
            if (nav.canGoBack()){
                nav.pop();
            } else {
                const alert = this.alertCtrl.create({
                    title: 'Fechar o App',
                    message: 'Você tem certeza?',
                    buttons: [{
                        text: 'Cancelar',
                        role: 'cancel',
                        handler: () => {
                          this.nav.setRoot('HomePage');
                          console.log('** Saída do App Cancelada! **');
                        }
                    },{
                        text: 'Fechar o App',
                        handler: () => {
                          this.logoutClicked();
                          this.platform.exitApp();
                        }
                    }]
                });
                alert.present();
            }
        }
      });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);


  }

  logoutClicked() {
    this.auth.logout();
    this.db.remove('paciente');
    this.db.remove('token');
    this.db.remove('user');
    this.menuCtrl.close();
    var nav = this.app.getRootNav();
    nav.setRoot(LoginPage);
  }
}
