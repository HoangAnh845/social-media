import express from "express";
import { login, register, logout } from "../controllers/auth.js";

const roter = express.Router()

roter.post("/login",login);
roter.post("/register",register);
roter.post("/logout",logout);

export default roter;

