export class Model {
  constructor(objeto?) {
      Object.assign(this, objeto);
  }
}
//classe usuario extendendo a classe Model
export class User extends Model {
    id: number;
    nome: string;
    email: string;
    avatar: string;
}
