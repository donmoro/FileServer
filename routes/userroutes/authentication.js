const bcrypt = require('bcrypt');
const UserModel = require('../../models/user');
const router = require('express').Router();

router.post('/login', (req, res) => {

    let {email, password} = req.body;

    UserModel.findOne({email: email}, 'email password', (err, userData) => {
        if (!err) {
            console.log(userData);
            if (userData == null) {
                res.status(401).send({
                    data: {
                        message: 'Invalid login credentials'
                    }
                });
                return;
            }
            bcrypt.compare(password, userData.password, (error, response) => {
                if (error) {
                    res.status(400).send({
                        errorMessage: "Internal Server Error",
                        error: error
                    });
                    return;
                }
                if (response) {
                    req.session.user = {
                        email: userData.email,
                        id: userData._id
                    };
                    req.session.user.expires = new Date(
                        Date.now() + 3 * 24 * 3600 * 1000
                    );
                    res.status(200).send({
                        data: {
                            message: 'You Are logged in, Welcome!'
                        }
                    });
                } else {
                    res.status(401).send({
                        data: {
                            message: 'Incorrect password'
                        }
                    });
                }
            });
        } else {
            res.status(401).send({
                data: {
                    errorMessage: 'Invalid login credentials',
                    error: err
                }
            });
        }
    })

});

module.exports = router;