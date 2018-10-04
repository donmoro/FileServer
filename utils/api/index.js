const router = require('express').Router();

router.use('', require('../../routes/fileroutes/fileupload'));
router.use('', require('../../routes/fileroutes/getfile'));
router.use('', require('../../routes/fileroutes/removefile'));
router.use('', require('../../routes/userroutes/registration'));
router.use('', require('../../routes/userroutes/authentication'));

module.exports = router;