import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { PacienteProvider } from './../../providers/paciente/paciente';
import {Storage} from "@ionic/storage";

import { HomePage } from '../home/home';
import { PerfilEditarPage } from '../perfil-editar/perfil-editar';

import { CONSTANTS } from '../../configs/constants/constants';
import { Paciente } from '../../models/paciente/paciente';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

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

  imageURI:any;
  imageFileName:any;

  constructor(public http: HttpClient,
    public navCtrl: NavController,
    private transfer: FileTransfer,
    private camera: Camera,
    public navParams: NavParams,
    public auth: AuthProvider,
    private storage: Storage,
    private pacienteProvider: PacienteProvider,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {

    this.getPaciente();

  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.uploadFile();

    }, (err) => {
      console.log(err);
      this.presentToast(err);
    });
  }

  uploadFile() {

    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });

    loader.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    let authKey = "Bearer "+this.auth.token;

    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {
        'X-Requested-With':'XMLHttpRequest',
        Connection: 'close',
      },
      params: {
        'Content-Type':  'application/json',
        'Authorization': authKey,
        Accept: 'application/json;odata=verbose',
      }
    }

    fileTransfer.upload(this.imageURI, CONSTANTS.API_ENDPOINT_USER_UPLOAD, options)
      .then((data) => {
      //console.log(data+" Uploaded Successfully");
      this.imageFileName = "avatar.jpg";
      loader.dismiss();
      this.presentToast("Image uploaded successfully");
    }, (err) => {
      //console.log(err);
      loader.dismiss();
      this.presentToast(err);
    });
  }

  presentToast(msg) {

    console.log(JSON.stringify(msg));

    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
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
