import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MedidasPage } from '../medidas/medidas';

import { AuthProvider } from './../../providers/auth/auth';

import { CONSTANTS } from '../../configs/constants/constants';

import { Db } from '../../storage/db';

/**
 * Generated class for the MedidasAddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-medidas-add',
  templateUrl: 'medidas-add.html',
})
export class MedidasAddPage {

  private medida: any;
  public data: any;
  public tipo: any;

  private loading: Loading;

  constructor(public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private alertCtrl: AlertController,
    private db: Db,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

  }

  goback() {
     this.navCtrl.setRoot(MedidasPage);
  }

  public storeMedida() {

      let postData = {
        tipo: this.tipo,
        medida: this.medida,
        data: this.data,
      }

      if(!this.medida) {
          this.showError('Informe o tipo de medida.');
      } else if(!this.data) {
          this.showError('Informe o valor da medida.');
      } else if(!this.data) {
          this.showError('Informe uma data.');
      } else {

        this.showLoading();

        this.post(postData).then(data => {
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
        });

        this.db.remove('medidas');

        this.goback();

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
      this.http.post(CONSTANTS.API_ENDPOINT_MEDIDAS_STORE, JSON.stringify(postData), httpOptions)
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
