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
            let passwordCheck = bcrypt.compareSync(password, userData.password);
            if (passwordCheck) {
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
        } else {
            res.status(401).send({
                data: {
                    message: 'Invalid login credentials'
                }
            });
        }
    })

});

module.exports = router;