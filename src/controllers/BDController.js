import BDModel from "../models/BDModel.js"; 
import dotenv from "dotenv"; 
dotenv.config();

const createQuestion = (req, res) => {
    const { questions } = req.body;
    BDModel.saveQuestionsToDB(questions)
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
const getMoodleCourses = async (req, res) => {
    try {
        const courses = await BDModel.fetchMoodleCourses();
        res.status(200).json({ courses });
    } catch (error) {
        console.error("Error fetching Moodle courses:", error);
        res.status(500).json({ error: "Error occurred fetching Moodle courses" });
    }
};

export default {createQuestion, getMoodleCourses};