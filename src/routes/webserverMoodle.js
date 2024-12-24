import express from 'express';
import createQuestion from "../controllers/webserverController.js";
import dotenv from "dotenv"; 
dotenv.config();


const router = express.Router();

router.post('/', createQuestion)

export default router;
