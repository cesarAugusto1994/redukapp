import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedidasPage } from './medidas';

@NgModule({
  declarations: [
    MedidasPage,
  ],
  imports: [
    IonicPageModule.forChild(MedidasPage),
  ],
})
export class MedidasPageModule {}
