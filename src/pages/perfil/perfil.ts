import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { PacienteProvider } from './../../providers/paciente/paciente';
import {Storage} from "@ionic/storage";

import { HomePage } from '../home/home';
import { PerfilEditarPage } from '../perfil-editar/perfil-editar';

import { CONSTANTS } from '../../configs/constants/constants';
import { Paciente } from '../../models/paciente/paciente';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  public paciente: Paciente;

  private loading: Loading;

  constructor(public http: HttpClient,
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthProvider,
    private storage: Storage,
    private pacienteProvider: PacienteProvider,
    private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

    this.getPaciente();

  }

  backToHome() {
    this.navCtrl.setRoot(HomePage);
  }

  toEdit() {
    this.navCtrl.setRoot(PerfilEditarPage);
  }

  getPaciente() {

    this.pacienteProvider.getPaciente().then(data=>{
      this.paciente = data;
    });

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Salvando dados...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

}
