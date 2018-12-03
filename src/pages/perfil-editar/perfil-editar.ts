import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { PacienteProvider } from './../../providers/paciente/paciente';
import {Storage} from "@ionic/storage";

import { CONSTANTS } from '../../configs/constants/constants';
import { Paciente } from '../../models/paciente/paciente';

import { PerfilPage } from '../perfil/perfil';

/**
 * Generated class for the PerfilEditarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil-editar',
  templateUrl: 'perfil-editar.html',
})
export class PerfilEditarPage {

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

  getPaciente() {

    this.pacienteProvider.getPaciente().then(data=>{
      this.paciente = data;
    });

  }

  backToPerfil() {
    this.navCtrl.setRoot(PerfilPage);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Salvando dados...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  public store(){

      let postData = {
        name: this.paciente.nome,
        birth: this.paciente.nascimento,
        gender: this.paciente.sexo,
        phone: this.paciente.telefone,
        occupation: this.paciente.ocupacao,
        zip: this.paciente.cep,
        cpf: this.paciente.cpf,
        city: this.paciente.cidade,
        state: this.paciente.estado,
        address: this.paciente.endereco,
        number: this.paciente.numero
      };

      this.showLoading();

      this.pacienteProvider.updatePaciente(postData).subscribe(data => {
          this.navCtrl.setRoot(PerfilPage);
      });

  }

}
