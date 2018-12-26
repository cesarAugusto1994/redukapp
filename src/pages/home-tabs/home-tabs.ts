import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { MedidasPage } from '../medidas/medidas';
import { PlanoPage } from '../plano/plano';
import { PerfilPage } from '../perfil/perfil';
import { RecomendacaoPage } from '../recomendacao/recomendacao';

/**
 * Generated class for the HomeTabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-tabs',
  templateUrl: 'home-tabs.html',
})
export class HomeTabsPage {

  tab1Root = HomePage;
  tab2Root = MedidasPage;
  tab3Root = RecomendacaoPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomeTabsPage');
  }

  swipeEvent(e) {

      console.log('Foi');

      if(e.dircetion = '2'){
        //<missing command >(Tab3Page);
      }
      else if(e.direction = '4'){
        //<missing command >(Tab1Page);
      }
  }

}
