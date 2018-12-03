import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MedidasAddPage } from './medidas-add';

@NgModule({
  declarations: [
    MedidasAddPage,
  ],
  imports: [
    IonicPageModule.forChild(MedidasAddPage),
  ],
})
export class MedidasAddPageModule {}
