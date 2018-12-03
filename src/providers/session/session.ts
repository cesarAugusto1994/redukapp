import { Storage } from "@ionic/storage";

//pacote para transformar nossa classe em injetável
import { Injectable } from '@angular/core';

//import do nosso model usuario.ts
import { User } from '../../models/user/user';

@Injectable()
export class Session {

    constructor(public storage: Storage){

    }
    // setando uma seção e passando o tipo de usuário
    create(usuario: User) {
        this.storage.set('user', usuario);
    }

    get(): Promise<any> {
        return this.storage.get('user');
    }

    // Quando deslogar deve remova do storage
    remove() {
        this.storage.remove('user');
    }

    exist() {
        this.get().then(res => {
            //console.log('resultado >>> ', res);
            if(res) {
                //console.log('resultado IF');
                return true;
            } else {
                //console.log('resultado else');
                return false;
            }
        }).catch(function(e) {
            throw new Error('Failed');
        });
    }
}
