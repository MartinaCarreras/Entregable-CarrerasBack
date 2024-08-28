import { Router, urlencoded } from "express";
import AuthConfig from '../auth/passport.config.js'
import passport from "passport";

import MDBCartManager from "../dao/CartManager.mdb.js";
import cartModel from '../dao/models/carts.model.js'

import { RequiredBody, Logged } from '../utils.js' // Middlewares

const router = Router();
AuthConfig();
const cartManager = new MDBCartManager(cartModel);


router.post('/register', RequiredBody('email', 'firstName', 'lastName', 'gender', 'password') , passport.authenticate('register'), async (req,res) =>{
    try {
        req.session.user = req.user;
        res.redirect('/products');
    } catch {
        res.redirect(`/error?error=${encodeURI('Error al registrarse')}`)
    }
});

router.post('/login', passport.authenticate('login'), RequiredBody('email', 'password'), async (req,res) =>{
    try {
        req.session.user = req.user;
        res.redirect('/products')
    } catch {
        res.redirect(`/error?error=${encodeURI(`${error}`)}`);
    }
});

router.get('/loGitHub', passport.authenticate('loGit', {failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}`}), async ( req, res ) => {
});

router.get('/loGit', passport.authenticate('loGit', {failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}`}), async ( req, res ) => {
    try {
        req.session.user = req.user;
        req.session.save(error=>{
            error ? res.redirect(`/error?error=${encodeURI(`${error}`)}`) : res.redirect('/products');
        });
    } catch (error) {
        res.redirect(`/error?error=${encodeURI(`${error}`)}`);
    }
});

router.get('/logout', async (req,res) =>{
    try {
        if (!req.session.user) res.redirect(`/error?error=${encodeURI(`No hay un usuario registrado`)}`);
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        res.redirect(`/error?error=${encodeURI(`${error}`)}`)
    }
});

router.get('/current', Logged(), async ( req, res ) =>{

    const data = await cartManager.getItems(req.session.user._cart_id);
    const answer = {
        firstName: req.session.user.firstName, 
        lastName: req.session.user.lastName, 
        role: req.session.user.role,
        cid: req.session.user._cart_id,
        current : true,
        products: data
    }
    res.render('profile', {...answer})

});

export default router;