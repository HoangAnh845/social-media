import { Storage } from "@google-cloud/storage";


export const uploadImage = async (req, res) => {
  let projectId = "sonorous-crane-399802"; // Get this from Google Cloud
  let keyFilename = "mykey.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
  const storage = new Storage({
    projectId,
    keyFilename,
  });
  const bucket = storage.bucket("storage-upload");
  try {
    if (req.body) {
      console.log("File found, trying to upload...", req.body.fileName);
      const blob = bucket.file(req.body.fileName);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        res.status(200).send("Success");
        console.log("Success");
      });
      blobStream.end();
    } else throw "error with img";
  } catch (err) {
    res.status(500).send(err);
  }
}