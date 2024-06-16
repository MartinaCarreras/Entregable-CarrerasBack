import passport from "passport";
import local from 'passport-local'
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

    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField: 'email'},
        async (req, username, password, done) => {
            try {
                const {firstName, lastName, gender} = req.body;
                let role;
                if (email == 'adminCoder@coder.com' && password == 'adminCod3r123') {role = 'admin'};

                const result = await userManager.register(username, password, firstName, lastName, gender, role)
                if (Object.keys(result).includes('error')) {
                    return done(err, false);
                } else {
                    return done(null, result)
                }
            } catch {
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