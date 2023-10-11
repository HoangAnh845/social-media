import db from "../connect.js";
import jwt from "jsonwebtoken";
import { datainvitations } from "../data/index.js";

// Hàm xác minh token
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, "secretkey", (err, userInfo) => {
            if (err) reject(new Error("Token is not valid!"));
            resolve(userInfo);
        });
    });
};

export const getRelationships = (req, res) => {
    const q = req.query.type == "Gợi ý" ?
        "SELECT DISTINCT t2.id, t2.username, t2.avater FROM relationships as t1 INNER JOIN users as t2 ON t1.sender_Id != t2.id WHERE t1.status = 'accepted' AND t2.id !=? ORDER BY t2.id ASC LIMIT 6" :
        "SELECT DISTINCT t2.id, t2.username, t2.avater FROM relationships as t1 INNER JOIN users as t2 ON t1.recipient_Id = t2.id WHERE t1.sender_Id=? AND t1.status =? ORDER BY t2.id ASC"
    // "SELECT DISTINCT t2.id, t2.username, t2.avater FROM relationships as t1 INNER JOIN users as t2 ON t1.sender_Id != t2.id WHERE t1.status = 'accepted' AND t2.id !=? ORDER BY t2.id ASC LIMIT 6" :
    // "SELECT recipient_Id FROM relationships  WHERE sender_Id=? AND status=accepted";
    const p = req.query.type == "Gợi ý" ? [req.query.recipientId] : [req.query.recipientId, req.query.status]

    db.query(q, p, (err, data) => {
        if (err) return res.status(500).json(err);


        // req.query.type !== "Gợi ý" ? data && data.forEach(user => {
        //     const q2 = "SELECT id,username,avater FROM users WHERE id =?";
        //     db.query(q2, [user.sender_Id], (err, userData) => {

        //         if (err) {
        //             console.error(err);
        //         } else {
        //             userDataArray.push(userData[0]);
        //         }
        //     });
        // }) : userDataArray = data;

        // setTimeout(() => {
        //     return res.status(200).json(userDataArray);
        // }, 2000)

        return res.status(200).json(data);
    })
};

export const addRelationship = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO relationships (`recipient_Id`,`sender_Id`,`status`) VALUES (?)";
        const values = [
            req.body.recipientId,
            userInfo.id,
            "pending"
        ];
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Invitation sent");
        });
    });
}


export const confimRelationship = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {

        if (err) return res.status(403).json("Token is not valid!");
        const q = "UPDATE relationships SET `status`='accepted' WHERE `recipient_Id`=? AND `sender_Id`=?";

        db.query(q, [userInfo.id, req.body.senderId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Have become friends");
        });
    });
}

export const deleteRelationship = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q = "DELETE FROM relationships WHERE `recipient_Id` = ? AND `sender_Id` = ?";

        db.query(q, [userInfo.id, req.query.sender], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Delete Friend");
        });
    });
};