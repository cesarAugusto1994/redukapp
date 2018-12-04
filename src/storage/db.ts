import { Storage } from "@ionic/storage";

//pacote para transformar nossa classe em injetável
import { Injectable } from '@angular/core';

@Injectable()
export class Db {

    constructor(public storage: Storage){

    }
    // setando uma seção e passando o tipo de usuário
    create(index:any, data: any) {
        this.storage.set(index, data);
    }

    get(index:any): Promise<any> {
        return this.storage.get(index);
    }

    // Quando deslogar deve remova do storage
    remove(index:any) {
        this.storage.remove(index);
    }

    exist(index:any) {
        return this.get(index).then(res => {
            //console.log('resultado >>> ', res);
            if(res) {
                //console.log('resultado IF');
                return true;
            } else {
                //console.log('resultado else');
                return false;
            }
        });
    }
}
