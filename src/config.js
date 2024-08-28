import * as url from 'url';

export const config = {
    PORT: 8080,
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    MONGODB_URI: 'mongodb+srv://coder_53160:Juan02022014@databases.5w1wslg.mongodb.net/ecommerce',
    GITHUB_CLIENT_ID: 'Iv23liGB5ORaT2x83Mdy',
    GITHUB_CLIENT_SECRET: '837b1c64d7a98800b68741418c29b701282cdf13',
    GITHUB_CALLBACK_URL: 'http://localhost:8080/loGit'

}