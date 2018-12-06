
const ISPROD = true;

const DEV: string = 'http://localhost:8003/api/v1/';
const PROD: string = 'http://reduk.com.br/api/v1/';

const API: string = ISPROD ? PROD : DEV;

export var CONSTANTS = {
 API_ENDPOINT: API,
 API_ENDPOINT_LOGIN: API+'auth/login',
 API_ENDPOINT_USER: API+'user',
 API_ENDPOINT_USER_UPLOAD: API+'upload',
 API_ENDPOINT_PACIENTE: API+'paciente',
 API_ENDPOINT_PACIENTE_STORE: API+'paciente',
 API_ENDPOINT_MEDIDAS: API+'medidas',
 API_ENDPOINT_MEDIDAS_STORE: API+'medidas',
 API_ENDPOINT_PLANOS: API+'planos',
 API_ENDPOINT_ATIVIDADES: API+'atividades',
 API_ENDPOINT_ALIMENTOS: API+'alimentos-evitados',
 API_ENDPOINT_INJESTAO: API+'injestao',
 API_ENDPOINT_RECOMENDACOES: API+'recomendacoes',
 API_ENDPOINT_CONSULTAS: API+'consultas',
 API_ENDPOINT_MEDIDAS_DELETE: API+'medidas/delete/'
};
