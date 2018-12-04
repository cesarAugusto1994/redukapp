import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading, IonicPage, MenuController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';

import { HomePage } from '../home/home';

import { GooglePlus } from '@ionic-native/google-plus';

import { Session } from '../../providers/session/session';
import { User } from '../../models/user/user';

import { Db } from '../../storage/db';

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
  providers: [GooglePlus]
})
export class LoginPage {

  nome: any;
  email: any;
  familyName: any;
  givenName: any;
  id: any;
  avatar: any;

  isLoggedIn:boolean = false;

  private user: User;

  private loading: Loading;
  public registerCredentials = { email: '', password: '' };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private menu: MenuController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private session: Session,
    private db: Db,
    private googlePlus: GooglePlus) {

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

  googleLogin() {

    this.googlePlus.login({})
      .then(res => {

        this.showLoading();

        this.nome = res.displayName;
        this.email = res.email;
        this.familyName = res.familyName;
        this.givenName = res.givenName;
        this.id = res.userId;
        this.avatar = res.imageUrl;

       let data = {
         id: this.id,
         nome: this.nome,
         email: this.email,
         avatar: this.avatar,
       };

        this.isLoggedIn = true;

        this.user = new User(data);
        this.db.create('user', this.user);

        this.auth.loginOnlyEmail(this.email).subscribe(allowed => {
          if (allowed) {
            this.navCtrl.setRoot(HomePage);
          } else {
            this.logout();
            this.showError("Credenciais não batem com os registros.");
          }
        },
        error => {
          this.showError(error);
        });

        //this.navCtrl.setRoot(HomePage);

      })
      .catch(err => console.error(err));

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

  logout() {
    this.googlePlus.logout()
      .then(res => {
        //console.log(res);
        this.nome = "";
        this.email = "";
        this.familyName = "";
        this.givenName = "";
        this.id = "";
        this.avatar = "";

        this.isLoggedIn = false;
      })
      .catch(err => console.error(err));
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
