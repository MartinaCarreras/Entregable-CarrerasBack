import passport from "passport";
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'

import { config } from "../config.js";
import MDBUserManager from "../dao/UserManager.mdb.js";
import model from '../dao/models/users.model.js'

const localStrategy = local.Strategy;
const userManager = new MDBUserManager(model);

const AuthConfig = () => {
    passport.use('login', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                const result = await userManager.login(username, password);
                console.log(result)
                if (Object.keys(result).includes('error')) {
                    return done(null, false);
                } else {
                    return done(null, result);
                }
            } catch {
                return done(err, false);
            }
        }
    ))

    passport.use('loGit', new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile._json?.email || null;
                console.log(email);
                if (email) {
                    let resultUser = userManager.loginHub(email, 'none', profile._json.name);
                    return done(null, resultUser);
                }else {return done(new Error('faltan datos'), false)};
            } catch (err) {
                return done(err, false)
            }
        }
        // User.findOrCreate({ githubId: profile.id }, function (err, user) {
        //   return done(err, user);
        // });
    ));

    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                const {firstName, lastName, gender} = req.body;
                let role;
                if (username == 'adminCoder@coder.com' && password == 'adminCod3r123') {role = 'admin'};

                const result = await userManager.register(username, password, firstName, lastName, gender, role)
                if (Object.keys(result).includes('error')) {
                    return done('Error al registrarse', false);
                } else {
                    return done(null, result)
                }
            } catch (err) {
                return done(err, false);
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user);
    });
        
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

export default AuthConfig;