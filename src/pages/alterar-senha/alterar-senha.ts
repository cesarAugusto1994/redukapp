import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { HomePage } from '../home/home';
import { PerfilPage } from '../perfil/perfil';

import { AuthProvider } from './../../providers/auth/auth';
import { CONSTANTS } from '../../configs/constants/constants';
import { Db } from '../../storage/db';

/**
 * Generated class for the AlterarSenhaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alterar-senha',
  templateUrl: 'alterar-senha.html',
})
export class AlterarSenhaPage {

  private password: string;

  private loading: Loading;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    private auth: AuthProvider,
    private alertCtrl: AlertController,
    private db: Db,
    public toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {

  }

  presentToast(text) {
    const toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  backToPrevious() {
    this.navCtrl.setRoot(PerfilPage);
  }

  public storeSenha() {

      let postData = {
        password: this.password,
      }

      if(!this.password) {
          this.showError('Informe a senha.');
      } else {

        this.showLoading();

        this.post(postData).then(data => {
            this.presentToast('Senha atualizada com sucesso.');
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
        });

        this.backToPrevious();

      }
  }

  public post(postData){

    let authKey = this.auth.getToken();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': authKey,
        Accept: 'application/json;odata=verbose',
      })
    };

    return new Promise(resolve => {
      this.http.post(CONSTANTS.API_ENDPOINT_USER_PASSWORD, JSON.stringify(postData), httpOptions)
        .subscribe(
          data => {

            if(!data) {
                return "Erro ao tentar se conectar com o servidor, ";
            } else {

              resolve(data);

            }
          },
          err =>  {
            return "Erro ao tentar se conectar com o servidor, " + err.message;
          }
      );
    });

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Salvando dados...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
      let alert = this.alertCtrl.create({
        title: 'Importante',
        subTitle: text,
        buttons: ['OK']
      });
      alert.present();
    }

}
