export const RequiredBody = ( ...fields ) => {
    return ( req, res, next ) => {
        try {
            const ok = fields.every (field => req.body.hasOwnProperty(field) && req.body[field] && req.body [field] != "");
            if (!ok) {
                return res.redirect(`/error?error=${encodeURI("Datos ingresados no válidos")}`);
            }
            next();
        } catch (error) {
            return res.redirect(`/error?error=${encodeURI(`${error}`)}`)
        };
    };
};

export const Logged = () => {
    return(req, res, next) => {
        ! req.session.user ? res.redirect('/login') : next();
    } 
}