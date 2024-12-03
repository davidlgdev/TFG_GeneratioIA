import express from 'express';
import createQuestion from "../controllers/BDController.js";
import dotenv from "dotenv"; 
dotenv.config();


const router = express.Router();

router.post('/', createQuestion); 
export default router;
