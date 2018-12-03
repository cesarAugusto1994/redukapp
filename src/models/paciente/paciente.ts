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
/*
    constructor(id: number, nome: string, nascimento:string,
      sexo:string, telefone:string, ocupacao:string,
      cep:string, endereco:string, numero:string,
      cpf:string, cidade:string, estado:string) {

        super();

        this.id = id;

        this.nome = nome;
        this.nascimento = nascimento;
        this.sexo = sexo;
        this.telefone = telefone;
        this.ocupacao = ocupacao;
        this.cep = cep;
        this.endereco = endereco;
        this.numero = numero;
        this.cpf = cpf;
        this.cidade = cidade;
        this.estado = estado;

    }
    */
}
