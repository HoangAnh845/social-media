import jwt from "jsonwebtoken";
import db from "../connect.js"
import bcrypt from "bcryptjs"

export const register = (req, res) => {
    console.log("LOG_____",req.body)
    const qCheck = "SELECT * FROM users WHERE username=?";

    // if the user exists
    db.query(qCheck, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length) return res.status(409).json("User already exists!")
    })

    // Create a new user
    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const qInsert = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

    const values = [
        req.body.username,
        req.body.email,
        hashedPassword,
        req.body.name
    ];

    db.query(qInsert, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
    })

}

export const login = (req, res) => {
    const qFind = "SELECT * FROM users WHERE username=?";

    db.query(qFind,[req.body.username],(err,data)=>{
        if(err) return res.status(500).json(err)
        if(data.length === 0) return res.status(400).json("User not found!");

        // Encrypt password with user password
        const checkPasssword = bcrypt.compareSync(
            req.body.password,
            data[0].password
        );

        if(!checkPasssword) return res.status(400).json("Wrong username or password!");

        // Crete Token JWT
        const token = jwt.sign({id:data[0].id},"secretkey");
        // Delete password
        const {password,...orther} = data[0];
        res.cookie("accessToken", token,{
            httpOnly: true,
        }).status(200).json(orther);


    })

}

export const logout = (req, res) => {
    res.clearCookie("accessToken",{
        secure: true,
        sameSite: "none"
    }).status(200).json("User has been logged out.")
}