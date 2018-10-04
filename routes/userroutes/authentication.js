const bcrypt = require('bcrypt');
const UserModel = require('../../models/user');
const router = require('express').Router();

router.post('/login', (req, res) => {

    let {email, password} = req.body;

    UserModel.findOne({email: email}, 'email password', (err, userData) => {
        if (!err) {
            console.log(userData);
            if (userData == null) {
                return res.status(401).send({
                    data: {
                        errorMessage: 'INVALID_LOGIN_CREDENTIALS',
                        error: null
                    }
                });
            }
            bcrypt.compare(password, userData.password, (error, response) => {
                if (error) {
                    return res.status(400).send({
                        errorMessage: 'INTERNAL_SERVER_ERROR',
                        error
                    });
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
                            message: 'YOU_ARE_LOGGED_IN',
                            success: true
                        }
                    });
                } else {
                    res.status(401).send({
                        data: {
                            errorMessage: 'INCORRECT_PASSWORD',
                            error: null
                        }
                    });
                }
            });
        } else {
            res.status(500).send({
                data: {
                    errorMessage: 'INTERNAL_SERVER_ERROR',
                    error: err
                }
            });
        }
    })

});

module.exports = router;