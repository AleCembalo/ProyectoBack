import * as url from 'url';

const config = {
    // SERVER: 'Local',
    SERVER: 'Remote',
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL('../',
        import.meta.url)),
    get UPLOAD_DIR() {
        return `${this.DIRNAME}/public/img`
    },
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/ecommerce',
    MONGODB_URI: 'mongodb+srv://CoderBack:coderback2024@clustercoder.7swfcjo.mongodb.net/ecommerce',
    SECRET: 'coder2024',
    PRODUCTS_PER_PAGE: 10,
    GITHUB_CLIENT_ID: 'Iv23liqZjFhkaxU0ocIM',
    GITHUB_CLIENT_SECRET: '64841f59fd26cfc4ab4582c6b2a92128f1d71dd4',
    GITHUB_CALLBACK_URL: 'http://localhost:8080/api/sessions/ghlogincallback'
}

export default config;