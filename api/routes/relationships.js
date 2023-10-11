import express from "express";
import { addRelationship, confimRelationship, deleteRelationship, getRelationships } from "../controllers/relationship.js";

const roter = express.Router()

roter.get("/",getRelationships);
roter.post("/",addRelationship);
roter.put("/",confimRelationship);
roter.delete("/",deleteRelationship);

export default roter;

