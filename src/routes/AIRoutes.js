import express from 'express';
import handlePrompt from "../controllers/AIController.js";


const router = express.Router();

router.post('/', handlePrompt); //Cualquier solicitud POST de la generacion IA sera manejada aqui

export default router;
