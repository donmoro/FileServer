const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redisSession = require('node-redis-session');

const app = express();

const db = require('./services/dbconnect');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload()); // multipart form data

/* Node - ის Memory - ში Session - ების შენახვა */
// app.use(
//     session({
//         secret: 'iy98hcbh489n38984y4h498',
//         saveUninitialized: false,
//         resave: true,
//         rolling: true,
//         cookie: {
//             expires: new Date(Date.now() + 60 * 60 * 1000)
//         }
//     })
// );

/* Redis - ის Memory - ში Session - ების შენახვა */
app.use(cookieParser());
app.use(redisSession({
    cookieName: 'FileServerSessionId',
    expireTime: 24 * 3600 * 1000
}));

app.use((req, res, next) => {

    if ((req.url === '/api/login' || req.url === '/api/registration') && req.session.user) {
        res.status(400).send({
            data: {
                errorMessage: 'YOU_ARE_ALREADY_LOG_IN',
                error: null
            }
        });
    } else if (req.session.user) {
        next();
    } else if (req.url === '/api/login' || req.url === '/api/registration') {
        next();
    } else {
        res.status(401).send({
            data: {
                errorMessage: 'AUTHORIZATION_FAILED',
                error: null
            }
        });
    }
});

app.all('/api/logout', (req, res) => {
    delete req.session.user;
    //req.session.destroy();
    res.status(200).send({
        data: {
            message: 'Logout successful'
        }
    });
});

app.use('/api', require('./utils/api'));

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;