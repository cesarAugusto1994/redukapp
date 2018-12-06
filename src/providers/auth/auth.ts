import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController, Loading, AlertController, Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

import {Observable} from "rxjs";
import 'rxjs/add/operator/map';

import 'rxjs/add/operator/catch';
import {Storage} from "@ionic/storage";
import 'rxjs/add/operator/toPromise';

import { CONSTANTS } from '../../configs/constants/constants';
import { User } from '../../models/user/user';
import { Db } from '../../storage/db';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  public currentUser: User;

  public user: any;

  public paciente: any;

  public consultas: any;

  public id: any;

  public token: string;

  private loading: Loading;

  constructor(public http: HttpClient,
    public storage: Storage,
    public db: Db,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public events: Events,
  ) {

  }

  getListaConsultas() {
      return this.consultas;
  }

  getToken() {

    let index = 'token';

    this.db.exist(index).then(response=>{

      if(response) {

          this.db.get(index)
          .then(data => {
              if(data) {
                this.token = data;
              }
          });

      }

    });

    return this.token;

  }

  public getUserApi(credentials) {

      if (this.token) {
        return Promise.resolve(this.token);
      }

      let authKey = "Bearer oZdbsQ5h6s8DZ6tRPmbrFAw77zeAqhFp";

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': authKey
        })
      };

      let postData = {
        email: credentials.email,
        password: credentials.password
      }

      return new Promise(resolve => {
        this.http.post(CONSTANTS.API_ENDPOINT_LOGIN, JSON.stringify(postData), httpOptions)
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

  public loginApi(email) {

      if (this.token) {
        return Promise.resolve(this.token);
      }

      let authKey = "Bearer oZdbsQ5h6s8DZ6tRPmbrFAw77zeAqhFp";

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': authKey
        })
      };

      let postData = {
        email: email,
        external_login:true
      }

      return new Promise(resolve => {
        this.http.post(CONSTANTS.API_ENDPOINT_LOGIN, JSON.stringify(postData), httpOptions)
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

  public getUserData() {

      let authKey = this.getToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_USER + '?token='+authKey, httpOptions)
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

  public getPaciente() {

      let authKey = this.getToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_PACIENTE + '?token='+authKey, httpOptions)
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

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {

          this.getUserApi(credentials).then(data => {

            if(!data) {
                return "Erro ao tentar se conectar com o servidor, ";
            } else {

              if(data['response'] == 'error') {

                  observer.next(false);

              } else {

                  if(data && data['response'] === 'success') {

                      this.token = data['result']['token'];
                      this.storeToken(this.token);

                      this.user = this.getUserData();
                      this.paciente = this.getPaciente();

                      this.storeUser(this.user);
                      this.storePaciente(this.paciente);

                      this.events.publish('user:logged', this.paciente, Date.now());
/*
                      this.getDataConsultas.then(resultado=>{
                          this.events.publish('consultas:list', resultado, Date.now());
                      });
*/
                      observer.next(true);

                  } else if (this.token) {
                      observer.next(true);
                  } else {
                      observer.next(false);
                  }

              }

            }

            observer.complete();
          });

      });

    }
  }

  public loginOnlyEmail(email) {
    if (email === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {

          this.loginApi(email).then(data => {

            if(!data) {
                return "Erro ao tentar se conectar com o servidor, ";
            } else {

              if(data['response'] == 'error') {

                  observer.next(false);

              } else {

                  if(data && data['response'] === 'success') {

                      this.token = data['result']['token'];
                      this.storeToken(this.token);

                      this.user = this.getUserData();
                      this.paciente = this.getPaciente();

                      this.storePaciente(this.paciente);

                      observer.next(true);

                  } else if (this.token) {
                      observer.next(true);
                  } else {
                      observer.next(false);
                  }

              }

            }

            observer.complete();
          });

      });

    }
  }

  public getUser(){
    return this.user;
  }

  public storeToken(token) {
      this.token = token;
      this.storage.set('token', "Bearer "+ token);
  }

  public storeUser(user) {

    user.then(data=>{
      this.storage.set('user', data);
    })

  }

  public storePaciente(paciente) {

    paciente.then(data=>{
      this.storage.set('paciente', data);
    })

  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {

    this.storage.remove('paciente');
    this.storage.remove('token');
    this.storage.remove('user');
    this.token = null;

    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });

  }

  showError(text) {
    let alert = this.alertCtrl.create({
      title: 'Importante',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  carregarPagina() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando seus dados...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  getConsultas() {

      let authKey = this.getToken();

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_CONSULTAS+'?token='+authKey, httpOptions)
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

  getDataConsultas(){

      let index = 'consultas';

      return this.db.exist(index).then(response=>{

        if(!response) {

          this.getConsultas()
          .then(data => {
              this.consultas = (data);
              this.events.publish('consultas:list', data, Date.now());
              this.db.create(index, data);
          });

        }

        return this.db.get(index);

      });

  }

}
