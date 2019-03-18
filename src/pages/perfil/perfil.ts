import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IonicPage, NavController, NavParams, LoadingController, Loading, ToastController, ActionSheetController, AlertController, Events, Platform } from 'ionic-angular';
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
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera';

import { AlterarSenhaPage } from '../alterar-senha/alterar-senha';
import { UploadImagePage } from '../upload-image/upload-image';

import { Db } from '../../storage/db';

import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

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
    public platform: Platform,
    private nativePageTransitions: NativePageTransitions,
    public navCtrl: NavController,
    private file: File,
    private filePath: FilePath,
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

  async selectImage() {
      const actionSheet = await this.actionSheetCtrl.create({
          title: "Selecione a imagem",
          buttons: [{
                  text: 'Galeria',
                  handler: () => {
                      this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                  }
              },
              {
                  text: 'Camera',
                  handler: () => {
                      this.takePicture(this.camera.PictureSourceType.CAMERA);
                  }
              },
              {
                  text: 'Cancelar',
                  role: 'cancel'
              }
          ]
      });
      await actionSheet.present();
  }

  private createFileName() {
    var d = new Date(),
    n = d.getTime(),
    newFileName =  n + ".jpg";
    return newFileName;
  }

  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }

      this.imageURI = imagePath;

      this.uploadFile();

    }, (err) => {
      //this.presentToast('Error while selecting image.');
    });

  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.imageURI = newFileName;
    }, error => {
      this.presentToast('Erro ao salvar imagem.');
    });
  }

  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.file.dataDirectory + img;
    }
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
              //console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
  }

  presentActionSheetOpcoes() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Selecione uma opção',
      buttons: [
        {
          text: 'Trocar Senha',
          handler: () => {

              this.navCtrl.push(AlterarSenhaPage);

          }
        },{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {

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
      content: "Enviando..."
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

      //this.navCtrl.setRoot(this.navCtrl.getActive().component);

      this.presentToast("Imagem enviada com sucesso.");

      window.location.reload();


    }, (err) => {

      //console.log((err));

      loader.dismiss();

      //this.presentToast(err);

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
    this.navCtrl.push(AlterarSenhaPage);
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
