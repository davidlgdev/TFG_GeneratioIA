import express from 'express';
import handlePrompt from "../controllers/AIController.js";
import dotenv from "dotenv"; 
dotenv.config();


const router = express.Router();

router.post('/', handlePrompt); //Any POST request for AI generation will be handled here

export default router;
