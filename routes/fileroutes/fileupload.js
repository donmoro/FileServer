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
                error: 'FILE_IS_NOT_SET'
            }
        });
    }

    const fileName = new Date().getTime().toString();
    const extension = fileExtension(req.files.file.name);

    fs.writeFile('D:\\uploads\\' + fileName + "." + extension, req.files.file.data, err => {

        if (err) {
            res.status(400).send({
                data: {
                    error: err
                }
            });
        }

        const fileModel = new FileModel({
            fileName: fileName + "." + extension,
            originalName: req.files.file.name,
            size: req.files.file.size,
            upload: new Date().getTime(),
            ip: requestIp.getClientIp(req),
            mime: mime.lookup(req.files.file.name),
            isActive: true
        });

        console.log(fileModel);

        fileModel.save(err => {
            if (err) {
                console.log(err);
                res.status(400).send({
                    data: {
                        error: err
                    }
                });
            }
            else {
                res.send({
                    data: {
                        file: new FileResponse(fileModel._id, fileModel.fileName, fileModel.originalName, fileModel.mime)
                    }
                })
                ;
            }
        });

    })

});

module.exports = router;