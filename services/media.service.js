const { APP_CONFIG } = require("../config/app.config");
const ImageKit = require("imagekit");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {
  IMAGEKIT_ENDPOINT_URL,
  IMAGEKIT_INSTANCE_ID,
  IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY,
} = APP_CONFIG;

// register or make image kit instance
var imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_ENDPOINT_URL,
});

// upload
async function upload({ files, folderName }) {
  try {
    if (Array.isArray(files)) {
      const promises = [];
      for (const f of files) {
        const imagekitFileParam = Buffer.from(f.src);
        promises.push(
          imagekit.upload({
            file: imagekitFileParam,
            fileName: f.fileName,
            folder: folderName
          })
        );
      }
      var results = await Promise.all(promises);
      //  const urls=results.map((result)=>result.url)
      //  console.log(results);
      return { status: 1, message: "success", results: results };
    } else {
      throw new Error("Upload failed due to invalid parameter!")
    }
  } catch (error) {
    console.log({
      info: "Erro while uploading file",
      error,
      message: error?.message,
    });
  }
}

//uploadOneFile

async function uploadOneFile({ file, folderName }) {
  try {
    if (file) {
      const imagekitFileParam = Buffer.from(file.src);
      var result = await imagekit.upload({
        file: imagekitFileParam,
        fileName: file.fileName,
        folder: folderName
      })

      console.log(result);
      return { status: 1, message: "success", url: result.url };
    } else {
      throw new Error("Upload failed due to invalid parameter!")
    }
  } catch (error) {
    console.log({
      info: "Erro while uploading file",
      error,
      message: error?.message,
    });
  }
}

// generate url
async function generateFileUrl(file_id) {
  try {
    const fileDetails = await imagekit.getFileDetails(file_id);
    if (!fileDetails) {

      throw new Error("file Url not found");
    }
    var fileUrl = fileDetails.url;
    return { message: "success", Url: fileUrl }

  } catch (error) {
    console.log("error generating the file:", error.message);
    throw error;
  }
}


// download

async function downloadFile(file_id) {
  try {
    const fileDetails = await imagekit.getFileDetails(file_id);


    if (!fileDetails) {
      throw new Error("file Url not found");
    }

    var fileUrl = fileDetails.url;
    const fileName = fileDetails.name || 'downloaded_file';

    fileUrl = fileUrl.split('?')[0];

    const fileExt = path.extname(fileUrl);
    const downloadsDirPath = path.join(__dirname, '..', 'downloads');

    if (!fs.existsSync(downloadsDirPath)) {
      fs.mkdirSync(downloadsDirPath);
    }

    console.log(fileUrl);

    const fullFilePath = path.join(downloadsDirPath, `${fileName}${fileExt}`);

    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
    });
    const writer = fs.WriteStream(fullFilePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('file downloaded successfully to', fullFilePath);
        resolve({ message: "File downloaded successfully", path: fullFilePath });
      })
      writer.on('error', reject);
      // reject("");
      //reject({ message: "Error during file download", path:"" });
    })


  } catch (error) {
    console.log("error downloading the file:", error.message);
    throw error;
  }
}

async function deleteFile(fileUrl) {
  try {
    const filePath = new URL(fileUrl).pathname;
    const fileName = filePath.split('/').pop(); 

    // Search for the file by its name
    const fileIdResponse = await imagekit.listFiles({
      name: fileName, // Search by file name
    });

    if (fileIdResponse.length > 0) {
      const fileId = fileIdResponse[0].fileId;

      const deleteResponse = await imagekit.deleteFile(fileId);
      console.log(`File deleted successfully: ${fileUrl}`);
      return { status: 1, message: "File deleted successfully" };
    } else {
      console.log(`File not found: ${fileUrl}`);
      return { status: 0, message: "File not found" };
    }

  } catch (error) {

    console.log(error)
    throw error;
  }

}
// get file details

module.exports.uploadService = {
  upload,
  generateFileUrl,
  downloadFile,
  uploadOneFile,
  deleteFile
};
