import * as url from 'url';

export const config = {
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    MONGODB_URI: 'mongodb+srv://coder_53160:Juan02022014@databases.5w1wslg.mongodb.net/ecommerce'
}