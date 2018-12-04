export class Paciente {
    id: number;
    avatar: string;
    nome: string;
    nascimento:string;
    nascimento_formatado:string;
    sexo:string;
    telefone:string;
    ocupacao:string;
    cep:string;
    endereco:string;
    numero:string;
    cpf:string;
    cidade:string;
    estado:string;

    constructor(values: Object = {}) {
         Object.assign(this, values);
    }

}
