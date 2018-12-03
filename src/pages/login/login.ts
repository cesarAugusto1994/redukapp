import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, IonicPage, MenuController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';

import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loading: Loading;
  public registerCredentials = { email: '', password: '' };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private menu: MenuController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController) {

      this.menu.enable(false);

  }

  onPageDidEnter() {
    // the left menu should be disabled on the login page
    this.menu.enable(false);
  }

  onPageDidLeave() {
    // enable the left menu when leaving the login page
    this.menu.enable(true);
  }

  ionViewDidLoad() {
  }

  public login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(allowed => {
      if (allowed) {
        this.navCtrl.setRoot(HomePage);
      } else {
        this.showError("Credenciais não batem com os registros.");
      }
    },
      error => {
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Erro de Autenticação',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
