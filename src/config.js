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

dotenv.config({path: '../.env'});

const config = {
    APP_NAME: 'proyectocembalo',
    // SERVER: 'Local',
    SERVER: 'Remote',
    PORT: process.env.PORT || clOptions.port || 5050,
    DIRNAME: url.fileURLToPath(new URL('../src/', import.meta.url)),
    get UPLOAD_DIR() {
        return `${this.DIRNAME}/public/img`
    },
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    SECRET: process.env.SECRET,
    PRODUCTS_PER_PAGE: 10,

    GITHUB_CLIENT_ID: process.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

    GOOGLE_CLIENT_ID: process.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
}

export default config;
