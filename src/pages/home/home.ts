import { Component } from '@angular/core';
import { NavController, App, MenuController, Events, LoadingController, Loading, AlertController, ToastController, NavParams } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConsultasProvider } from './../../providers/consultas/consultas';
import { PacienteProvider } from './../../providers/paciente/paciente';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthProvider } from './../../providers/auth/auth';

import { Paciente } from '../../models/paciente/paciente';

import { Session } from '../../providers/session/session';
import { User } from '../../models/user/user';

import { PerfilEditarPage } from '../perfil-editar/perfil-editar';

import { MedidasPage } from '../medidas/medidas';

import { PlanoPage } from '../plano/plano';
import { PerfilPage } from '../perfil/perfil';
import { RecomendacaoPage } from '../recomendacao/recomendacao';

import { CONSTANTS } from '../../configs/constants/constants';

import { MedidasAddPage } from '../medidas-add/medidas-add';

import { Db } from '../../storage/db';

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private itens: any;
  private user: User;
  public paciente: Paciente;
  public page: string = 'HomePage';
  private selectedPage: string = 'HomePage';
  public pages: Array<string> = ['HomePage', 'PlanoPage', 'MedidasPage', 'RecomendacaoPage', 'PerfilPage'];
  public planos: any;
  private pesos: any;
  private alturas: any;
  private medidas: any;

  private atividades: any;
  private alimentos: any;
  private injestao: any;
  private recomendacoes: any;

  private loading: Loading;

  private options: NativeTransitionOptions = {
    direction: 'up',
    duration: 100,
    slowdownfactor: 3,
    slidePixels: 20,
    iosdelay: 100,
    androiddelay: 150,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 60
   };

  constructor(public navCtrl: NavController,
      public http: HttpClient,
      public navParams: NavParams,
      private nativePageTransitions: NativePageTransitions,
      private menu: MenuController,
      private auth: AuthProvider,
      private localNotifications : LocalNotifications,
      public app: App,
      public session: Session,
      public events: Events,
      private alertCtrl: AlertController,
      private db: Db,
      private toastCtrl: ToastController,
      private loadingCtrl: LoadingController,
      private pacienteProvider: PacienteProvider,
      public consultas: ConsultasProvider) {

      this.menu.enable(true);

      this.auth.getDataConsultas()
      .then(data => {
          this.itens = (data);
      });

      this.events.subscribe('consultas:list', (consultas, time) => {
        this.itens = consultas;
      });

      this.selectedPage = navParams.get('page');

      if(this.selectedPage) {
        this.page = this.selectedPage;
      }

  }

  segmentChanged(tabName) {
      //console.log(tabName);
      //this.page = tabName;
  }

  onTabChanged(tabName) {
      this.page = tabName;
  }

  swipeLeft(event: any): any {

    let nav = this.navCtrl.getActive();

    if(nav.name === 'HomePage') {
        this.nativePageTransitions.fade(this.options);
        this.navCtrl.setRoot(PlanoPage);
    }

  }

  next() {

    this.nativePageTransitions.fade(this.options);
    this.navCtrl.setRoot(PlanoPage);

  }

  criaSession() {
      this.user = new User();
      this.session.create(this.user);
  }

  logout(){
        const root = this.app.getRootNav();
        root.popToRoot();
  }

  toEdit() {
    this.navCtrl.push(PerfilEditarPage);
  }

  ionViewDidLoad() {

    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDate();

    let cafeDaManha = new Date(year, month, day, 7, 0, 0, 0);
    let almoco = new Date(year, month, day, 12, 0, 0, 0);
    let lancheDaTarde = new Date(year, month, day, 16, 0, 0, 0);
    let jantar = new Date(year, month, day, 19, 0, 0, 0);

    this.localNotifications.schedule([
      {
        id: 2,
        title: 'Bom dia!',
        text: 'Aproveite o café da manhã, acesse o aplicativo para ver a lista de alimentos sugeridos pelo seu nutricionista.',
        trigger: {at: new Date(cafeDaManha)},
        led: 'FF0000',
      },

      {
        id: 3,
        title: 'Hora do Almoço',
        text: 'Acesse o aplicativo para ver a lista de alimentos sugeridos pelo seu nutricionista.',
        trigger: {at: new Date(almoco)},
        led: 'FF0000',
      },

      {
        id: 4,
        title: 'Lanche da Tarde',
        text: 'Acesse o aplicativo para ver a lista de alimentos sugeridos pelo seu nutricionista.',
        trigger: {at: new Date(lancheDaTarde)},
        led: 'FF0000',
      },

      {
        id: 5,
        title: 'Jantar',
        text: 'Acesse o aplicativo para ver a lista de alimentos sugeridos pelo seu nutricionista.',
        trigger: {at: new Date(jantar)},
        led: 'FF0000',
      },
    ]);

    this.getDataPlanos().then(data=>{
        this.planos = data;
    });

    this.getDataMedidas().then(data=>{
      if(data) {
        this.pesos = data.peso;
        this.alturas = data.altura;
      }
    });

    this.getDataAtividades().then(data=>{
        this.atividades = data;
    });

    this.getDataAlimentos().then(data=>{
        this.alimentos = data;
    });

    this.getDataInjestao().then(data=>{
        this.injestao = data;
    });

    this.getDataRecomendacoes().then(data=>{
        this.recomendacoes = data;
    });

    this.getPaciente();

    this.events.subscribe('paciente:updated', (paciente, time) => {
      this.paciente = paciente;
    });



  }

  getDataPlanos(){

      let index = 'planos';

      return this.db.exist(index).then(response=>{

        if(!response) {

            this.getPlanos()
            .then(data => {
                if(data) {
                  this.planos = data;
                  this.db.create(index, data);
                }
            });

        }

        return this.db.get(index);

      });

  }

  getPlanos() {

      let authKey = this.auth.getToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_PLANOS+'?token='+authKey, httpOptions)
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

  getDataMedidas(){

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

  getMedidas() {

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

  toAddMedidas() {
    this.navCtrl.push(MedidasAddPage);
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

  getDataAtividades(){

      let index = 'atividades';

      return this.db.exist(index).then(response=>{

        if(!response) {

          this.getAtividades()
          .then(data => {
              if(data) {
                this.atividades = data;
                this.db.create(index, data);
              }
          });

        }

        return this.db.get(index);

      });

  }

  getDataAlimentos(){

      let index = 'alimentos';

      return this.db.exist(index).then(response=>{

        if(!response) {

          this.getAlimentos()
          .then(data => {
              if(data) {
                this.alimentos = data;
                this.db.create(index, data);
              }
          });

        }

        return this.db.get(index);

      });

  }

  getDataInjestao(){

      let index = 'injestao';

      return this.db.exist(index).then(response=>{

        if(!response) {

          this.getInjestao()
          .then(data => {
              if(data) {
                this.injestao = data;
                this.db.create(index, data);
              }
          });

        }

        return this.db.get(index);

      });

  }

  getDataRecomendacoes(){

      let index = 'recomendacoes';

      return this.db.exist(index).then(response=>{

        if(!response) {

          this.getRecomendacoes()
          .then(data => {
              if(data) {
                this.recomendacoes = data;
                this.db.create(index, data);
              }
          });

        }

        return this.db.get(index);

      });

  }

  public getAtividades() {

      let authKey = this.auth.getToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_ATIVIDADES+'?token='+authKey, httpOptions)
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

  public getAlimentos() {

      let authKey = this.auth.getToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_ALIMENTOS+'?token='+authKey, httpOptions)
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

  public getInjestao() {

      let authKey = this.auth.getToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_INJESTAO+'?token='+authKey, httpOptions)
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

  public getRecomendacoes() {

      let authKey = this.auth.getToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_RECOMENDACOES+'?token='+authKey, httpOptions)
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

  getPaciente() {

    this.pacienteProvider.getPaciente().then(data=>{
      this.paciente = data;
    });

  }

  deletarMedida(item) {

    this.remove(item).then(data => {

        if(data['success']) {

            this.presentToast(data['message']);

            this.db.remove('medidas');

            this.getDataMedidas().then(data=>{
              if(data) {
                this.pesos = data.peso;
                this.alturas = data.altura;
              }
            });

        }

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

}
