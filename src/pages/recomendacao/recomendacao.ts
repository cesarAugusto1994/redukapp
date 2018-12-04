import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthProvider } from './../../providers/auth/auth';

import { CONSTANTS } from '../../configs/constants/constants';

import { HomePage } from '../home/home';

import { Db } from '../../storage/db';

/**
 * Generated class for the RecomendacaoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recomendacao',
  templateUrl: 'recomendacao.html',
})
export class RecomendacaoPage {

  private atividades: any;
  private alimentos: any;
  private injestao: any;
  private recomendacoes: any;

  constructor(public http: HttpClient, public auth: AuthProvider, public navCtrl: NavController, public navParams: NavParams, private db: Db) {
  }

  backToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLoad() {

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

}
