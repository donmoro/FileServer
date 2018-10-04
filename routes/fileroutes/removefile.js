const router = require('express').Router();
const fileModel = require('../../models/file');
const responseFileModel = require('../../models/response/file');

router.get('/remove/:fileId', (req, res) => {

    const fileId = req.params.fileId;

    fileModel.findById(fileId, (err, result) => {

        if (err) {
            return res.status(400).send({
                data: {
                    errorMessage: 'ERROR_WHILE_FIND_FILE',
                    error: err
                }
            });
        }

        if (!result || !result.isActive) {
            return res.status(404).send({
                data: {
                    errorMessage: 'FILE_NOT_FOUND',
                    error: null
                }
            });
        }

        result.isActive = false;

        result.save(err => {

            if (err) {
                return res.status(400).send({
                    data: {
                        errorMessage: 'ERROR_WHILE_SAVE_FILE',
                        error: err
                    }
                });
            }

            res.send({
                data: {
                    file: new responseFileModel(result._id, result.fileName, result.originalName, result.mime)
                }
            });

        });

    });

});

module.exports = router;