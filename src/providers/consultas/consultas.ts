import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Events } from 'ionic-angular';
import { Injectable } from '@angular/core';

import { AuthProvider } from './../../providers/auth/auth';

import { CONSTANTS } from '../../configs/constants/constants';

import { Db } from '../../storage/db';

/*
  Generated class for the ConsultasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConsultasProvider {

  public token: any;

  private itens: any;

  constructor(public http: HttpClient, private auth: AuthProvider, private db: Db, public events: Events) {
  }

  getData(){

      let index = 'consultas';

      return this.db.exist(index).then(response=>{

        if(!response) {

          this.getConsultas()
          .then(data => {
              this.itens = (data);
              this.db.create(index, data);
          });

        }

        let resultado = this.db.get(index);

        this.events.publish('consutlas:list', resultado, Date.now());

        return resultado;

      });

  }

  public getConsultas() {

      let authKey = this.auth.getToken();

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

}
