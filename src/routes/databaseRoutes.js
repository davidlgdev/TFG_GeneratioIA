import express from 'express';
import BDController from "../controllers/BDController.js";
import dotenv from "dotenv"; 
dotenv.config();


const router = express.Router();

router.post('/', BDController.createQuestion); 
router.get('/courses', BDController.getMoodleCourses)
export default router;
