const { uploadService } = require("../services/media.service");
const { imageKitPayloadBuilder } = require("../utils/media.util");

module.exports = (() => {
  const router = require("express").Router();

  router.post("/upload", async (req, res, next) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      const uploadedFile = req.files.iti; // Assuming the file input field is named 'file'

      const uploadPayload = [];

      if (Array.isArray(uploadedFile)) {
        for (const expressUploadedFule of uploadedFile) {
          const { fileName, src } = imageKitPayloadBuilder(expressUploadedFule);
          uploadPayload.push({
            src,
            fileName,
          });
        }
        const response = await uploadService.upload({
          files: uploadPayload,
          folderName: "general"
        });
        res.json(response);
      } else {
        // Get the original file name and extension
        const { fileName, src } = imageKitPayloadBuilder(uploadedFile);
        uploadPayload.push({
          src,
          fileName,
        });
        const response = await uploadService.upload({
          files: uploadPayload,
          folderName: "general"
        });
        res.json(response);
      }
    } catch (execption) {
      console.log(execption);
    }
  });
  //generate url 
  router.get("/getfileUrl/:file_id", async (req, res, next) => {
    try {
      const file_id = req.params.file_id;
      var response = await uploadService.generateFileUrl(file_id);
      //  console.log(response);
      res.json(response)
    } catch (execption) {
      console.log(execption);
    }

  })


  //download file locally 
  router.get("/download/:file_id", async (req, res, next) => {
    try {
      console.log(req.params.file_id);
      const fileId = req.params.file_id
      const response = await uploadService.downloadFile(fileId);
      res.json(response)
    } catch (execption) {
      console.log(execption);
    }
  });

  router.post("/delete", async (req, res, next) => {
    try {

     // console.log(req.params.file_url);
      const fileUrl = req.body.fileUrl;
      const response = await uploadService.deleteFile(fileUrl);
      res.json(response)
    } catch (execption) {
      console.log(execption);
    }
  });

  return router;
})();
