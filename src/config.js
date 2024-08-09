import * as url from 'url';
import { Command } from 'commander';
import dotenv from 'dotenv';

const commandLine = new Command();
commandLine
    .option('--mode <mode>')
    .option('--port <port>')
    .option('--setup <number>')
commandLine.parse();
const clOptions = commandLine.opts();

const environmentFile = clOptions.mode === 'devel' ? '.env.devel' : '.env.prod';

dotenv.config({path: environmentFile });

const config = {
    APP_NAME: 'proyectocembalo',
    SERVER: process.env.SERVER,
    PORT: process.env.PORT || clOptions.port || 5050,
    DIRNAME: url.fileURLToPath(new URL('../src/', import.meta.url)),
    get UPLOAD_DIR() {
        return `${this.DIRNAME}/public/img`
    },
    MONGODB_URI: process.env.MONGODB_URI,
    PERSISTENCE: process.env.PERSISTENCE || 'mongo',
    MODE: process.env.MODE || 'dev',
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    SECRET: process.env.SECRET,
    PRODUCTS_PER_PAGE: 10,

    GMAIL_APP_USER: 'alejandracembalo@gmail.com',
    GMAIL_APP_PASS: 'gstu waud dddh nkpt',

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
}

export const errorsDictionary = {
    UNHANDLED_ERROR: { code: 0, status: 500, message: 'Error no identificado'},
    ROUTING_ERROR: { code: 1, status: 404, message: 'No se encuentra el endpoint solicitado'},
    FEW_PARAMETERS: { code: 2, status: 400, message: 'Faltan parámetros obligatorios'},
    INVALID_MONGOID_FORMAT: { code: 3, status: 400, message: 'El Id no contiene un formato válido de MongoDB'},
    INVALID_PARAMETER: { code: 4, status: 400, message: 'El parámetro ingresado no es válido'},
    INVALID_TYPE_ERROR: { code: 5, status: 400, message: 'No corresponde el tipo de dato'},
    ID_NOT_FOUND: { code: 6, status: 400, message: 'No existe registro con ese Id'},
    PAGE_NOT_FOUND: { code: 7, status: 404, message: 'No se encuentra la página solicitada'},
    DATABASE_ERROR: { code: 8, status: 500, message: 'No se puede conectar a la base de datos'},
    INTERNAL_ERROR: { code: 9, status: 500, message: 'Error interno de ejecución del servidor'},
    RECORD_CREATION_ERROR: { code: 10, status: 500, message: 'Error al intentar crear el registro'},
    ACCESS_ERROR: { code: 11, status: 401, message: 'No tiene permisos para acceder al recurso'},
    RECORD_CREATION_OK: { code: 12, status: 200, message: 'Registro creado'},
    LOGIN_ERROR: { code:13, status: 400, message: 'Es necesario iniciar sesión'},
}

export default config;