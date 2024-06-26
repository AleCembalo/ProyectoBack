import * as url from 'url';

const config = {
    APP_NAME: 'proyectocembalo',
    // SERVER: 'Local',
    SERVER: 'Remote',
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL('../src/', import.meta.url)),
    get UPLOAD_DIR() {
        return `${this.DIRNAME}/public/img`
    },
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/ecommerce',
    MONGODB_URI: 'mongodb+srv://CoderBack:coderback2024@clustercoder.7swfcjo.mongodb.net/ecommerce',
    MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
    SECRET: 'coder2024',
    PRODUCTS_PER_PAGE: 10,

    GITHUB_CLIENT_ID: 'Iv23liqZjFhkaxU0ocIM',
    GITHUB_CLIENT_SECRET: '64841f59fd26cfc4ab4582c6b2a92128f1d71dd4',
    GITHUB_CALLBACK_URL: 'http://localhost:8080/api/auth/ghlogincallback',

    GOOGLE_CLIENT_ID: '157928750794-3lgdn3a8kodol11kvk5ddapmuh3p3dhr.apps.googleusercontent.com',
    GOOGLE_CLIENT_SECRET: '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',
    GOOGLE_CALLBACK_URL: 'http://localhost:8080/api/auth/goologincallback'
}

export default config;
