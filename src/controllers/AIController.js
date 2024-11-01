import generationQuestionAI from "../models/AIModel.js"; 
import dotenv from "dotenv"; 
dotenv.config();

const handlePrompt = (req,res) =>{
    const prompt = req.body.prompt;
    generationQuestionAI(prompt)
    .then(response => {
        res.json({ generatedQuestion: response });
    })
    .catch(error => {
        console.log("error generating question: ", error);
    })
}

export default handlePrompt;