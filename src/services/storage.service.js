const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(fileBuffer, fileName) {
  try {
    const result = await imagekit.files.upload({
      file: fileBuffer.toString("base64"),
      fileName: fileName
    });

    return result;
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw error;
  }
}

async function deleteFile(fileId) {
  return await imagekit.files.delete(fileId);
}

module.exports = {
  uploadFile,
  deleteFile
};