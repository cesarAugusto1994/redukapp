import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private hasConsultas = false;

  constructor(public http: HttpClient, private auth: AuthProvider, private db: Db) {
  }

  getData(){

      let index = 'consultas';

      if(this.db.exist(index)) {
        return this.db.get(index);
      }

      this.getConsultas()
      .then(data => {
          this.itens = (data);
          this.db.create(index, data);
          this.hasConsultas = this.itens ? true : false;
      });

      return this.db.get(index);
  }

  public getConsultas() {

      let authKey = "Bearer "+this.auth.token;

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: authKey,
          Accept: 'application/json;odata=verbose',
        })
      };

      let postData = {
        token: "Bearer "+this.auth.token,
      }

      return new Promise(resolve => {
        this.http.get(CONSTANTS.API_ENDPOINT_CONSULTAS, httpOptions)
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
