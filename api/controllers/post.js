import db from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (err, userInfo) => {

    if (err) return res.status(403).json("Token is not valid!");
    const q = `SELECT DISTINCT p.*, u.username, u.avater FROM posts AS p JOIN users AS u ON (u.id = p.user_Id) LEFT JOIN relationships AS r ON (p.user_Id = r.sender_Id OR p.user_Id = r.recipient_Id) WHERE (r.recipient_Id=? OR r.sender_Id =?) AND status="accepted" ORDER BY p.created_at DESC`
    // userId !== "undefined"
    //   ? `SELECT p.*, u.username, u.avater FROM posts AS p JOIN users AS u ON (u.id = p.user_Id) WHERE p.user_Id = 16 ORDER BY p.created_at DESC`
    //   : 
    //   ``
    //   `SELECT DISTINCT p.*, u.username, u.avater FROM posts AS p JOIN users AS u ON (u.id = p.user_Id) LEFT JOIN relationships AS r ON (p.user_Id = r.sender_Id) WHERE (r.recipient_Id= 16 OR p.user_Id =16) AND status="accepted" ORDER BY p.created_at DESC `
    //   ;

    const values = [userInfo.id, userInfo.id];
    // userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "INSERT INTO posts(`content`, `image_url`, `user_Id`,`created_at`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.image_url,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM posts WHERE `id`=? AND `user_Id` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};