const router = require('express').Router();
const requestIp = require('request-ip');
const UserModel = require('../../models/user');
const bcrypt = require('bcrypt');
const UserResponse = require('../../models/response/user');

router.post('/registration', (req, res) => {

    if (isRequiredFields(req.body)) {

        const email = req.body.email.toLowerCase();

        UserModel.findOne({email: email}, '_id', (err, id) => {
            if (err) {
                return res.status(500).send({
                    data: {
                        errorMessage: 'Internal Server Error',
                        error: err
                    }
                });
            } else if (!id) {

                bcrypt.hash(req.body.password, 6, (error, hash) => {
                    if (error) {
                        res.status(500).send({
                            errorMessage: 'Internal Server Error',
                            error
                        });
                        return;
                    }

                    const userModel = new UserModel({
                        email: email,
                        password: hash,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        dateOfBirth: req.body.dateOfBirth,
                        sex: req.body.sex,
                        isActive: true,
                        registrationDate: new Date().getTime(),
                        updated: null,
                        ip: requestIp.getClientIp(req)
                    });

                    userModel.save().then((userItem, error) => {
                        if (error) {
                            res.status(500).send({
                                data: {
                                    errorMessage: 'Error While Saving',
                                    error
                                }
                            });
                            return;
                        }

                        res.send({
                            data: {
                                user: new UserResponse(userItem.email, userItem.firstName, userItem.lastName, userItem.dateOfBirth, userItem.sex)
                            }
                        });

                    });
                });
            } else {
                res.status(400).send({
                    data: {
                        errorMessage: 'USER_ALREADY_EXIST!',
                        error: null
                    }
                })
            }

        });


    } else {
        res.status(400).send({
            data: {
                errorMessage: 'REQUIRED_FIELDS_IS_NOT_SET',
                error: null
            }
        });
    }

});

function isRequiredFields(obj) {

    // სავალდებულო ველები
    const fields = ['email', 'password', 'firstName', 'lastName', 'dateOfBirth', 'sex'];

    let i = 0;

    for (const key in obj) {

        let index = fields.find(element => {
            return element === key;
        });

        if (!index) {
            return false;
        }

        i++;

    }

    return i === fields.length;

}

module.exports = router;