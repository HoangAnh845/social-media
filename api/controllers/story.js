import db from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = `SELECT u.id,u.username,u.avater,s.content,s.category FROM stories AS s JOIN users AS u ON (u.id = s.user_Id) LEFT JOIN relationships AS r ON (s.user_Id = r.sender_Id AND r.recipient_Id = ?) LIMIT 10`;

        db.query(q, [userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

export const addStory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO stories( `user_Id`, `content`,`created_at`,`category`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.content,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            req.body.category
        ];
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Story has been created.");
        });
    });
};

export const deleteStory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM stories WHERE `id`=? AND `userId` = ?";

        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if (data.affectedRows > 0)
                return res.status(200).json("Story has been deleted.");
            return res.status(403).json("You can delete only your story!");
        });
    });
};