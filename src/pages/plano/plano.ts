import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthProvider } from './../../providers/auth/auth';

import { CONSTANTS } from '../../configs/constants/constants';

import { HomePage } from '../home/home';

import { Db } from '../../storage/db';

/**
 * Generated class for the PlanoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-plano',
  templateUrl: 'plano.html',
})
export class PlanoPage {

  public planos: any;

  public hasplanos = false;

  constructor(public http: HttpClient, public auth: AuthProvider, public navCtrl: NavController, public navParams: NavParams, private db: Db) {
  }

  ionViewDidLoad() {

    this.getData().then(data=>{
        this.planos = data;
        this.hasplanos = data ? true : false;
    });

  }

  backToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  getData(){

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

  public getPlanos() {

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

}
