import express from 'express';
import handlePrompt from "../controllers/AIController.js";
import dotenv from "dotenv"; 
dotenv.config();


const router = express.Router();

router.post('/', handlePrompt); //Cualquier solicitud POST de la generacion IA sera manejada aqui

export default router;
