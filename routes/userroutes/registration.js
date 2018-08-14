const router = require('express').Router();
const fs = require('fs');
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
                        error: err
                    }
                });
            } else if (!id) {

                const userModel = new UserModel({
                    email: email,
                    password: bcrypt.hashSync(req.body.password, 6),
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
                        return res.status(500).send({
                            data: {
                                error: error
                            }
                        });
                    } else {
                        res.send({
                            data: {
                                user: new UserResponse(userItem.email, userItem.firstName, userItem.lastName, userItem.dateOfBirth, userItem.sex)
                            }
                        })
                    }
                })
            } else {
                res.status(400).send({
                    data: {
                        error: 'USER_ALREADY_EXIST!'
                    }
                })
            }

        });


    }
    else {
        res.status(400).send({
            data: {
                error: 'REQUIRED_FIELDS_IS_NOT_SET'
            }
        });
    }

});

function isRequiredFields(obj) {

    // სავალდებულო ველები
    const fields = ['email', 'password', 'firstName', 'lastName', 'dateOfBirth', 'sex'];

    let i = 0;

    for (const key in obj) {

        var index = fields.find(element => {
            return element === key;
        });

        if (typeof index === 'undefined' || obj[index] == null || obj[index] === '') {
            return false;
        }

        i++;

    }

    return i === fields.length;

}

module.exports = router;