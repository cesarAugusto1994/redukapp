//classe usuario extendendo a classe Model
export class User {
    id: number;
    nome: string;
    email: string;
    avatar: string;

    constructor(values: Object = {}) {
         Object.assign(this, values);
    }
}
