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
    // MONGODB_URI: 'mongodb://127.0.0.1:27017/ecommerce'
    MONGODB_URI: 'mongodb+srv://CoderBack:coderback2024@clustercoder.7swfcjo.mongodb.net/ecommerce'
}

export default config;