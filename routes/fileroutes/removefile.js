const router = require('express').Router();
const fileModel = require('../../models/file');
const responseFileModel = require('../../models/response/file');

router.get('/remove/:fileId', (req, res) => {

    const fileId = req.params.fileId;

    fileModel.findById(fileId, (err, result) => {

        if (err) {
            res.status(400).send({
                data: {
                    error: err
                }
            });
            return;
        }

        if (!result || !result.isActive) {
            res.status(404).send({
                data: {
                    error: "FILE_NOT_FOUND"
                }
            });
            return;
        }

        result.isActive = false;

        result.save(err => {

            if (err) {
                res.status(400).send({
                    data: {
                        error: err
                    }
                });
                return;
            }

            res.send({
                data: {
                    file: new responseFileModel(result._id, result.fileName, result.originalName, result.mime),
                    success: true
                }
            });

        });


    });

});

module.exports = router;