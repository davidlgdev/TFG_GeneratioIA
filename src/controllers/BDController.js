import saveQuestionsToDB from "../models/BDModel.js"; 
import dotenv from "dotenv"; 
dotenv.config();

const createQuestion = (req, res) => {
    const { questions } = req.body;
    saveQuestionsToDB(questions)
        .then(savedQuestions => {
            res.status(201).json({
                message: "Data saved successfully.",
                questions: savedQuestions,
            });
        })
        .catch(error => {
            console.error("Error saving the data:", error);
            res.status(500).json({ error: "Error occurred saving the data" });
        });
};

export default createQuestion;