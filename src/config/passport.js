const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new localStrategy ({       // definiendo nueva estretegia de localizacion
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email});
    if (!user){
        return done(null, false, {message: 'not user found'})       //  los parametros son (null: para el error, false: porque no hay usuario, mensaje)
    }else {
        const match = await user.matchPassword(password);
        if (match){ 
            return done(null, user)
        } else {
            return done(null, false, {message: 'Incorrect password'});
        }
    }
}));

passport.serializeUser((user, done) => {          // cuando el usuario se logea se almacena en seccion su id
    done(null, user.id);        
});

passport.deserializeUser((id, done) => {           // proceso inverso, se toma el id para generar el usuario
    User.findById(id, (err, user) => {
        done(err, user);
    });
});