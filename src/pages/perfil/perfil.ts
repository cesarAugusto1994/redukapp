import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController, ActionSheetController, AlertController, Events } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { AuthProvider } from './../../providers/auth/auth';
import { PacienteProvider } from './../../providers/paciente/paciente';
import { Storage } from "@ionic/storage";

import { HomePage } from '../home/home';
import { PlanoPage } from '../plano/plano';
import { PerfilEditarPage } from '../perfil-editar/perfil-editar';
import { RecomendacaoPage } from '../recomendacao/recomendacao';

import { CONSTANTS } from '../../configs/constants/constants';
import { Paciente } from '../../models/paciente/paciente';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AlterarSenhaPage } from '../alterar-senha/alterar-senha';
import { UploadImagePage } from '../upload-image/upload-image';

import { Db } from '../../storage/db';

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

  private options: NativeTransitionOptions = {
    direction: 'up',
    duration: 100,
    slowdownfactor: 3,
    slidePixels: 20,
    iosdelay: 100,
    androiddelay: 150,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 60
   };

   private log;

  constructor(public http: HttpClient,
    private nativePageTransitions: NativePageTransitions,
    public navCtrl: NavController,
    private transfer: FileTransfer,
    private camera: Camera,
    public navParams: NavParams,
    public auth: AuthProvider,
    private storage: Storage,
    private pacienteProvider: PacienteProvider,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public events: Events,
    private db: Db,
    public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {

    this.getPaciente();

    this.events.subscribe('paciente:updated', (paciente, time) => {
      this.paciente = paciente;
    });

  }

  swipeRight(event: any): any {

    let nav = this.navCtrl.getActive();

    if(nav.name === 'PerfilPage') {
        this.nativePageTransitions.fade(this.options);
        this.navCtrl.setRoot(RecomendacaoPage);
    }

  }

  previous() {

    this.nativePageTransitions.fade(this.options);
    this.navCtrl.setRoot(RecomendacaoPage);

  }

  uploadImage() {
    this.navCtrl.setRoot(UploadImagePage);
  }

  presentActionSheet() {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'Suas Opções',
        buttons: [
          {
            text: 'Alterar Senha',
            role: 'destructive',
            handler: () => {

              this.goToAlterarSenha();

            }
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
  }

  showAlertaEnvioEmail() {
    const alert = this.alertCtrl.create({
      title: 'Atenção!',
      subTitle: 'Foi enviado para o seu email uma solicitação de redefinição de senha.',
      buttons: ['OK']
    });
    alert.present();
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
      console.log(imageData);
      //this.presentToast(JSON.stringify(imageData));
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

    let authKey = this.auth.getToken();

    let filename = 'image.jpg';

    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      headers: {
        Connection: 'close',
        Authorization: authKey,
      },
      params : {'fileName': filename},
    }

    fileTransfer.upload(this.imageURI, CONSTANTS.API_ENDPOINT_USER_UPLOAD, options)
      .then((result) => {
      //console.log(data+" Uploaded Successfully");
      //this.presentToast(JSON.stringify(result));
      this.imageFileName = "avatar";

      loader.dismiss();

      //this.events.publish('paciente:updated', result, Date.now());
      this.events.publish('user:logged', result, Date.now());

      this.setPaciente(result);

      //this.events.publish('paciente:updated', result, Date.now());
      //this.db.update('paciente', result);

      this.navCtrl.setRoot(this.navCtrl.getActive().component);

      this.presentToast("Imagem enviada com sucesso.");


    }, (err) => {

      //console.log((err));

      loader.dismiss();
      this.presentToast(err);

      //this.log = JSON.stringify(err);

    });
  }

  setPaciente(paciente) {
    this.paciente = paciente;
  }

  presentToast(msg) {

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

  goToAlterarSenha() {
    this.navCtrl.setRoot(AlterarSenhaPage);
  }

  toEdit() {
    this.navCtrl.push(PerfilEditarPage);
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
