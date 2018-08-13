const router = require('express').Router();
const fs = require('fs');
const requestIp = require('request-ip');
const UserModel = require('../../models/user');
const bcrypt = require('bcrypt');
const UserResponse = require('../../models/response/user');

router.post('/registration', (req, res) => {

    console.log(req.body);

    if (isRequiredFields(req.body)) {

        const userModel = new UserModel({
            email: req.body.email.toLowerCase(),
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

        userModel.save().then(error => {
            if (error) {
                return res.send({
                    data: {
                        user: new UserResponse(userModel.email, userModel.firstName, userModel.lastName, userModel.dateOfBirth, userModel.sex)
                    }
                });

            } else {
                if (error.code === 11000) {
                    return res.status(409).send({
                        data: {
                            error: 'USER_ALREADY_EXIST!'
                        }
                    })
                } else {
                    console.log(JSON.stringify(error, null, 2));
                    return res.status(500).send({
                        data: {
                            error: 'ERROR_SIGN_UP_USER'
                        }
                    })
                }
            }
        });

    }
    else {
        res.status(400).send({
            data: {
                "error": "REQUIRED_FIELDS_IS_NOT_SET"
            }
        });
    }

});

function isRequiredFields(obj) {

    var fields = ['email', 'password', 'firstName', 'lastName', 'dateOfBirth', 'sex'];

    var i = 0;

    for (var key in obj) {

        var index = fields.find((element) => {
            return element === key;
        });

        if (index === undefined || obj[index] == null || obj[index] === '') {
            return false;
        }

        i++;

    }

    return i === fields.length;

}

module.exports = router;