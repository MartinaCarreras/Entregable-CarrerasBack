import * as url from 'url';
import { Command } from 'commander';
import dotenv from 'dotenv';

const CommandLine = new Command();
dotenv.config({ path: 'envs/.env' });

CommandLine
    .option('--port <port>', 'PORT', `${process.env.ePORT}`)
    .option('--personal_secret <personal_secret>', 'PERSONAL_SECRET', `${process.env.ePERSONAL_SECRET}`)
    .option('--mongodb_uri <mongodb_uri>', 'MONGODB_URI', `${process.env.eMONGODB_URI}`)
    .option('--github_client_id <github_client_id>', 'GITHUB_CLIENT_ID', `${process.env.eGITHUB_CLIENT_ID}`)
    .option('--github_client_secret <github_client_secret>', 'GITHUB_CLIENT_SECRET', `${process.env.eGITHUB_CLIENT_SECRET}`)
    .option('--github__callback_url <github__callback_url>', 'GITHUB_CALLBACK_URL', `${process.env.eGITHUB_CALLBACK_URL}`)
CommandLine.parse();

const path = '../envs/.env';

const ClOptions = CommandLine.opts();
process.env.eGITHUB_CLIENT_ID

const { port, personal_secret, mongodb_uri, github_client_id, github_client_secret, github__callback_url } = ClOptions


export const config = {
    DIRNAME: url.fileURLToPath(new URL('.', import.meta.url)),
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` },
    PORT: port,
    PERSONAL_SECRET: personal_secret,
    MONGODB_URI: mongodb_uri,
    GITHUB_CLIENT_ID: github_client_id,
    GITHUB_CLIENT_SECRET: github_client_secret,
    GITHUB_CALLBACK_URL: github__callback_url

};