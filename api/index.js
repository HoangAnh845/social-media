import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { Storage } from "@google-cloud/storage";
import storyRoutes from "./routes/stories.js";
import uploadImageRoutes from "./routes/uploadImage.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";


const app = express();
//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);
app.use(cookieParser());

// Xác định lưu trữ tệp tin được tải
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "../client/public/uploads");
//     },
//     filename: function (req, file, cb) {
//         const timestamp = Date.now();
//         const randomString = Math.random().toString(36).substring(2, 8);
//         const newFileImage = `${file.originalname}-${timestamp}-${randomString}`;
//         cb(null, newFileImage);
//     },
// });


// Xử lý tải tệp dựa trên cấu hình ở trên
const upload = multer({
    // storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
    }
});

// Streams file upload to Google Storage
app.post("/api/upload", upload.single("myImage"), (req, res) => {
    let projectId = "sonorous-crane-399802"; // Get this from Google Cloud
    let keyFilename = "mykey.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
    const storage = new Storage({
        projectId,
        keyFilename,
    });
    const bucket = storage.bucket("storage-upload");
    try {
        if (req.file) {
            console.log("File found, trying to upload...");
            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on("finish", () => {
                res.status(200).send({ satus: "Success", image_url: `https://storage.cloud.google.com/storage-upload/${req.file.originalname}` });
                console.log("Success");
            });
            blobStream.end(req.file.buffer);
        } else throw "error with img";
    } catch (error) {
        res.status(500).send(error);
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/uploadImage", uploadImageRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);

app.listen(8800, () => {
    console.log("API working");
})