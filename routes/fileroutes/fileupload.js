const router = require('express').Router();
const fs = require('fs');
const requestIp = require('request-ip');
const fileExtension = require('file-extension');
const mime = require('mime-types');

const FileModel = require('../../models/file');
const FileResponse = require('../../models/response/file');

router.post('/upload', (req, res) => {

    if (!req.files) {
        return res.status(400).send({
            data: {
                errorMessage: 'FILE_IS_NOT_SET',
                error: null
            }
        });
    }

    const fileName = new Date().getTime().toString();
    const extension = fileExtension(req.files.file.name);
    const fileNameWithExtension = fileName + '.' + extension;

    fs.writeFile('D:\\uploads\\' + fileNameWithExtension, req.files.file.data, err => {

        if (err) {
            return res.status(500).send({
                data: {
                    errorMessage: 'ERROR_WHILE_WRITE_FILE',
                    error: err
                }
            });
        }

        const fileModel = new FileModel({
            fileName: fileNameWithExtension,
            originalName: req.files.file.name,
            size: req.files.file.size,
            upload: new Date().getTime(),
            ip: requestIp.getClientIp(req),
            mime: mime.lookup(req.files.file.name),
            isActive: true
        });

        console.log(fileModel);

        fileModel.save(error => {

            if (error) {
                console.log(error);
                return res.status(400).send({
                    data: {
                        errorMessage: 'ERROR_WHILE_SAVE_FILE_INFO',
                        error
                    }
                });
            }

            res.send({
                data: {
                    file: new FileResponse(fileModel._id, fileModel.fileName, fileModel.originalName, fileModel.mime)
                }
            });

        });

    });

});

module.exports = router;