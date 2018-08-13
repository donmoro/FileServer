const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fileUpload = require("express-fileupload");
const session = require('express-session');

const app = express();

const db = require("./services/dbconnect");
const fileUploadRoute = require("./routes/fileroutes/fileupload");
const getFile = require("./routes/fileroutes/getfile");
const removeFile = require("./routes/fileroutes/removefile");
const registration = require("./routes/userroutes/registration");
const authentication = require("./routes/userroutes/authentication");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload()); // multipart form data
app.use(
    session({
        secret: "iy98hcbh489n38984y4h498",
        resave: true,
        saveUninitialized: false
    })
);
app.use((req, res, next) => {
    if (req.session.user) {
        next();
    } else if (req.url === "/api/login" || req.url === "/api/registration") {
        next();
    } else {
        res.status(401).send({
            data: {
                error: 'Authorization failed! Please login'
            }
        });
    }
});

app.all('/api/logout', (req, res) => {
    delete req.session.user;
    req.session.destroy();
    res.status(200).send({
            data: {
                error: 'Logout successful'
            }
        }
    )
});

app.use("/api", fileUploadRoute);
app.use("/api", getFile);
app.use("/api", removeFile);
app.use("/api", registration);
app.use("/api", authentication);

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