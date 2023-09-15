import express from "express";
import { getUser } from "../controllers/user.js";

const roter = express.Router()

roter.get("/find/:userId",getUser)

export default roter;

