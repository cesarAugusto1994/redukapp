import { Component } from '@angular/core';
import { NavController, App, MenuController } from 'ionic-angular';
import { ConsultasProvider } from './../../providers/consultas/consultas';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { AuthProvider } from './../../providers/auth/auth';

import { Session } from '../../providers/session/session';
import { User } from '../../models/user/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private itens: any;

  private hasConsultas: boolean = false;

  private user: User;

  constructor(public navCtrl: NavController,
      private menu: MenuController,
      private auth: AuthProvider,
      private localNotifications : LocalNotifications,
      public app: App,
      public session: Session,
      public consultas: ConsultasProvider) {

      if(!this.itens) {
        this.consultas.getData()
        .then(data => {
            this.itens = (data);
            this.hasConsultas = data ? true : false;
        });
      }

      this.menu.enable(true);
  }

  criaSession() {
      this.user = new User();
      this.session.create(this.user);
  }

  logout(){
        const root = this.app.getRootNav();
        root.popToRoot();
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

  }

}
