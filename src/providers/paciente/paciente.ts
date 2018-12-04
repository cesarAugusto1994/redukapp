import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Paciente } from '../../models/paciente/paciente';

import { AuthProvider } from './../../providers/auth/auth';

import { Db } from '../../storage/db';

import { CONSTANTS } from '../../configs/constants/constants';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

/*
  Generated class for the PacienteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PacienteProvider {

  private paciente: Paciente;
  private index: string = 'paciente';

  constructor(public http: HttpClient, private db: Db, private authProvider: AuthProvider) {
    //console.log('Hello PacienteProvider Provider');
  }

  ionViewDidLoad() {
      this.getData();
  }

  public getPaciente() {
      return this.getData();
  }

  public getUser() {
      return this.db.get('user');
  }

  public getData() {

    if(this.db.exist(this.index)) {
      return this.db.get(this.index);
    }

    this.getPacientes().subscribe((paciente : Paciente)=>{
      this.paciente = paciente;
      this.db.create(this.index, paciente);
    });

    return this.db.get(this.index);

  }

  public getPacientes(): Observable<Paciente> {

    let authKey = this.authProvider.getToken();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authKey,
        Accept: 'application/json;odata=verbose',
      })
    };

    return this.http
      .get(CONSTANTS.API_ENDPOINT_PACIENTE+'?token='+authKey, httpOptions)
      .map(paciente => {
        return new Paciente(paciente);
      });

  }

  public updatePaciente(data:any): Observable<any> {

    let authKey = this.authProvider.getToken();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authKey,
        Accept: 'application/json;odata=verbose',
      })
    };

    return this.http
      .post(CONSTANTS.API_ENDPOINT_PACIENTE_STORE, JSON.stringify(data), httpOptions)
      .map(response => {
        //console.log(response);
        return response;
      });
  }

}
