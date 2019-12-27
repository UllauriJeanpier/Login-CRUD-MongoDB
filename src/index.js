const express = require('express');
const path = require('path');
const exphbs =require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');         // srive para mandar mensajes a
const passport = require('passport');

const app = express();
require('./database');
require('./config/passport');

// settings 

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

app.set('view engine', 'hbs');      // ojo

// Middlewares 

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));         // para que reconozca mas metodos como put o delete mediante el nombre '_method'
app.use(session({
    secret: 'clavesecreta',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());      //DEben ir despues de session
app.use(passport.session());

app.use(flash());           // Este debe ir despues de passport 

// Global Variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.errors_msg = req.flash('errors_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

// routes

app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))

// static files  (unicos archivos css)


app.use(express.static(path.join(__dirname, 'public')));

// starting server

app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
})