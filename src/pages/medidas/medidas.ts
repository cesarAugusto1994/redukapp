import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, ToastController} from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map';

import { AuthProvider } from './../../providers/auth/auth';

import { MedidasAddPage } from '../medidas-add/medidas-add';

import { CONSTANTS } from '../../configs/constants/constants';

import { HomePage } from '../home/home';

import { Db } from '../../storage/db';

/**
 * Generated class for the MedidasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-medidas',
  templateUrl: 'medidas.html',
})
export class MedidasPage {

  private pesos: any;
  private alturas: any;

  private medidas: any;

  private medida: string = 'pesos';
  public data: Array<any>;

  private loading: Loading;

  constructor(public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthProvider,
    private alertCtrl: AlertController,
    private db: Db,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

    this.getData().then(data=>{
      if(data) {
        this.pesos = data.peso;
        this.alturas = data.altura;
      }
    });

  }

  backToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  toAddMedidas() {
    this.navCtrl.setRoot(MedidasAddPage);
  }

  delete(item) {

    this.presentConfirmarRemocao(item);

  }

  presentConfirmarRemocao(item) {
    let alert = this.alertCtrl.create({
      title: 'Confirmar Remoção',
      message: 'Deseja mesmo remover este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {

            this.deletarMedida(item);

          }
        }
      ]
    });
    alert.present();

  }

  getData(){

      let index = 'medidas';

      return this.db.exist(index).then(response=>{

        if(!response) {

            this.getMedidas()
            .then(data => {
                if(data!='undefined') {
                  this.pesos = data['peso'];
                  this.alturas = data['altura'];
                  this.db.create(index, data);
                }
            });

        }

        return this.db.get(index);

      });

  }

  public getMedidas() {

      let authKey = this.auth.getToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_MEDIDAS+'?token='+authKey, httpOptions)
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

  public deletarMedida(item) {


    this.remove(item).then(data => {

        if(data['success']) {

            this.presentToast(data['message']);

            this.db.remove('medidas');

            this.getData().then(data=>{
              if(data) {
                this.pesos = data.peso;
                this.alturas = data.altura;
              }
            });

        }

    });

  }

  public remove(item){

    let authKey = this.auth.getToken();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': authKey,
        Accept: 'application/json;odata=verbose',
      })
    };

    return new Promise(resolve => {
      this.http.post(CONSTANTS.API_ENDPOINT_MEDIDAS_DELETE+item.id, JSON.stringify({}), httpOptions)
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

  presentToast(msg) {

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
