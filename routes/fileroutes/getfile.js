const router = require('express').Router();
const fs = require('fs');
const fileModel = require('../../models/file');
const FileResponse = require('../../models/response/file');

router.get("/file/id/:id", function (req, res) {

    const fileId = req.params.id;

    fileModel.findById(fileId, (err, result) => {

        if (err) {
            res.status(400).send({
                "data": {
                    "error": err
                }
            });
            return;
        }

        if (!result || !result.isActive) {
            res.status(404).send({
                "data": {
                    "error": "FILE_NOT_FOUND"
                }
            });
            return;
        }

        res.setHeader("Content-Type", result.mime);
        fs.createReadStream("D:\\uploads\\" + result.fileName).pipe(res);

    });

});

router.get("/file/search/", function (req, res) {

    let fileName = req.query.fileName;
    let fileContentType = req.query.contentType;

    if ((!fileName && !fileContentType) || (!fileName && fileContentType)) {
        res.status(400).send({
            "data": {
                "error": "REQUIRE_PARAMS"
            }
        });
        return;
    }

    if (fileName)
        fileName = fileName.substring(1, fileName.length - 1);

    if (fileContentType)
        fileContentType = fileContentType.substring(1, fileContentType.length - 1);

    if (fileName && !fileContentType) {

        fileModel.find({originalName: fileName, isActive: true}, function (err, result) {

            callback(err, result, res);

        });

    }

    if (fileName && fileContentType) {

        fileModel.find({originalName: fileName, mime: fileContentType, isActive: true}, (err, result) => {

            callback(err, result, res);

        });

    }

});

function callback(err, result, res) {

    if (err) {
        res.status(400).send({
            "data": {
                "error": err
            }
        });
        return;
    }

    if (!result || isEmpty(result)) {
        res.status(404).send({
            "data": {
                "error": "FILE_NOT_FOUND"
            }
        });
        return;
    }

    if (result.length !== 1) {

        let fileResponse = [];

        for (let i = 0; i < result.length; i++) {
            fileResponse[i] = new FileResponse(result[i]._id, result[i].fileName, result[i].originalName, result[i].mime);
        }

        res.send({
            "data": {
                "result": fileResponse
            }
        });
    }
    else {
        res.setHeader("Content-Type", result[0].mime);
        fs.createReadStream("D:\\uploads\\" + result[0].fileName).pipe(res);
    }

}

function isEmpty(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = router;